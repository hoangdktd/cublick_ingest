const AudienceLogManager = require('../manager/AudienceLogManager');
const oRest = require('../utils/restware');
module.exports = {


    ////// POST

    create: function (req, res) {
        const oAudienceLogData = req.body || '';

        AudienceLogManager.create( oAudienceLogData, function (errorCode, errorMessage, httpCode, oAudienceLog) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            return oRest.sendSuccess(res, oAudienceLog, httpCode);
        })
    },
};