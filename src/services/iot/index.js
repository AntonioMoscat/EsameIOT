import config from '../../config';
import logger from '../logger/index';
import Message from '../../api/messages/model';
import Alarm from '../../api/alarms/model';
import Sensor from '../../api/sensors/model';
import { checkMasterCertificate } from './getCertificate';
import awsIot from 'aws-iot-device-sdk';
import { IoTDataPlaneClient, GetThingShadowCommand } from '@aws-sdk/client-iot-data-plane';

import os from 'os';
import { AlarmStatusEnum } from '../../api/_utils/enum';
import { createAlarms } from '../../api/alarms/middelware';

const { awsMasterUrl, iotEndpoint, awsMasterName, accessKey, secretKey } = config;

const iot = new IoTDataPlaneClient({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: 'eu-west-1',
});

let deviceInstance = null;
export async function initDevice() {
  try {
    await checkMasterCertificate();

    deviceInstance = awsIot.device({
      keyPath: `${os.tmpdir()}/${awsMasterName}.private.pem.key`,
      certPath: `${os.tmpdir()}/${awsMasterName}.certificate.pem.crt`,
      caPath: `${os.tmpdir()}/AmazonRootCA1.pem`,
      host: iotEndpoint,
    });

    deviceInstance.on('connect', function () {
      logger.info('system connected to aws iot...');
      deviceInstance.subscribe('machines');
      deviceInstance.subscribe('sensors/#');
      logger.info(deviceInstance);

      logger.info('mqtt parser ready...');
    });

    deviceInstance.on('error', function (e) {
      return e;
    });

    deviceInstance.on('message', async function (topic, payload) {
      logger.info('message received');
      try {
        const data = JSON.parse(payload.toString());

        await Message.create(data);

        if (data.sensorId) {
          const sensor = await Sensor.findOne({ arn: data.sensorId });
          if (sensor) {
            sensor.attribute = {
              ...sensor.attribute,
              lastReading: data.value,
              timestamp: data.timestamp || new Date(),
            };
            await sensor.save();
          }
        }
      } catch (error) {
        logger.error(`Error processing message: ${error}`);
      }
    });
    return deviceInstance;
  } catch (error) {
    logger.error(`Failed to initialize AWS IoT device: ${error}`);
    throw error;
  }
}

export function createThing(thing) {
  let params = {
    thingName: thing.iotCode,
    attributePayload: {
      attributes: {
        clientId: thing.clientId.toString(),
        laiType: thing.type,
        billingGroupName: 'lai',
      },
    },
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

export async function getShadow(thingName) {
  try {
    const command = new GetThingShadowCommand({ thingName });
    const response = await iot.send(command);
    const payload = JSON.parse(new TextDecoder().decode(response.payload));
    logger.info(`Shadow: ${payload}`);
  } catch (error) {
    logger.error('Errore nel recupero dello shadow:', error);
  }
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
    target: thing.certificateArn,
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
    principal: thing.certificateArn,
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
    newStatus: 'INACTIVE',
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
let IOT;

export default (function () {
  if (!IOT) {
    IOT = initDevice();
  }
  return IOT;
})();
