import { AlarmStatusEnum } from '../../_utils/enum';
import Entity from '../model';

export async function createAlarms(message, data) {
  const existsHeat = await Entity.find({
    name: 'allarme temperatura',
    sensorCode: data.sensorCode,
    status: AlarmStatusEnum.TRIGGER,
  });

  const existsHum = await Entity.find({
    name: 'allarme umidità',
    sensorCode: data.sensorCode,
    status: AlarmStatusEnum.TRIGGER,
  });

  if (data.value > 25 && _.isEmpty(existsHeat)) {
    await Entity.create({
      name: 'allarme temperatura',
      sensorCode: data.sensorCode,
      triggerValue: data.value,
      messageId: message._id,
    });
  } else if (data.value < 25 && !_.isEmpty(existsHeat)) {
    await Entity.updateOne(
      {
        sensorCode: data.sensorCode,
        name: 'allarme temperatura',
      },
      {
        status: AlarmStatusEnum.RESOLVE,
      }
    );
  }

  if (data.hum > 40 && _.isEmpty(existsHum)) {
    await Entity.create({
      name: 'allarme umidità',
      sensorCode: data.sensorCode,
      triggerValue: data.hum,
      messageId: message._id,
    });
  } else if (data.hum < 40 && !_.isEmpty(existsHum)) {
    await Entity.updateOne(
      {
        sensorCode: data.sensorCode,
        name: 'allarme umidità',
      },
      {
        status: AlarmStatusEnum.RESOLVE,
      }
    );
  }
}
