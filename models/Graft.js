const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const graftSchema = new Schema({
    donorNumber: {
        type: String,
        required: true
    },
    donorName: {
        type: String,
        required: true
    },
    cnic: String,
    medicalRecordNumber: String,
    dateOfBirth: Date,
    age: Number,
    gender: String,
    fatherOrHusbandsName: String,
    contactNumber: String,
    dateOfAdmission: Date,
    dateOfSurgery: Date,
    procedureUndertaken: String,
    graftNumber: String,
    femoralHead: Boolean,
    totalKneeReplacementCuts: Boolean,
    otherBone: String,
    tissueSpecified: String,
    histopathologySent: Boolean,
    histopathologyResult: String,
    tissueCulturesSent: Boolean,
    cbcSent: Boolean,
    cbcResult: String,
    esrSent: Boolean,
    esrResult: String,
    bloodGroup: String,
    hepatitisBSurfaceAntigenSent: Boolean,
    consultantSurgeon: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    anyProlongedDebilitatingIllness: String,
    status: {
        type: String,
        enum: ['available', 'reserved', 'used', 'expired'],
        required: true
    },
    addedDate: {
        type: Date,
        default: Date.now
    },
    usableDate: {
        type: Date,
        default: function() {
            return new Date(+new Date(this.addedDate) + 6*30*24*60*60*1000);
        }
    },
    expirationDate: {
        type: Date,
        default: function() {
            return new Date(+new Date(this.usableDate) + 2*365*24*60*60*1000);
        }
    }
});

// const graftSchema = new Schema({
//     donorNumber: {
//         type: String,
//         required: true
//     },
//     donorName: {
//         type: String,
//         required: true
//     },
//     donorInfo: {
//         cnic: String,
//         medicalRecordNumber: String,
//         dateOfBirth: Date,
//         age: Number,
//         gender: String,
//         fatherOrHusbandsName: String,
//         contactNumber: String,
//         dateOfAdmission: Date,
//         dateOfSurgery: Date,
//         procedureUndertaken: String
//     },
//     graftDetails: {
//         graftNumber: String,
//         femoralHead: Boolean,
//         totalKneeReplacementCuts: Boolean,
//         otherBone: String,
//         tissueSpecified: String,
//         histopathologySent: Boolean,
//         histopathologyResult: String,
//         tissueCulturesSent: Boolean
//     },
//     medicalTests: {
//         cbcSent: Boolean,
//         cbcResult: String,
//         esrSent: Boolean,
//         esrResult: String,
//         bloodGroup: String,
//         hepatitisBSurfaceAntigenSent: Boolean
//     },
//     consultantSurgeon: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     anyProlongedDebilitatingIllness: String,
//     status: {
//         type: String,
//         enum: ['available', 'reserved', 'used', 'expired'],
//         required: true
//     },
//     addedDate: {
//         type: Date,
//         default: Date.now
//     },
//     usableDate: {
//         type: Date,
//         default: function() {
//             return new Date(+new Date(this.addedDate) + 6*30*24*60*60*1000); // 6 months after addedDate
//         }
//     },
//     expirationDate: {
//         type: Date,
//         default: function() {
//             return new Date(+new Date(this.usableDate) + 2*365*24*60*60*1000); // 2 years after usableDate
//         }
//     }
// });



const Graft = mongoose.model('Graft', graftSchema);
module.exports = Graft;
