import Entity from './model';
import FunctionGeneration from '../_generator/function.js';
import { createThing, initDevice } from '../../services/iot/main.js';
import { checkMasterCertificate } from '../../services/iot/getCertificate.js';

const actions = FunctionGeneration(Entity);

actions.getAll = async ({params: {iotCode, clientId, laiType}},res)=> {
    try {
        await checkMasterCertificate()
        console.log('cert create')
        const device = initDevice()
        console.log(device)
    
        let thing =await createThing({iotCode,clientId ,laiType })
        console.log(thing)
    
        res.status(200).send(thing)
   
    }catch (err){
        console.log(err)
        res.send(err)
    }
}

export { actions };