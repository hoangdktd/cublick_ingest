let MONGODB_URL;
let API_CUBLICK_URL;
let API_RECOMMENDER_URL;
let APIROOT_URL;

if (process.env.RUN_MODE === 'PROD') {
	MONGODB_URL = 'mongodb://bioz:bioz@ds151059.mlab.com:51059/bioz_sdss';
    API_CUBLICK_URL = 'https://api.cublick.com/';
    API_RECOMMENDER_URL = 'https://192.168.0.14:8080';
    APIROOT_URL = 'http://192.168.0.3:8081/';
} else if (process.env.RUN_MODE === 'DEV') {
    MONGODB_URL = 'mongodb://bioz:bioz@ds151059.mlab.com:51059/bioz_sdss';
    API_CUBLICK_URL = 'https://api.cublick.com/';
    API_RECOMMENDER_URL = 'https://192.168.0.14:8080';
    APIROOT_URL = 'http://192.168.0.3:8081/';
} else {
    MONGODB_URL = 'mongodb://bioz:bioz@ds151059.mlab.com:51059/bioz_sdss';
    API_CUBLICK_URL = 'https://api.cublick.com/';
    API_RECOMMENDER_URL = 'https://192.168.0.14:8080';
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
