// our components
const AudienceLogCtrl = require('../controllers/AudienceLogCtrl');

module.exports = function (app) {

    app.post('/audiencelog', AudienceLogCtrl.create);
    app.post('/autoaudiencelog', AudienceLogCtrl.autoCreate);
    app.get('/audiencelog', AudienceLogCtrl.getAll);
    // app.get('/audiencelog', ingestCtrl.get);
}
