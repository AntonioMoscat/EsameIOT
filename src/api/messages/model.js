import mongoose, { Schema } from 'mongoose';
import ModelGenerator from '../_generator/modelGenerator';
import ValidateSchema from '../_generator/validateSchema';
import { syncSensor } from './utils';

let schema = {
  timestamp: {
    type: Date,
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
  extensionFunction: schema => {
    schema.post('save', syncSensor);
  },
});

export const bodySchema = ValidateSchema(schema);
export default model;
