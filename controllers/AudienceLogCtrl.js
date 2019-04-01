const AudienceLogManager = require('../manager/AudienceLogManager');
const oRest = require('../utils/restware');
const cronJob = require('cron').CronJob;
module.exports = {


    ////// POST

    create: (req, res) => {
        // const oAudienceLogData = req.body || '';
        const oAudienceLog = {};
        oAudienceLog.device = Math.floor(Math.random() * 100);
        oAudienceLog.content = Math.floor(Math.random() * 1000)
        oAudienceLog.startDate = Date.now();
        oAudienceLog.duration = Math.floor(Math.random() * 60);
        oAudienceLog.contentDuration = 60;
        oAudienceLog.createdDate = Date.now();
        AudienceLogManager.create( oAudienceLog, function (errorCode, errorMessage, httpCode, oAudienceLog) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            return oRest.sendSuccess(res, oAudienceLog, httpCode);
        });
    },

    autoCreate: (req, res) => {
        // const oAudienceLogData = req.body || '';

        const oAudienceLog = {};
        oAudienceLog.device = Math.floor(Math.random() * 100);
        oAudienceLog.content = Math.floor(Math.random() * 1000)
        const job = new cronJob('*/10 * * * * *',
            function (){
                try {
                    const d = new Date();
                    const count = Math.floor(Math.random() * 15);
                    console.log('count   =    ' + count);
                    for (let index = 0; index < count; index++) {
                        oAudienceLog.startDate = Date.now();
                        oAudienceLog.duration = Math.floor(Math.random() * 60);
                        oAudienceLog.contentDuration = 60;
                        oAudienceLog.createdDate = Date.now();
                        console.log(oAudienceLog);
                        console.log('start audience log JOB: ' + Date());
                        console.log('start audience log JOB: ' + d.getSeconds());
                        if (d.getSeconds() === 0) {
                            oAudienceLog.device = Math.floor(Math.random() * 100);
                            oAudienceLog.content = Math.floor(Math.random() * 1000);
                        }
                        AudienceLogManager.create( oAudienceLog, function (errorCode, errorMessage, httpCode, oAudienceLog) {
                        });

                        console.log('index === ' + index);
                    }
                }catch(error){
                    console.log('audience log job error: ' + error);
                }
            }, function(){
                console.log('audience log JOB Stop: '+Date());
            },
            true,
            'America/Los_Angeles'
        );
        console.log('post audience');
        return oRest.sendSuccess(res, 'oResData', 200);
    },

    getAll: (req, res) => {
        const queryContent = {};
        queryContent.startDate = new Date('2019-3-31');
        queryContent.endDate = new Date('2019-4-1');
        AudienceLogManager.getAll(queryContent, function (errorCode, errorMessage, httpCode, oAudienceLog) {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            return oRest.sendSuccess(res, oAudienceLog, httpCode);
        });
    }
};