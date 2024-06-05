const express = require('express');
const router = express.Router();
const Recipient = require('../models/Recipient');
const auth = require('../middleware/auth');

router.get('/some-protected-route', auth, (req, res) => {
    res.json({ msg: 'This is a protected route' });
});

// Get all recipients
router.get('/', async (req, res) => {
    try {
        const recipients = await Recipient.find();
        res.json(recipients);
    } catch (err) {
        res.status(500).send('Server error');
    }
});




// Get a single recipient by ID
router.get('/:id', async (req, res) => {
    try {
        const recipient = await Recipient.findById(req.params.id);
        if (!recipient) {
            return res.status(404).json({ msg: 'Recipient not found' });
        }
        res.json(recipient);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Create a new recipient
router.post('/', async (req, res) => {
    try {
        const newRecipient = new Recipient(req.body);
        const recipient = await newRecipient.save();
        res.json(recipient);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update a recipient
router.put('/:id', async (req, res) => {
    try {
        const recipient = await Recipient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(recipient);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete a recipient
router.delete('/:id', async (req, res) => {
    try {
        await Recipient.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Recipient deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
