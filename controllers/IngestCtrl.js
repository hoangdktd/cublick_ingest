const httpRequest = require('http');
const oRest = require('../utils/restware');
const request = require('request');
const cublickIngestConfig = require('../config/config');
const cronJob = require('cron').CronJob;
module.exports = {



    /////// POST

    create: (req, res) => {
        const ingestData = JSON.stringify({
            data: '4,4,4'
        });
        const options = {
            host: cublickIngestConfig.apiRecommenderUrl,
            path: '/ingest',
            method: 'POST',
            port: 8080,
            headers: {
                // 'Content-Type': 'application/json'
                // 'Content-Type': 'multipart/form-data' // multiple row
                // 'Content-Type': 'text/csv'
                'Content-Type': 'text/plain'
            }
          }
        const job = new cronJob('*/10 * * * * *',
            function (){
                try {
                    console.log('start ingest JOB: ' + Date());
                    console.log(cublickIngestConfig.apiRecommenderUrl);
                    const req = httpRequest.request(options, function (res) {
                        var output = '';
                        res.setEncoding('utf8');
                        // console.log(res);
                        res.on('data', function (chunk) {
                            output += chunk;
                        });

                        res.on('end', function () {
                            console.log('ingest job end: ');
                        });
                    });

                    req.on('error', function (err) {
                        console.log('ingest job error: ' + err.message);
                    });
                    req.write('4,5,5')
                    req.end();


                    // request.post('http://localhost:8080/ingest', {
                    //     form: 'aaaa'
                    //   }, (error, res, body) => {
                    //     if (error) {
                    //       console.error(error)
                    //       return
                    //     }
                    //     console.log(`statusCode: ${res.statusCode}`)
                    //     console.log(body)
                    //   })
                }catch(error){
                    console.log('ingest job error: ' + error);
                }
            }, function(){
                console.log('ingest JOB Stop: '+Date());
            },
            true,
            'America/Los_Angeles'
        );
        console.log('post ingest');
        return oRest.sendSuccess(res, 'oResData', 200);
    },

    get: (req, res) => {
        console.log('ingest');
        return oRest.sendSuccess(res, 'oResData', 200);
    }
}