const Entity = require('./model');
const FunctionGeneration = require('../_generator/function.js');

let actions = FunctionGeneration(Entity);

module.exports = {
  actions
};