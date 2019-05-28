// our components
const ingestCtrl = require('../controllers/IngestCtrl');

module.exports = function (app) {

    // app.post('/ingest', ingestCtrl.create);
    app.get('/ingest', ingestCtrl.postIngest);
    // app.get('/ingest', ingestCtrl.get);
}
