import Entity from './model.js';
import FunctionGeneration from '../_generator/function.js';

const actions = FunctionGeneration(Entity);

export { actions };
