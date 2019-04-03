const ViewLogManager = require('../manager/ViewLogManager');
const oRest = require('../utils/restware');
const cronJob = require('cron').CronJob;
module.exports = {
    getAll: (req, res) => {
        const queryContent = {};
        queryContent.startDate = new Date('2019-04-01T12:10:00Z');
        queryContent.endDate = new Date('2019-04-02T12:20:00Z');
        ViewLogManager.getAll(queryContent, (errorCode, errorMessage, httpCode, oViewLog) => {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            return oRest.sendSuccess(res, oViewLog, httpCode);
        });
    }
};