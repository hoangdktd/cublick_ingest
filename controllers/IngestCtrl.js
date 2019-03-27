const oRest = require('../utils/restware');

module.exports = {



    /////// POST

    create: function (req, res) {
        // var accessUserId = req.body.accessUserId || '';
        // var accessUserRight = req.body.accessUserRight || '';
        // var accessUserName = req.body.accessUserName || '';

        // var oBookData = req.body || '';

        // oBookManager.create( accessUserId, accessUserRight, accessUserName, oBookData, function (errorCode, errorMessage, httpCode, book) {
        //     if (errorCode) {
        //         return oRest.sendError(res, errorCode, errorMessage, httpCode);
        //     }
        //     var oResData = {};
        //     oResData.id = book._id;
        //     return oRest.sendSuccess(res, oResData, httpCode);
        // })
        console.log('ingest');
        return oRest.sendSuccess(res, oResData, httpCode);
    },

    get: function (req, res) {
        console.log('ingest');
        return oRest.sendSuccess(res, 'oResData', 200);
    }
}