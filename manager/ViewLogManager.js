const ViewLog = require('../models/ViewLog');

module.exports = {
    create: (audienceLogData, callback) => {
        try {
            const oViewLog = new ViewLog();
            oViewLog.device = audienceLogData.device;
            oViewLog.content = audienceLogData.content;
            oViewLog.startDate = audienceLogData.startDate;
            oViewLog.view = audienceLogData.view;
            oViewLog.impression = audienceLogData.impression;
            oViewLog.grp = audienceLogData.grp;
            // oViewLog.createdDate = audienceLogData.createdDate;
            oViewLog.save( (error) => {
                console.log('insert view log');
                if (error) {
                    // console.log(error);
                    return callback(520, 'save log error', 500, null);
                }
                return callback(null, null, 200, oViewLog);
            });
        }catch(error){
            return callback(521, 'system', 500, null);
        }
    },

    getAll: function( queryContent, callback){
        try {


            ViewLog.find({"createdDate": {"$gte": queryContent.startDate, "$lte": queryContent.endDate}}, function (error, results) {
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