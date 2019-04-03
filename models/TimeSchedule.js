const mongoose = require('mongoose');

const TimeScheduleSchema = new mongoose.Schema({
    endDate:{
        type: Date
    },
    startDate:{
        type: Date
    },
    totalRecord:{
        type: Number
    },
    lastRecordId:{
        type: String
    },
    firstRecordId: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true });


const TimeSchedule = mongoose.model('TimeSchedule', TimeScheduleSchema);

module.exports = TimeSchedule;
