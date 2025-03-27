import Entity from './model';
import FunctionGeneration from '../_generator/function.js';
import device, { createThing } from '../../services/iot';
import { checkMasterCertificate } from '../../services/iot/getCertificate.js';

const actions = FunctionGeneration(Entity);

actions.getAll = async ({ params: { iotCode, clientId, laiType } }, res) => {
  try {
    await checkMasterCertificate();
    console.log('cert create');
    console.log(await device());

    let thing = await createThing({ iotCode, clientId, laiType });
    console.log(thing);

    res.status(300).send(thing);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export { actions };
