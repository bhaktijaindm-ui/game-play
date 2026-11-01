import React from 'react';
import { ChevronLeft, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const PrivacyPolicyScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-game-bg">
      <div className="flex items-center justify-between min-h-[44px] mb-3">
        <button
          onClick={onBack}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-game-surface border border-game-border text-game-muted hover:text-game-text"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-heading font-bold text-game-text">
          Privacy Policy
        </h2>
        <div className="w-11" />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 text-xs text-game-text leading-relaxed">
        <Card variant="surface" padding="md">
          <div className="flex items-center gap-2 text-game-primary font-bold mb-2">
            <Shield className="w-5 h-5" />
            <span>GDPR & India DPDP Privacy Notice</span>
          </div>
          <p className="text-game-muted mb-2">
            Effective Date: November 2026 • Version 1.0
          </p>
          <p className="mb-2">
            Glam Blocks (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy and is committed to protecting your personal data in full compliance with the European General Data Protection Regulation (GDPR) and the Digital Personal Data Protection Act (DPDP Act, India).
          </p>

          <h4 className="font-heading font-bold text-sm text-game-text mt-4 mb-1">
            1. Information We Collect
          </h4>
          <ul className="list-disc pl-4 space-y-1 text-game-muted">
            <li><strong>Account Data:</strong> If you sign in via Google or Email, we store your email, display name, and avatar preference. For Guest players, a randomized local identifier is stored in your device&apos;s localStorage only.</li>
            <li><strong>Gameplay Data:</strong> High scores, unlocked cosmetic looks, coin/gem virtual balances, and game state.</li>
            <li><strong>Technical &amp; Locale:</strong> Country code derived from your device&apos;s locale/timezone setting (we NEVER access your precise GPS location).</li>
            <li><strong>Marketing Consent:</strong> Explicit opt-in timestamp recorded only if you checked the optional promotional email box.</li>
          </ul>

          <h4 className="font-heading font-bold text-sm text-game-text mt-4 mb-1">
            2. How We Use Your Data
          </h4>
          <p className="text-game-muted">
            We process your information solely to: provide gameplay synchronization, display leaderboard rankings, verify store purchases, and send gameplay updates if you specifically opted in. We never sell, rent, or monetize your personal information to third-party data brokers.
          </p>

          <h4 className="font-heading font-bold text-sm text-game-text mt-4 mb-1">
            3. Age Limitation (13+)
          </h4>
          <p className="text-game-muted">
            Glam Blocks is intended for individuals aged 13 and older (or the applicable digital age of consent in your jurisdiction). We do not knowingly collect personal data from children under 13, and our services are not child-directed.
          </p>

          <h4 className="font-heading font-bold text-sm text-game-text mt-4 mb-1">
            4. Your Rights &amp; Account Deletion
          </h4>
          <p className="text-game-muted mb-2">
            You hold complete ownership of your data. You may request access, rectification, or immediate erasure of your records at any time.
          </p>
          <p className="text-game-muted">
            You can permanently wipe your account and all associated Firestore records immediately using the <strong>&quot;Delete Account &amp; Data&quot;</strong> button located inside Settings.
          </p>

          <h4 className="font-heading font-bold text-sm text-game-text mt-4 mb-1">
            5. Contact Information
          </h4>
          <p className="text-game-muted">
            For privacy inquiries or data rights requests, contact our Data Protection team at: <span className="text-game-primary font-semibold">privacy@glamblocks.game</span>.
          </p>
        </Card>
      </div>
    </div>
  );
};
