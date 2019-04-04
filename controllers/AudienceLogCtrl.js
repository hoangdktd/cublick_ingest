const AudienceLogManager = require('../manager/AudienceLogManager');
const ViewLogManager = require('../manager/ViewLogManager');
const TimeScheduleManager = require('../manager/TimeScheduleManager');
const oRest = require('../utils/restware');
const oUtils = require('../utils/utils');
const cronJob = require('cron').CronJob;
const constant = require('../utils/constant');
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
        AudienceLogManager.create( oAudienceLog, (errorCode, errorMessage, httpCode, oAudienceLog) => {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            return oRest.sendSuccess(res, oAudienceLog, httpCode);
        });
    },

    autoCreate: (req, res) => {
        // const oAudienceLogData = req.body || '';

        const oAudienceLog = {};
        oAudienceLog.device = constant.deviceIdEnum[Math.floor(Math.random() * constant.deviceIdEnum.length)];
        oAudienceLog.content = constant.contentIdEnum[Math.floor(Math.random() * constant.contentIdEnum.length)];
        const job = new cronJob('*/10 * * * * *',
            () => {
                try {
                    const d = new Date();
                    const count = Math.floor(Math.random() * 15) + 15;
                    console.log('count   =    ' + count);
                    if (d.getSeconds() === 0) {
                        oAudienceLog.device = Math.floor(Math.random() * 100);
                        oAudienceLog.content = Math.floor(Math.random() * 1000);
                    }
                    for (let index = 0; index < count; index++) {
                        oAudienceLog.startDate = Date.now();
                        oAudienceLog.duration = Math.floor(Math.random() * 20);
                        oAudienceLog.contentDuration = 60;
                        oAudienceLog.createdDate = Date.now();
                        console.log(oAudienceLog);
                        console.log('start audience log JOB: ' + Date());
                        console.log('start audience log JOB: ' + d.getSeconds());
                        AudienceLogManager.create( oAudienceLog, (errorCode, errorMessage, httpCode, oAudienceLog) => {
                        });

                        console.log('index === ' + index);
                    }
                }catch(error){
                    console.log('audience log job error: ' + error);
                }
            }, () => {
                console.log('audience log JOB Stop: '+Date());
            },
            true,
            'America/Los_Angeles'
        );
        console.log('post audience');
        return oRest.sendSuccess(res, 'oResData', 200);
    },

    getAll1: (req, res) => {
        const queryContent = {};
        queryContent.startDate = new Date('2019-04-01T12:10:00Z');
        queryContent.endDate = new Date('2019-04-02T12:20:00Z');
        AudienceLogManager.getAll(queryContent, (errorCode, errorMessage, httpCode, oAudienceLog) => {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            oAudienceLog.sort((a,b) => {return a.startDate.getTime() - b.startDate.getTime();}); // sorting startDate
            oAudienceLog.sort((a,b) => {
                if(a.device < b.device) { return -1; }
                if(a.device > b.device) { return 1; }
                return 0;
            }); // sorting device
            let view = 0;
            let impression = 0;
            let content = '';
            let device = '';
            let startDate = '';
            for (let index = 0; index < oAudienceLog.length; index++) {
                const element = oAudienceLog[index];
                if (index === 0) {
                    startDate = new Date(element.startDate);
                    content = element.content;
                    device = element.device;
                }
                if ((content !== element.content || device !== element.device) && index !== 0){
                    const viewLog = {};
                    viewLog.content = content;
                    viewLog.device = device;
                    viewLog.view = view;
                    viewLog.impression = impression;
                    viewLog.grp = Math.floor(view / impression * 1000) / 1000;
                    viewLog.startDate = new Date(startDate);
                    console.log(Math.floor(view / impression * 1000) / 1000);
                    ViewLogManager.create( viewLog, (errorCode, errorMessage, httpCode, oAudienceLog) => {
                        if (errorCode) {
                            console.log(errorMessage);
                        }
                    });
                    content = element.content;
                    device = element.device;
                    if (element.duration > constant.viewDuration) { // 15 seconds
                        view = 1;
                    } else {
                        view = 0;
                    }
                    impression = 2;
                    startDate = new Date(element.startDate);
                } else {
                    impression ++;
                    if (element.duration > constant.viewDuration) { // 15 seconds
                        view ++;
                    }
                    if (index === oAudienceLog.length -1) {
                        const viewLog = {};
                        viewLog.content = content;
                        viewLog.device = device;
                        viewLog.view = view;
                        viewLog.impression = impression;
                        viewLog.grp = Math.floor(view / impression * 1000) / 1000;
                        viewLog.startDate = new Date(startDate);
                        ViewLogManager.create( viewLog, (errorCode, errorMessage, httpCode, oAudienceLog) => {
                            if (errorCode) {
                                console.log(errorMessage);
                            }
                        });
                    }
                }
            }
            return oRest.sendSuccess(res, oAudienceLog, httpCode);
        });
    },
    getAll: (req, res) => {
        // const queryContent = {};
        // queryContent.startDate = new Date('2019-04-01T12:10:00Z');
        // queryContent.endDate = new Date('2019-04-02T12:20:00Z');
        TimeScheduleManager.getOneNewest( (errorCode, errorMessage, httpCode, oTimeSchedule) => {
            if (errorCode) {
                return oRest.sendError(res, errorCode, errorMessage, httpCode);
            }
            const queryContent = {};
            let startDate;
            let endDate;
            if (oTimeSchedule && oTimeSchedule.endDate) {
                console.log('-----------oTimeSchedule.endDate---------');
                console.log(oTimeSchedule.endDate);
                console.log(oTimeSchedule.endDate.getTime());
                console.log(oTimeSchedule.endDate.getTime() + 1);
                console.log(new Date(oTimeSchedule.endDate.getTime() + 1).getTime());
                startDate  =  new Date(oTimeSchedule.endDate.getTime() + 1); // plus 1 miliseconds
                endDate  =  new Date(oTimeSchedule.endDate);
                endDate.setHours(endDate.getHours() + 1);
            } else {
                startDate = new Date();
                startDate.setHours(startDate.getHours() - 1);
                endDate  =  new Date();
            }
            queryContent.startDate = startDate;
            queryContent.endDate = endDate;
            console.log(queryContent);
            AudienceLogManager.getAll(queryContent, (errorCode, errorMessage, httpCode, oAudienceLog) => {
                if (errorCode) {
                    return oRest.sendError(res, errorCode, errorMessage, httpCode);
                }
                if (oAudienceLog.length > 0) {
                    const oGroupedArray = oUtils.groupBy2(oAudienceLog, 'device');
                    oAudienceLog.sort((a,b) => {
                        return a.startDate.getTime() - b.startDate.getTime();
                    }); // sorting startDate
                    const timeScheduleData = {
                        startDate: oAudienceLog[0].startDate,
                        endDate: oAudienceLog[oAudienceLog.length - 1].startDate,
                        totalRecord: oAudienceLog.length,
                        lastRecordId: oAudienceLog[oAudienceLog.length - 1]._id,
                        firstRecordId: oAudienceLog[0]._id
                    }
                    console.log('oAudienceLog.length = ===   ' + oAudienceLog.length);
                    TimeScheduleManager.create( timeScheduleData, (errorCode, errorMessage, httpCode, timeSchedule) => {
                        if (errorCode) {
                            console.log(errorMessage);
                        }
                    });
                    for(let key in oGroupedArray) {
                        const groupedArray = oGroupedArray[key]
                        groupedArray.sort((a,b) => {return a.startDate.getTime() - b.startDate.getTime();}); // sorting startDate
                        let view = 0;
                        let impression = 0;
                        let content = '';
                        let device = '';
                        let startDate = '';
                        for (let index = 0; index < groupedArray.length; index++) {
                            const element = groupedArray[index];
                            if (index === 0) {
                                startDate = new Date(element.startDate);
                                content = element.content;
                                device = element.device;
                            }
                            if ((content !== element.content) && index !== 0){
                                const viewLog = {};
                                viewLog.content = content;
                                viewLog.device = device;
                                viewLog.view = view;
                                viewLog.impression = impression;
                                viewLog.grp = Math.floor(view / impression * 1000) / 1000;
                                viewLog.startDate = new Date(startDate);
                                console.log(Math.floor(view / impression * 1000) / 1000);
                                ViewLogManager.create( viewLog, (errorCode, errorMessage, httpCode, oViewLog) => {
                                    if (errorCode) {
                                        console.log(errorMessage);
                                    }
                                });
                                content = element.content;
                                device = element.device;
                                if (element.duration > constant.viewDuration) { // 15 seconds
                                    view = 1;
                                } else {
                                    view = 0;
                                }
                                impression = 2;
                                startDate = new Date(element.startDate);
                            } else {
                                impression ++;
                                if (element.duration > constant.viewDuration) { // 15 seconds
                                    view ++;
                                }
                                if (index === groupedArray.length -1) {
                                    const viewLog = {};
                                    viewLog.content = content;
                                    viewLog.device = device;
                                    viewLog.view = view;
                                    viewLog.impression = impression;
                                    viewLog.grp = Math.floor(view / impression * 1000) / 1000;
                                    viewLog.startDate = new Date(startDate);
                                    ViewLogManager.create( viewLog, (errorCode, errorMessage, httpCode, oViewLog) => {
                                        if (errorCode) {
                                            console.log(errorMessage);
                                        }
                                    });
                                }
                            }
                        }
                    }
                    return oRest.sendSuccess(res, oGroupedArray, httpCode);
                } else {
                    return oRest.sendSuccess(res, [], httpCode);
                }
            });
        })
    }
};