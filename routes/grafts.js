const express = require('express');
const router = express.Router();
const Graft = require('../models/Graft');
const auth = require('../middleware/auth');
// const moment = require('moment');

router.get('/some-protected-route', auth, (req, res) => {
    res.json({ msg: 'This is a protected route' });
});


router.get('/search', async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const grafts = await Graft.find({ $text: { $search: searchTerm } });
        res.json(grafts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get all grafts
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
        const grafts = await Graft.find()
                                  .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
                                //   .limit(limit * 1)
                                  .skip((page - 1) * limit)
                                  .populate('consultantSurgeon', 'name')
                                  .exec();
        res.json(grafts);
        const count = await Graft.countDocuments();
        console.log(count);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get a single graft by ID
router.get('/:id', async (req, res) => {
    try {
        const graft = await Graft.findById(req.params.id).populate('consultantSurgeon');
        if (!graft) {
            return res.status(404).json({ msg: 'Graft not found' });
        }
        res.json(graft);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add a new graft
router.post('/', async (req, res) => {
    try {
        const newGraft = new Graft(req.body);
        const graft = await newGraft.save();
        console.log(graft);
        res.json(graft);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update a graft
router.put('/:id', async (req, res) => {
    try {
        const graft = await Graft.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!graft) {
            return res.status(404).json({ msg: 'Graft not found' });
        }
        res.json(graft);
    } catch (err) {
        res.status(500).send('Server error');
    }
});


// Get graft by donorNo
router.get('/:donorNo', async (req, res) => {
    try {
        const graft = await Graft.findOne({ donorNo: req.params.donorNo });
        if (!graft) {
            return res.status(404).json({ msg: 'Graft not found' });
        }
        res.json({ id: graft._id });
    } catch (err) {
        res.status(500).send('Server error');
    }
});


// Delete a graft
router.delete('/:id', async (req, res) => {
    try {
        // const graft = await Graft.findById(req.params.id);
        
        // if (!graft) {
        //     return res.status(404).json({ msg: 'Graft not found' });
        // }
        // await graft.delete();
        if(await Graft.findByIdAndDelete(req.params.id)){

        res.json({ msg: 'Graft removed' });
        }
        else{
            res.status(404).json({ msg: 'Graft not found' });
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});



// GET total count of grafts
router.get('/total', async (req, res) => {
    console.log("Total Grafts");
    try {
        console.log("Total Grafts");
        const count = await Graft.countDocuments();
        res.json({ totalGrafts: count });
    } catch (err) {
        console.error("Failed to get total graft count:", err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/t', async (req, res) => {
    try{
        console.log("Total Grafts");
        const count = await Graft.countDocuments();
        res.json(count);
    }
    catch(err){
        console.error("Failed to get total graft count:", err.message);
        res.status(500).send('Server Error 1 ');
    }
}
);

// GET count of usable grafts
router.get('/usable', async (req, res) => {
    const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));
    try {
        const count = await Graft.countDocuments({
            addedDate: { $gte: sixMonthsAgo },
            status: { $nin: ['used', 'expired'] }
        });
        res.json({ usableGrafts: count });
    } catch (err) {
        console.error("Failed to get usable graft count:", err.message);
        res.status(500).send('Server Error');
    }
});


// GET count of used grafts
router.get('/used', async (req, res) => {
    try {
        const count = await Graft.countDocuments({ status: 'used' });
        res.json({ usedGrafts: count });
    } catch (err) {
        console.error("Failed to get used graft count:", err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/api/grafts/count', async (req, res) => {
    try {
        const count = await Graft.countDocuments({});
        res.json(count);
    } catch (error) {
        res.status(500).send('Server error');
        console.error('Database count failed:', error);
    }
});


module.exports = router;
