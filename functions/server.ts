import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory purchase tokens to prevent replay attacks in dev
const consumedTokens = new Set<string>();

/**
 * Endpoint: POST /validateScore
 */
app.post('/validateScore', (req, res) => {
  const { uid, score, movesCount, durationSeconds } = req.body;

  if (!uid || typeof score !== 'number' || typeof movesCount !== 'number' || movesCount <= 0) {
    return res.status(400).json({ error: 'Malformed score data' });
  }

  const maxPlausibleScore = movesCount * 2500 + 1000;
  if (score > maxPlausibleScore) {
    return res.status(400).json({
      valid: false,
      error: 'Score exceeds plausible moves threshold',
    });
  }

  if (durationSeconds > 0 && durationSeconds < movesCount * 0.25) {
    return res.status(400).json({
      valid: false,
      error: 'Move duration is physically impossible',
    });
  }

  return res.json({ valid: true, score });
});

/**
 * Endpoint: POST /verifyPurchase
 */
app.post('/verifyPurchase', (req, res) => {
  const { uid, productId, purchaseToken, platform } = req.body;

  if (!uid || !productId || !purchaseToken) {
    return res.status(400).json({ error: 'Missing purchase details' });
  }

  if (consumedTokens.has(purchaseToken)) {
    return res.status(409).json({ error: 'Purchase token already consumed' });
  }

  consumedTokens.add(purchaseToken);

  return res.json({
    success: true,
    productId,
    platform: platform || 'sandbox',
    status: 'VERIFIED',
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Glam Blocks backend server running on port ${PORT}`);
});
