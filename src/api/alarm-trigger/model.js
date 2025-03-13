import mongoose, { Schema } from 'mongoose';
import ModelGenerator from '../_generator/modelGenerator';
import ValidateSchema from '../_generator/validateSchema';
import { alarmTriggerRequirment, AlarmTriggerRequirmentEnum } from '../_utils/enum';

let schema = {
  name: {
    type: String,
    required: true,
  },
  triggerValue: {
    type: Number,
    required: true,
    default: 20
  },
  triggerRequirment: {
    type: String,
    enum: alarmTriggerRequirment,
    default: AlarmTriggerRequirmentEnum.BOTH
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
    collectionName: 'alarm-triggers',
    modelName: 'Alarm-trigger',
    extensionFunction: () => { }
  }
);

export const bodySchema = ValidateSchema(schema);
export default model;