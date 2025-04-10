import mongoose, { Schema } from 'mongoose';
import ModelGenerator from '../_generator/modelGenerator';
import ValidateSchema from '../_generator/validateSchema';
import { alarmStatus, AlarmStatusEnum } from '../_utils/enum';

let schema = {
  name: {
    type: String
  },
  triggerValue: {
    type: Number
  },
  sensorId: {
    type: Schema.ObjectId
  },
  sensorCode: {
    type: String
  },
  messageId: {
    type: Schema.ObjectId,
    virtualPopulation: {
      odinAutoPopulation: true,
      as: 'message',
      options: {
        ref: 'Message',
        foreignField: '_id',
        localField: 'messageId',
        justOne: false,
      },
    },
  },
  status: {
    type: String,
    enum: alarmStatus,
    default: AlarmStatusEnum.TRIGGER,
  }
  // userId: {
  //   type: Schema.ObjectId,
  //   required: true,

  //   virtualPopulation: {
  //     odinAutoPopulation: true,
  //     as: 'User',
  //     options: {
  //       ref: 'User',
  //       foreignField: '_id',
  //       localField: 'userId',
  //       justOne: true,
  //     },
  //   },
  // }
};

const model = ModelGenerator(mongoose)(
  {
    schema,
    collectionName: 'alarms',
    modelName: 'Alarm',
    extensionFunction: () => { }
  }
);

export const bodySchema = ValidateSchema(schema);
export default model;