import mongoose, { Schema } from 'mongoose';
import ModelGenerator from '../_generator/modelGenerator';
import ValidateSchema from '../_generator/validateSchema';

let schema = {
  timestamp: {
    type: Number,
  },
  hum: {
    type: Number,
  },
  value: {
    type: Number,
  },
  sensorCode: {
    type: String,
  },
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

const model = ModelGenerator(mongoose)({
  schema,
  timeSeries: {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'sensorCode',
      granularity: 'seconds',
    },
  },
  collectionName: 'messages',
  modelName: 'Message',
  extensionFunction: () => {},
});

export const bodySchema = ValidateSchema(schema);
export default model;
