import Entity from './model';
import FunctionGeneration from '../_generator/function.js';
import device, { createThing } from '../../services/iot';
import { checkMasterCertificate } from '../../services/iot/getCertificate.js';

const actions = FunctionGeneration(Entity);

actions.importAllSensor = async ({ params: { iotCode, clientId, laiType } }, res) => {
  try {
    await checkMasterCertificate();

    let thing = await createThing({ iotCode, clientId, laiType });
    console.log(thing);

    res.status(300).send(thing);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
};

export { actions };
