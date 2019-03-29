const mongoose = require('mongoose');

const AudienceLogSchema = new mongoose.Schema({
    device: {
        type: Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: Schema.Types.ObjectId,
        required: true
    },
    startDate:{
        type: Date
    },
    duration:{
        type: Number
    },
    contentDuration:{
        type: Number
    },
    minAge:{
        type: Number
    },
    estAge:{
        type: Number
    },
    maxAge:{
        type: Number
    },
    gender: String,
    objectType: String,
    status:{
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true });


const AudienceLog = mongoose.model('AudienceLog', AudienceLogSchema);

module.exports = AudienceLog;
