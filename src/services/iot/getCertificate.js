import config from '../../config';

const fs = require('fs');
const http = require('https');
const os = require('os');

const {awsMasterUrl, awsMasterName} = config;

export function checkMasterCertificate() {
    return new Promise((resolve, reject) => {
        try {
            const file = fs.readFileSync(`${os.tmpdir()}/${awsMasterName}.pem.crt`);
            resolve();
        } catch (err) {
            const finishedActions = [];
            const cert = fs.createWriteStream(`${os.tmpdir()}/${awsMasterName}.certificate.pem.crt`);
            const privateKey = fs.createWriteStream(`${os.tmpdir()}/${awsMasterName}.private.pem.key`);
            const amazonRoot = fs.createWriteStream(`${os.tmpdir()}/AmazonRootCA1.pem`)
            console.log(`${os.tmpdir()}/${awsMasterName}.private.pem.key`)
            http.get(`${awsMasterUrl}/${awsMasterName}.certificate.pem.crt`, function (response) {
                response.pipe(cert);
            }); 

            http.get(`${awsMasterUrl}/${awsMasterName}.private.pem.key`, function (response) {
                response.pipe(privateKey);
            });

            http.get(`${awsMasterUrl}/AmazonRootCA1.pem`, function (response) {
                response.pipe(amazonRoot);
            });

            cert.on('finish', function () {
                finishedActions.push(true)

                if (finishedActions.length === 3) {
                    resolve();
                }
            });

            cert.on('error', function () {
                reject();
            });

            amazonRoot.on('finish', function () {
                finishedActions.push(true)

                if (finishedActions.length === 3) {
                    resolve();
                }
            });

            amazonRoot.on('error', function () {
                reject();
            });

            privateKey.on('finish', function () {
                finishedActions.push(true)

                if (finishedActions.length === 3) {
                    resolve();
                }
            });

            privateKey.on('error', function () {
                reject();
            });
        }
    });
}