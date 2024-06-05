const cron = require('node-cron');
const Graft = require('./models/Graft');
const Notification = require('./models/Notification');

cron.schedule('0 0 * * *', async () => {
    const today = new Date();

    // Newly usable bones
    const newlyUsableBones = await Graft.find({
        usableDate: { $lte: today },
        status: 'available'
    });

    newlyUsableBones.forEach(async bone => {
        await new Notification({
            userId: bone.consultantSurgeon, // assuming this is the user to notify
            message: `The bone with ID ${bone._id} is now usable.`
        }).save();
    });

    // Expiring bones
    const expiringBones = await Graft.find({
        expirationDate: { $lte: moment(today).add(1, 'month').toDate() },
        status: { $ne: 'expired' }
    });

    expiringBones.forEach(async bone => {
        await new Notification({
            userId: bone.consultantSurgeon,
            message: `The bone with ID ${bone._id} is nearing expiration.`
        }).save();
    });
});
