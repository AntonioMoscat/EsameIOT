import Entity from './model';
import FunctionGeneration from '../_generator/function.js';

const actions = FunctionGeneration(Entity);

export { actions };