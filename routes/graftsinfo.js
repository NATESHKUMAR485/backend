const express = require('express');
const router = express.Router();
const Graft = require('../models/Graft'); // Adjust the path to your Graft model as necessary

// GET total count of grafts
router.get('/total', async (req, res) => {
    try {
        const total = await Graft.countDocuments({});
        res.json({ totalGrafts: total });
    } catch (err) {
        console.error('Error fetching total graft count:', err);
        res.status(500).send('Server Error');
    }
});

// // GET count of usable grafts
// router.get('/usable', async (req, res) => {
//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//     try {
//         const count = await Graft.countDocuments({
//             addedDate: { $lte: sixMonthsAgo }, // Less than or equal to 6 months ago
//             status: 'available' // Assuming only 'available' grafts are considered usable
//         });
//         res.json({ usableGrafts: count });
//     } catch (err) {
//         console.error('Error fetching usable graft count:', err);
//         res.status(500).send('Server Error');
//     }
// });


// GET count of usable grafts based on `usableDate`
router.get('/usable', async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part if necessary

    try {
        const count = await Graft.countDocuments({
            usableDate: { $lte: today }, // Usable date is today or earlier
            status: 'available' // Assuming only 'available' status grafts are considered usable
        });
        res.json({ usableGrafts: count });
    } catch (err) {
        console.error('Error fetching usable graft count:', err);
        res.status(500).send('Server Error');
    }
});


// GET count of used grafts
router.get('/used', async (req, res) => {
    try {
        const used = await Graft.countDocuments({ status: 'used' });
        res.json({ usedGrafts: used });
    } catch (err) {
        console.error('Error fetching used graft count:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
