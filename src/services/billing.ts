import { PRODUCTS } from '../config/pricing.config';

export interface PurchaseResult {
  success: boolean;
  productId: string;
  purchaseToken?: string;
  isMock: boolean;
  error?: string;
}

export interface BillingProvider {
  isAvailable(): boolean;
  purchaseProduct(productId: string): Promise<PurchaseResult>;
}

/**
 * Play Store Digital Goods API Provider (for TWA / Google Play packaging)
 */
export class PlayBillingProvider implements BillingProvider {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'getDigitalGoodsService' in window;
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    try {
      const getDGS = (window as unknown as { getDigitalGoodsService?: (scope: string) => Promise<unknown> }).getDigitalGoodsService;
      if (!getDGS) {
        throw new Error('Digital Goods Service unavailable');
      }

      const service = (await getDGS('https://play.google.com/billing')) as {
        getDetails: (ids: string[]) => Promise<Array<{ itemId: string }>>;
      };

      if (!service) {
        throw new Error('Could not connect to Play Billing service');
      }

      // Use standard PaymentRequest for Play Billing
      const paymentMethodData = [
        {
          supportedMethods: 'https://play.google.com/billing',
          data: { sku: productId },
        },
      ];

      const request = new PaymentRequest(paymentMethodData, {
        total: {
          label: PRODUCTS[productId]?.name || 'Glam Blocks Purchase',
          amount: { currency: 'USD', value: '0.99' },
        },
      });

      const response = await request.show();
      await response.complete('success');

      return {
        success: true,
        productId,
        purchaseToken: `play_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        isMock: false,
      };
    } catch (err) {
      return {
        success: false,
        productId,
        isMock: false,
        error: (err as Error).message || 'Play Store purchase cancelled or failed',
      };
    }
  }
}

/**
 * Mock Billing Provider for web preview & development
 * Displays "Demo mode: no real charge"
 */
export class MockBillingProvider implements BillingProvider {
  isAvailable(): boolean {
    return true;
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    // Simulate brief network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      productId,
      purchaseToken: `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      isMock: true,
    };
  }
}

/**
 * Factory to return appropriate billing provider
 */
export function getBillingProvider(): BillingProvider {
  const playProvider = new PlayBillingProvider();
  if (playProvider.isAvailable()) {
    return playProvider;
  }
  return new MockBillingProvider();
}
