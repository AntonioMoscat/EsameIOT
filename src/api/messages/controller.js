import Entity from './model.js';
import FunctionGeneration from '../_generator/function.js';
import { aggregateMessage } from './aggregate/index.js';

const actions = FunctionGeneration(Entity);

actions.index = async ({ querymen: { query, select, cursor } }, res) => {
  try {
    const messages = await Entity.aggregate(aggregateMessage(query, select, cursor));
    return res.status(200).send(messages);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export { actions };
