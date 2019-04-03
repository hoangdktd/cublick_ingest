const mongoose = require('mongoose');

const ViewLogSchema = new mongoose.Schema({
    device: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    startDate:{
        type: Date
    },
    view:{
        type: Number
    },
    impression:{
        type: Number
    },
    grp:{
        type: Number
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true });


const ViewLog = mongoose.model('ViewLog', ViewLogSchema);

module.exports = ViewLog;
