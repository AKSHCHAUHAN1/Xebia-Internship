const express = require('express');
const db = require('../db/setup');

const router = express.Router();

// Submit a claim for an item
router.post('/', (req, res) => {
  const { itemId, claimerName, claimerEmail, answer } = req.body;

  if (!itemId || !claimerName || !claimerEmail || !answer) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Check if item exists and is active
  db.get('SELECT * FROM Items WHERE id = ?', [itemId], (err, item) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.status !== 'active') return res.status(400).json({ error: 'Item is not available for claiming' });

    // Insert claim
    db.run(
      'INSERT INTO Claims (itemId, claimerName, claimerEmail, answer) VALUES (?, ?, ?, ?)',
      [itemId, claimerName, claimerEmail, answer],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // Optionally update item status to 'claimed' or leave as active until claim is approved
        db.run('UPDATE Items SET status = ? WHERE id = ?', ['pending_claim', itemId]);
        
        res.status(201).json({ message: 'Claim submitted successfully', claimId: this.lastID });
      }
    );
  });
});

module.exports = router;
