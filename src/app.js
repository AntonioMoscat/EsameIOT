import mongoose from './services/mongoose';
import express from 'express';
import http from 'http';
import api from './api';
import { mongo } from './config';

const app = express(api);

const server = http.createServer(app);

setImmediate(async () => {
  if (mongo.createMongo) {
    await mongoose.connect(mongo.uri, {});
  } else {
    logger.info('\x1B[0;34mMongoose:\x1B[0m DB disabled by .env roule \x1B[0;32m');
  }
});

export default app;
