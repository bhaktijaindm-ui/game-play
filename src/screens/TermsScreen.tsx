import React from 'react';
import { ChevronLeft, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const TermsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
          Terms of Service
        </h2>
        <div className="w-11" />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 text-xs text-game-text leading-relaxed">
        <Card variant="surface" padding="md">
          <div className="flex items-center gap-2 text-game-primary font-bold mb-2">
            <FileText className="w-5 h-5" />
            <span>Glam Blocks Terms &amp; Conditions</span>
          </div>
          <p className="text-game-muted mb-2">
            Last Updated: November 2026
          </p>

          <h4 className="font-heading font-bold text-sm text-game-text mt-3 mb-1">
            1. Acceptance of Terms
          </h4>
          <p className="text-game-muted">
            By installing, accessing, or playing Glam Blocks, you agree to these Terms of Service. If you disagree with any part of these terms, please discontinue use immediately.
          </p>

          <h4 className="font-heading font-bold text-sm text-game-text mt-3 mb-1">
            2. Virtual Currency &amp; In-App Purchases
          </h4>
          <p className="text-game-muted">
            Coins, Gems, and Glam Pass subscriptions are digital virtual items with no real-world cash equivalence. All purchases made through authorized application stores (e.g., Google Play Billing) are subject to platform billing policies and are non-refundable once consumed, except as required by applicable consumer law.
          </p>

          <h4 className="font-heading font-bold text-sm text-game-text mt-3 mb-1">
            3. Fair Play &amp; Anti-Cheating
          </h4>
          <p className="text-game-muted">
            Any attempt to manipulate game memory, artificially submit fabricated scores, reverse-engineer game mechanics, or exploit glitches to gain an unfair advantage will result in disqualification from the weekly leaderboard and potential account termination.
          </p>

          <h4 className="font-heading font-bold text-sm text-game-text mt-3 mb-1">
            4. Limitation of Liability
          </h4>
          <p className="text-game-muted">
            Glam Blocks is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We are not liable for gameplay interruptions resulting from hardware malfunctions, network outages, or device incompatibility.
          </p>

          <h4 className="font-heading font-bold text-sm text-game-text mt-3 mb-1">
            5. Termination
          </h4>
          <p className="text-game-muted">
            You may terminate this agreement at any time by deleting your account via Settings or uninstalling the application.
          </p>
        </Card>
      </div>
    </div>
  );
};
