import express from 'express';
import { actions } from './controller';
import { bodySchema } from './model';
import { middleware as query } from 'querymen';

const router = express.Router();

/**
 * @api {get} /sensors/ Recupera tutti i sensori da AWS e salva nel database
 * @apiName GetSensors
 * @apiGroup Sensor
 *
 * @apiSuccess {Boolean} success Stato dell'operazione.
 * @apiSuccess {Number} count Numero di sensori salvati.
 * @apiSuccess {String} message Messaggio di successo.
 * @apiSuccess {Array} data Lista dei sensori salvati.
 */
router.get('/', query(bodySchema.query), actions.index);

/**
 * @api {get} /sensors/:id Get Specific Sensor
 * @apiName GetSensor
 * @apiGroup Sensor
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/:id', query(bodySchema.query), actions.show);

/**
 * @api {post} /sensors/:id Create Sensor
 * @apiName PostSensor
 * @apiGroup Sensor
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/', actions.create);

/**
 * @api {put} /sensors/:id Update Sensor
 * @apiName PutSensor
 * @apiGroup Sensor
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.put('/:id', actions.update);

/**
 * @api {delete} /sensors/:id Destroy Sensor
 * @apiName DellSensor
 * @apiGroup Sensor
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.delete('/:id', actions.destroy);

export default router;
