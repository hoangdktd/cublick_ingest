// our components
const RecommenderCtrl = require('../controllers/RecommenderCtrl');
module.exports = function (app) {
    app.get('/recommend', RecommenderCtrl.getRecommender);
}
