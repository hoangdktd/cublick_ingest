// our components
const RecommenderCtrl = require('../controllers/RecommenderCtrl');
const IngestCtrl = require('../controllers/IngestCtrl');
module.exports = function (app) {
    app.get('/recommend', RecommenderCtrl.getRecommender);
    app.get('/mostPopularItems', RecommenderCtrl.getMostPopular);
    // app.post('/ingest', IngestCtrl.postIngest);
}
