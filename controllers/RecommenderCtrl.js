const httpRequest = require('http');
const oRest = require('../utils/restware');
const request = require('request');
const cublickIngestConfig = require('../config/config');
const cronJob = require('cron').CronJob;
module.exports = {

    getRecommender: (request, response) => {
        console.log( request.query.deviceId);
        console.log('http://' + cublickIngestConfig.apiRecommenderUrl + ':8080/recommend/' + request.query.deviceId);
        httpRequest.get('http://' + cublickIngestConfig.apiRecommenderUrl + ':8080/recommend/' + request.query.deviceId, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            console.log(chunk);
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(data);
            return oRest.sendSuccess(response, data, 200);
        });

        }).on("error", (err) => {
        console.log("Error: " + err.message);
        });
    }
}