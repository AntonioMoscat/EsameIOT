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
  'timestamp.$gte': {
    type: Date,
    paths: ['timestamp'],
    operator: '$gte'
  },
  'timestamp.$lte': {
    type: Date,
    paths: ['timestamp'],
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

export default router;
