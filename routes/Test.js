
// our components
const TestCtrl = require('../controllers/TestCtrl');
module.exports = function (app) {
    app.get('/testGetAllTimeSchedule', TestCtrl.testGetAllTimeSchedule);
}
