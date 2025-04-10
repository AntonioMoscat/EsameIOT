import express from 'express';
import { actions } from './controller';
import { bodySchema } from './model';
import { middleware as query } from 'querymen';

const router = express.Router();

/**
 * @api {get} /messages/ get All Messages
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/', query({
  ...bodySchema.query,
  'timeStamp.$gte': {
    type: Date,
    paths: ['timeStamp'],
    operator: '$gte'
  },
  'timeStamp.$lte': {
    type: Date,
    paths: ['timeStamp'],
    operator: '$lte'
  },
  sensorCodes: {
    type: [String]
  }
}), actions.index);

/**
 * @api {get} /messages/:id Get Specific Message
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/:id', query(bodySchema.query), actions.show);

/**
 * @api {post} /messages Create Message
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/', actions.create);

/**
 * @api {put} /messages/:id Update Message
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.put('/:id', actions.update);

/**
 * @api {delete} /messages/:id Destroy Message
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.delete('/:id', actions.destroy);

export default router;
