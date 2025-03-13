const mongoose = require('mongoose');
const { mongo } = require('../../config.js');

mongoose.connection.on('sucess', message => {
  logger.info('MongoDB connection sucess: ' + message);
});


mongoose.connection.on('error', err => {
  logger.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

Object.keys(mongo.options).forEach(key => {
  if (key === 'debug' && mongo.options[key]) {
    mongoose.set('debug', winstonMongooseLogger);
  } else {
    mongoose.set(key, mongo.options[key]);
  }
});

function winstonMongooseLogger(name, i) {
  const moduleName = '\x1B[0;36mMongoose:\x1B[0m ';
  const functionCall = [name, i].join('.');

  const _args = [];

  for (let j = arguments.length - 1; j >= 2; --j) {
    _args.unshift(JSON.stringify(arguments[j]));
  }

  const params = '(' + _args.join(', ') + ')';

  logger.info(moduleName + functionCall + params);
}

module.exports = mongoose;
