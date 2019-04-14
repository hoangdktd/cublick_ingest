const TimeScheduleManager = require('../manager/TimeScheduleManager');
const oRest = require('../utils/restware');
module.exports = {

    testGetAllTimeSchedule:  (req, res) => {
        const queryContent = {};
        queryContent.startDate = new Date('2019-04-01T12:10:00Z');
        queryContent.endDate = new Date('2019-04-09T12:20:00Z');
        TimeScheduleManager.getAll(queryContent, (errorCode, errorMessage, httpCode, timeScheduleLogs) => {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            if (timeScheduleLogs.length > 0) {
                let total  = 0;
                for(let key in timeScheduleLogs) {
                    const timeScheduleLog = timeScheduleLogs[key]
                    total = total + parseInt(timeScheduleLog.totalRecord);
                }
                return oRest.sendSuccess(res, total, httpCode);
            } else {
                return oRest.sendSuccess(res, [], httpCode);
            }
        });
    }
};