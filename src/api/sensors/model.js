import mongoose, { Schema } from 'mongoose';
import ModelGenerator from '../_generator/modelGenerator';
import ValidateSchema from '../_generator/validateSchema';

let schema = {
  name: {
    type: String,
    required: true,
  },
  arn: {
    type: String,
  },
  attribute: {
    type: Object,
  },
  version: {
    type: Number,
  },
};

const model = ModelGenerator(mongoose)({
  schema,
  collectionName: 'sensors',
  modelName: 'Sensor',
  extensionFunction: () => {},
});

export const bodySchema = ValidateSchema(schema);
export default model;
