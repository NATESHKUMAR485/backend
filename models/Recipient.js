const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipientSchema = new Schema({
    recipientName: {
        type: String,
        required: true,
        trim: true
    },
    cnic: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{13}$/, 'Please enter a valid CNIC number']
    },
    phoneNo: {
        type: String,
        required: true,
        match: [/^\d{10,11}$/, 'Please enter a valid phone number']
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    dateOfSurgery: {
        type: Date,
        required: true
    },
    boneName: {
        type: String,
        required: true
    },
    boneId: {
        // type: Schema.Types.ObjectId,
        type: String,
        ref: 'Bone',
        required: true
    },
    surgeonId: {
        type: Schema.Types.ObjectId,
        ref: 'Surgeon',
        required: true
    }
}, {
    timestamps: true
});

const Recipient = mongoose.model('Recipient', recipientSchema);
module.exports = Recipient;
