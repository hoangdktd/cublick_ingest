const AudienceLogManager = require('../manager/AudienceLogManager');
const ViewLogManager = require('../manager/ViewLogManager');
const TimeScheduleManager = require('../manager/TimeScheduleManager');
const oRest = require('../utils/restware');
const oUtils = require('../utils/utils');
const cronJob = require('cron').CronJob;
const constant = require('../utils/constant');
const IngestCtrl = require('./IngestCtrl');
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
        const job = new cronJob('*/30 * * * * *', // 30 seconds
            () => {
                try {
                    const d = new Date();
                    const count = Math.floor(Math.random() * 15) + 15;
                    if (d.getSeconds() === 0) {
                        oAudienceLog.device = constant.deviceIdEnum[Math.floor(Math.random() * constant.deviceIdEnum.length)];
                        oAudienceLog.content = constant.contentIdEnum[Math.floor(Math.random() * constant.contentIdEnum.length)];
                    }
                    console.log(' insert record total count   =    ' + count + '    device   ' + oAudienceLog.device + '    content   ' + oAudienceLog.content);
                    for (let index = 0; index < count; index++) {
                        oAudienceLog.startDate = Date.now();
                        oAudienceLog.duration = Math.floor(Math.random() * 20);
                        oAudienceLog.contentDuration = 60;
                        oAudienceLog.createdDate = Date.now();
                        AudienceLogManager.create( oAudienceLog, (errorCode, errorMessage, httpCode, oAudienceLog) => {
                        });
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
                                    } else {
                                        IngestCtrl.pushIngest(viewLog.device, viewLog.content, viewLog.grp);
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
                                        } else {
                                            IngestCtrl.pushIngest(viewLog.device, viewLog.content, viewLog.grp);
                                        }
                                    });
                                }
                            }
                        }
                    }
                    return oRest.sendSuccess(res, oGroupedArray, httpCode);
                } else {
                    const timeScheduleData = {
                        startDate: queryContent.startDate,
                        endDate: queryContent.endDate,
                        totalRecord: 0,
                        lastRecordId: '',
                        firstRecordId: ''
                    }
                    console.log('oAudienceLog.length = ===   0');
                    TimeScheduleManager.create( timeScheduleData, (errorCode, errorMessage, httpCode, timeSchedule) => {
                        if (errorCode) {
                            console.log(errorMessage);
                        }
                    });
                    return oRest.sendSuccess(res, [], httpCode);
                }
            });
        })
    },

    autoGetAll: (req, res) => {
        // const queryContent = {};
        // queryContent.startDate = new Date('2019-04-01T12:10:00Z');
        // queryContent.endDate = new Date('2019-04-02T12:20:00Z');
        const job = new cronJob('*/5 * * * *', // 2 minute
            () => {
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
                                            } else {
                                                IngestCtrl.pushIngest(viewLog.device, viewLog.content, viewLog.grp);
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
                                                } else {
                                                    IngestCtrl.pushIngest(viewLog.device, viewLog.content, viewLog.grp);
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            // return oRest.sendSuccess(res, oGroupedArray, httpCode);
                        } else {
                            const timeScheduleData = {
                                startDate: queryContent.startDate,
                                endDate: queryContent.endDate,
                                totalRecord: 0,
                                lastRecordId: '',
                                firstRecordId: ''
                            }
                            console.log('oAudienceLog.length = ===   0');
                            TimeScheduleManager.create( timeScheduleData, (errorCode, errorMessage, httpCode, timeSchedule) => {
                                if (errorCode) {
                                    console.log(errorMessage);
                                }
                            });
                            // return oRest.sendSuccess(res, [], httpCode);
                        }
                    });
                })
            },
            () => {
                console.log('audience log JOB Stop: '+Date());
            },
            true,
            'America/Los_Angeles'
        );
        console.log('post audience');
        return oRest.sendSuccess(res, 'oResData', 200);
    },

    testAuto:  (req, res) => {
        // const queryContent = {};
        // queryContent.startDate = new Date('2019-04-01T12:10:00Z');
        // queryContent.endDate = new Date('2019-04-02T12:20:00Z');
        const job = new cronJob('*/2 * * * *',
            () => {
                console.log('start test JOB: ' + Date());
            },
            () => {
                console.log('audience log JOB Stop: '+Date());
            },
            true,
            'America/Los_Angeles'
        );
        console.log('test');
        return oRest.sendSuccess(res, 'oResData', 200);
    }
};