const TimeSchedule = require('../models/TimeSchedule');

module.exports = {
    create: (timeScheduleData, callback) => {
        try {
            const oTimeSchedule = new TimeSchedule();
            oTimeSchedule.startDate = timeScheduleData.startDate;
            oTimeSchedule.endDate = timeScheduleData.endDate;
            oTimeSchedule.totalRecord = timeScheduleData.totalRecord;
            oTimeSchedule.lastRecordId = timeScheduleData.lastRecordId;
            oTimeSchedule.firstRecordId = timeScheduleData.firstRecordId;
            oTimeSchedule.save( (error) => {
                console.log('insert view log');
                if (error) {
                    // console.log(error);
                    return callback(520, 'save time error', 500, null);
                }
                return callback(null, null, 200, oTimeSchedule);
            });
        }catch(error){
            return callback(521, 'system', 500, null);
        }
    },

    getOne: function( queryContent, callback){
        try {
            const query = {};
            if (queryContent.id) {
                query._id = queryContent.id;
            }
            TimeSchedule.findOne(query, function(error, timeScheduleInfo){
                if (error) {
                    return callback(520, 'find time schedule', 500, null);
                }
                return callback(null, null, 200, timeScheduleInfo);
            }) ;
        }catch(error){
            return callback(521, 'system', 500, null);
        }
    },

    getOneNewest: function( callback){
        try {
            TimeSchedule.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(error, timeScheduleInfo){
                if (error) {
                    return callback(520, 'find time schedule', 500, null);
                }
                return callback(null, null, 200, timeScheduleInfo);
            }) ;
        }catch(error){
            return callback(521, 'system', 500, null);
        }
    },

    getAll: function( queryContent, callback){
        try {


            TimeSchedule.find({"createdDate": {"$gte": queryContent.startDate, "$lte": queryContent.endDate}}, function (error, results) {
                if (error) {
                    return callback(520, 'get list user', 500, null);
                }
                return callback(null, null, 200, results);
            });
        }catch(error){
            return callback(521, 'system', 500, null);
        }
    }
};