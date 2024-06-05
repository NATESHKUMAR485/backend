const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a user
router.get('/', async (req, res) => {
    try {
        // Assume user ID is available via user session or token
        const notifications = await Notification.find({ userId: req.user.id });
        res.json(notifications);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
