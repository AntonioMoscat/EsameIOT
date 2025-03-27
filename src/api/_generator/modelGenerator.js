import { schemaGeneration, createPopulate } from './_utils';

export default function ModelGenerator(mongoose) {
  return function (modelParams) {
    const {
      schema: entitySchema,
      collectionName,
      modelName,
      extensionFunction, // funzione (schema)=>{}
      timeSeries = {},
    } = modelParams;

    let { schema, virtuals } = schemaGeneration(entitySchema, timeSeries);

    if (extensionFunction) {
      extensionFunction(schema);
    }

    if (mongoose.models[modelName]) {
      delete mongoose.models[modelName];
    }

    let model = mongoose.model(modelName, schema);

    const populate = createPopulate(entitySchema, virtuals);

    model.find = function (filter = {}, projections = {}, options = {}) {
      return Object.getPrototypeOf(this).find.call(this, filter, projections, options).populate(populate);
    };

    model.findOne = function (filter = {}, projections = {}, options = {}) {
      return Object.getPrototypeOf(this).findOne.call(this, filter, projections, options).populate(populate);
    };

    return model;
  };
}
