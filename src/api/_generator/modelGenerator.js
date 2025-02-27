const { schemaGeneration, createPopulate } = require('./_utils');

function ModelGenerator(mongoose) {
  return function (modelParams) {
    const {
      schema: entitySchema,
      collectionName,
      modelName,
      extensionFunction // funzione (schema)=>{}
    } = modelParams;

    let { schema, virtuals } = schemaGeneration(entitySchema);

    if (extensionFunction) {
      extensionFunction(schema);
    }

    if (mongoose.models[modelName]) {
      delete mongoose.models[modelName];
    }

    let model = mongoose.model(modelName, schema);

    const populate = createPopulate(entitySchema, virtuals);

    model.find = function (filter = {}) {
      return Object.getPrototypeOf(this).find.call(this, filter).populate(populate);
    };

    model.findOne = function (filter = {}) {
      return Object.getPrototypeOf(this).findOne.call(this, filter).populate(populate);
    };

    return model;
  };
}

module.exports = ModelGenerator;
