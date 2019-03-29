let MONGODB_URL;
let API_CUBLICK_URL;
let API_RECOMMENDER_URL;
let APIROOT_URL;

if (process.env.RUN_MODE === 'PROD') {
	MONGODB_URL = 'mongodb+srv://cublick:cublick@cublick-yb9up.gcp.mongodb.net/test?retryWrites=true';
    API_CUBLICK_URL = 'https://api.cublick.com/';
    API_RECOMMENDER_URL = '192.168.0.14';
    APIROOT_URL = 'http://192.168.0.3:8081/';
} else if (process.env.RUN_MODE === 'DEV') {
    MONGODB_URL = 'mongodb+srv://cublick:cublick@cublick-yb9up.gcp.mongodb.net/test?retryWrites=true';
    API_CUBLICK_URL = 'https://api.cublick.com/';
    API_RECOMMENDER_URL = '192.168.0.14';
    APIROOT_URL = 'http://192.168.0.3:8081/';
} else {
    MONGODB_URL = 'mongodb+srv://cublick:cublick@cublick-yb9up.gcp.mongodb.net/test?retryWrites=true';
    API_CUBLICK_URL = 'https://api.cublick.com/';
    API_RECOMMENDER_URL = '192.168.0.14';
    APIROOT_URL = 'http://192.168.0.3:8081/';
}


module.exports = {
    https: false,
    appname: 'cublick_ingest',
    port: process.env.PORT || 8081,
    url: APIROOT_URL,
    apiCublickUrl: API_CUBLICK_URL,
    apiRecommenderUrl: API_RECOMMENDER_URL,
    paths:{
        audienceLog: '/audienceLog',
        ingest: '/ingest'
    },
    mongodb: {
        uri: MONGODB_URL,
        username: ''
    }
};
