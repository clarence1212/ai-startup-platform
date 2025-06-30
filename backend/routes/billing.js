const router = require('express').Router();

// Placeholder billing routes
router.get('/status', (req, res) => {
  res.json({ status: 'Billing system ready' });
});

router.post('/create-subscription', (req, res) => {
  res.json({ message: 'Subscription endpoint - Stripe integration needed' });
});

module.exports = router;
