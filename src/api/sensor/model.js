import mongoose, { Schema } from 'mongoose';
import ModelGenerator from '../_generator/modelGenerator';
import ValidateSchema from '../_generator/validateSchema';

let schema = {
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
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

const model = ModelGenerator(mongoose)(
  {
    schema,
    collectionName: 'sensors',
    modelName: 'Sensor',
    extensionFunction: () => { }
  }
);

export const bodySchema = ValidateSchema(schema);
export default model;