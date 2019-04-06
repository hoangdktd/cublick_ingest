const AudienceLog = require('../models/AudienceLog');
const oValidator = require('validator');

module.exports = {
    create: (audienceLogData, callback) => {
        try {
            const oAudienceLog = new AudienceLog();
            oAudienceLog.device = audienceLogData.device;
            oAudienceLog.content = audienceLogData.content;
            oAudienceLog.startDate = audienceLogData.startDate;
            oAudienceLog.duration = audienceLogData.duration;
            oAudienceLog.contentDuration = audienceLogData.contentDuration;
            oAudienceLog.createdDate = audienceLogData.createdDate;
            oAudienceLog.save( (error) => {
                if (error) {
                    return callback(520, 'save log', 500, null);
                }
                return callback(null, null, 200, oAudienceLog);
            });
        }catch(error){
            return callback(521, 'system', 500, null);
        }
    },

    getAll: function( queryContent, callback){
        try {


            AudienceLog.find({"createdDate": {"$gte": queryContent.startDate, "$lte": queryContent.endDate}}, function (error, results) {
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