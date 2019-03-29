const AudienceLog = require('../models/AudienceLog');


module.exports = {
    create: function(audienceLogData, callback){
        try {
            const oAudienceLog = new AudienceLog();
            oAudienceLog.duration = 1;
            oAudienceLog.save(function (error) {
                if (error) {
                    return callback(520, 'save log', 500, null);
                }
                return callback(null, null, 200, oAudienceLog);
            });
        }catch(error){
            return callback(521, 'system', 500, null);
        }
    },
};