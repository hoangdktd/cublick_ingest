// our components
const AudienceLogCtrl = require('../controllers/AudienceLogCtrl');
const ViewLogCtrl = require('../controllers/ViewLogCtrl');

module.exports = function (app) {

    app.post('/audiencelog', AudienceLogCtrl.create);
    app.post('/autoaudiencelog', AudienceLogCtrl.autoCreate);
    app.get('/audiencelog', AudienceLogCtrl.getAll);
    app.get('/autoViewlog', AudienceLogCtrl.autoGetAll);
    app.get('/viewlog', ViewLogCtrl.getAll);
    app.get('/autotest', AudienceLogCtrl.testAuto);
    // app.get('/audiencelog', ingestCtrl.get);
}
