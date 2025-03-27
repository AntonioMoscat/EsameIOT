const { Schema } = require('mongoose');

// Funzione di utilità per controllare se un campo è un array di oggetti
const isArrayOfObjects = field => Array.isArray(field.type) && field.type.length > 0 && field.type[0]?.obj;

// Funzione di utilità per capitalizzare i riferimenti
const capitalizeRef = name => name.charAt(0).toUpperCase() + name.slice(1, -2);

export function schemaGeneration(entitySchema, timeSeries) {
  let virtuals = createVirtuals(entitySchema);

  //rimozione dei campi dallo schema se sono dei campi virtuali
  Object.keys(entitySchema).forEach(key => {
    if (entitySchema[key].virtual) {
      delete entitySchema[key];
    }
  });

  Object.entries(entitySchema).forEach(([element, field]) => {
    // Rimozione campi virtuali
    delete field.virtual;
    delete field.virtualPopulation;

    // Aggiunge ref per ObjectId
    if (field.type?.schemaName === 'ObjectId') {
      field.ref = capitalizeRef(element);
    }

    // Gestione degli array di oggetti nidificati
    if (isArrayOfObjects(field)) {
      Object.entries(field.type[0].obj).forEach(([sub, subField]) => {
        if (subField.type?.schemaName === 'ObjectId') {
          subField.ref = capitalizeRef(sub);
        }
      });
    }
  });
  let schema = new Schema(entitySchema, timeSeries, { timestamps: { createdAt: 'createAt' } });

  virtuals.forEach(val => {
    schema.virtual(val.as, val.options);
  });

  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });

  return { schema, virtuals };
}

export function createPopulate(entitySchema, virtuals) {
  const populate = [];

  virtuals.forEach(val => {
    const populateBody = { path: val.as, populate: val?.populate };
    populate.push(populateBody);
  });
  return populate;
}

export function createVirtuals(entitySchema) {
  const virtuals = [];

  Object.entries(entitySchema).forEach(([elementName, field]) => {
    if (field.virtualPopulation) {
      const virPop = field.virtualPopulation;
      virtuals.push({
        as: field.virtual ? elementName : virPop.as || `${elementName.slice(0, -2)}`,
        options: virPop.options,
        autoPopulate: virPop.odinAutoPopulation,
        populate: virPop.options?.options,
      });
    }
  });
  return virtuals;
}
