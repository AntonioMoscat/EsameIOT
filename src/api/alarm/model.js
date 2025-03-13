import mongoose, { Schema } from 'mongoose';
import ModelGenerator from '../_generator/modelGenerator';
import ValidateSchema from '../_generator/validateSchema';
import { alarmTriggerRequirment, AlarmTriggerRequirmentEnum } from '../_utils/enum';

let schema = {
  name: {
    type: String
  },
  triggerValue: {
    type: Number
  },
  triggerRequirment: {
    type: String,
    enum: alarmTriggerRequirment,
    default: AlarmTriggerRequirmentEnum.BOTH
  },
  triggerId: {
    type: Schema.ObjectId,
    virtualPopulation: {
      virtualPopulation: {
        odinAutoPopulation: true,
        as: 'trigger',
        options: {
          ref: 'Alert-trigger',
          foreignField: '_id',
          localField: 'triggerId',
          justOne: true,
        },
      },
    }
  },
  messageId: {
    type: Schema.ObjectId,
    virtualPopulation: {
      virtualPopulation: {
        odinAutoPopulation: true,
        as: 'trigger',
        options: {
          ref: 'Alert-trigger',
          foreignField: '_id',
          localField: 'triggerId',
          justOne: true,
        },
      },
    }
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