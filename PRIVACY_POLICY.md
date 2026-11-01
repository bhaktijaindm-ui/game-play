# Privacy Policy for Glam Blocks

**Last Updated:** November 2026  
**Effective Date:** November 2026  
**Contact Email:** privacy@glamblocks.game  

---

## 1. Introduction & Scope
Glam Blocks ("we", "our", or "the Game") is a makeup-themed mobile block puzzle game. We are dedicated to transparent data stewardship and protecting user privacy in compliance with:
- The European Union **General Data Protection Regulation (GDPR)**
- India's **Digital Personal Data Protection Act (DPDP Act, 2023)**
- California Consumer Privacy Act (**CCPA/CPRA**)

---

## 2. Age Requirement (13+ Only)
Glam Blocks is intended strictly for users aged **13 and older** (or the applicable digital age of consent in your country). We do not knowingly solicit or collect personal information from children under 13. If you believe a child has provided data without parental consent, please contact us at `privacy@glamblocks.game` for immediate deletion.

---

## 3. Information We Collect
We practice strict data minimization. We only collect information essential for game operations:

1. **Authentication Data (Optional Real Account)**:
   - If you register via Email: We store your email address and display name in your private Firestore document.
   - If you sign in via Google: We store your public display name, email, and avatar photo URL.
   - If you play in **Guest Mode**: A randomized string ID is generated and stored locally in your browser/device's `localStorage`. No personal identity is transmitted to our servers.

2. **Gameplay & Progress Data**:
   - Best score, current level, coin and gem virtual balances, unlocked avatar looks, and equipped look.
   - Game board matrix state saved to local storage for offline resumption.

3. **Locale & Region**:
   - Country code inferred purely from your device timezone and language setting (e.g., `IN` for India, `US` for United States). We **NEVER** request or access precise GPS location.

4. **Marketing Consent (Explicit Opt-In Only)**:
   - We store `marketingConsent: true` only if you explicitly and voluntarily check the optional promotional email box during signup. Consent timestamps and IP country are logged for audit compliance.

---

## 4. How We Use Your Data
- Synchronize your gameplay, high scores, and cosmetics across devices.
- Generate weekly global "Hall of Glam" leaderboard rankings.
- Verify in-app purchases through official platform stores (Google Play Billing).
- Distribute promotional event updates **only** to users with active marketing consent.
- **We NEVER sell, rent, or trade your personal data to data brokers or third-party advertisers.**

---

## 5. Third-Party Services
The Game utilizes secure, reputable infrastructure providers:
- **Google Firebase**: Authentication, Cloud Firestore (encrypted in transit via TLS 1.3 and at rest via AES-256), App Check.
- **Google Play Billing**: For processing digital goods and subscriptions. Payment details are handled entirely by Google; we never receive or store credit card numbers.

---

## 6. Your Rights & Account Deletion
Under GDPR and India DPDP principles, you have the right to:
- Access and inspect the data stored about you.
- Withdraw marketing consent at any time.
- **Right to Erasure ("Delete My Account and Data")**:
  - We provide an instant, in-app deletion button in **Settings -> Account -> Delete Account**.
  - Clicking this permanently wipes your Firebase Auth record, Firestore user document, score history, and local storage data immediately.

---

## 7. Security Measures
- All network communication requires HTTPS with strict Content-Security-Policy (CSP) headers.
- Firestore Security Rules enforce that users can access only their own records.
- Financial fields (`coins`, `gems`, `purchases`) cannot be modified directly by client applications.

---

## 8. Inquiries
For privacy questions, access requests, or regulatory inquiries, contact:  
**Data Protection Officer:** `privacy@glamblocks.game`
