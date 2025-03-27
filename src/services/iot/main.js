import config from '../../config';
import logger from '../logger/index';
import Sensor from '../../api/sensor/model'

const awsIot = require('aws-iot-device-sdk');
const AWS = require('aws-sdk');
const os = require('os');

const { awsMasterUrl, iotEndpoint,awsMasterName,accessKey, secretKey } = config;

AWS.config.update({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    region: 'eu-west-1'
});

const iot = new AWS.Iot();
// var iotdata = new AWS.IotData({endpoint: iotEndpoit});
// iotdata.getThingShadow(params, function (err, data) {
//   if (err) console.log(err, err.stack);
//   else console.log(data);
// });

let device;
export function initDevice() {
    device = awsIot.device({
        keyPath: `${os.tmpdir()}/${awsMasterName}.private.pem.key`,
        certPath: `${os.tmpdir()}/${awsMasterName}.certificate.pem.crt`,
        caPath: `${os.tmpdir()}/AmazonRootCA1.pem`,
        host: iotEndpoint
    });


    device.on('connect', function () {
        logger.info('system connected to aws iot...');
        device.subscribe('machines');
        logger.info('mqtt parser ready...');
    });

    device.on('error', function (e) {
        logger.info({ e });
    });

    device.on('message',async function (topic, payload) {
        logger.info('message received');
        console.log(topic, JSON.parse(payload))

        await Sensor.create(JSON.parse(payload))
    });
}


export function createThing(thing) {

    let params = {
        thingName: thing.iotCode,
        attributePayload: {
            attributes: {
                clientId: thing.clientId.toString(),
                laiType: thing.type,
                billingGroupName: 'lai'
            }
        }
    };
    const promise = new Promise((resolve, reject) => {
        iot.createThing(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

export async function deleteThing(thing) {
    logger.warn('init deleting a thing from AWS');

    if (!thing.iotCode) {
        throw new Error('unable to delete from AWS without iotCode');
    }

    await detachPolicy(thing);
    await detachThingPrincipal(thing);
    await UpdateCertificate(thing);
    await DeleteCertificate(thing);
    await DeleteThing(thing);

    return;
}

function detachPolicy(thing) {

    let params = {
        policyName: 'machine',
        target: thing.certificateArn
    };

    const promise = new Promise((resolve, reject) => {
        iot.detachPolicy(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

function detachThingPrincipal(thing) {

    let params = {
        thingName: thing.iotCode,
        principal: thing.certificateArn
    };

    const promise = new Promise((resolve, reject) => {
        iot.detachThingPrincipal(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

function UpdateCertificate(thing) {

    const certificateId = thing.certificateArn.split('/')[1];
    let params = {
        certificateId: certificateId,
        newStatus: 'INACTIVE'
    };

    const promise = new Promise((resolve, reject) => {
        iot.updateCertificate(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

function DeleteCertificate(thing) {

    const certificateId = thing.certificateArn.split('/')[1];

    let params = {
        certificateId: certificateId,
    };

    const promise = new Promise((resolve, reject) => {
        iot.deleteCertificate(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

function DeleteThing(thing) {

    let params = {
        thingName: thing.iotCode,
    };

    const promise = new Promise((resolve, reject) => {
        iot.deleteThing(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

