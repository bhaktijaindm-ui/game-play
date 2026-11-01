import { test, expect } from '@playwright/test';

test.describe('Glam Blocks E2E Mobile User Journey', () => {
  test('Complete flow: Splash -> Onboarding -> Guest Auth -> Play -> Theme Switch -> Shop -> Delete Account', async ({
    page,
  }) => {
    // 1. Visit App & verify Splash Screen
    await page.goto('/');
    await expect(page.locator('text=Glam Blocks')).toBeVisible();

    // 2. Onboarding appears after splash
    await page.waitForTimeout(1600);
    const skipBtn = page.getByRole('button', { name: /Skip/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }

    // 3. Auth Screen & Consent Checkboxes
    const termsCheckbox = page.locator('text=Terms').locator('..');
    await termsCheckbox.click();

    // Click Guest Mode
    const guestLink = page.getByRole('button', { name: /Play as Guest/i });
    await guestLink.click();

    // 4. Verify Home Screen HUD
    await expect(page.getByRole('button', { name: /PLAY/i })).toBeVisible();

    // 5. Start Game
    await page.getByRole('button', { name: /PLAY/i }).click();
    await expect(page.locator('text=Score')).toBeVisible();

    // Verify 8x8 Grid exists
    const gridCells = page.locator('[data-row]');
    expect(await gridCells.count()).toBe(64);

    // 6. Navigate Home from Pause Menu
    const pauseBtn = page.getByRole('button', { name: /Pause game/i });
    await pauseBtn.click();
    await page.getByRole('button', { name: /Quit to Home/i }).click();
    await expect(page.getByRole('button', { name: /PLAY/i })).toBeVisible();

    // 7. Open Settings & Toggle Dark Theme
    const settingsBtn = page.getByRole('button', { name: /Settings/i });
    await settingsBtn.click();
    await expect(page.locator('text=Theme Appearance')).toBeVisible();

    const darkToggle = page.getByRole('button', { name: /Dark/i });
    await darkToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // 8. Open Shop & Demo Purchase
    await page.getByRole('button', { name: /Back/i }).click();
    const shopBtn = page.getByRole('button', { name: /Shop/i });
    await shopBtn.click();
    await expect(page.locator('text=Glam Beauty Shop')).toBeVisible();

    // Click Get Bundle (opens confirmation modal)
    const bundleBtn = page.getByRole('button', { name: /Get Bundle/i });
    await bundleBtn.click();
    const confirmBtn = page.getByRole('button', { name: /Confirm/i });
    await confirmBtn.click();

    // 9. Back to Settings & Delete Account
    await page.getByRole('button', { name: /Back/i }).click();
    await page.getByRole('button', { name: /Settings/i }).click();

    const deleteBtn = page.getByRole('button', { name: /Delete Account/i });
    await deleteBtn.click();
    const confirmDeleteBtn = page.getByRole('button', { name: /Delete All/i });
    await confirmDeleteBtn.click();

    // Back to Auth/Guest Welcome screen
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });
});
