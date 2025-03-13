const logger = require('./services/logger');
const _ = require('lodash');
require('dotenv').config();

global.logger = logger;
global._ = _;

const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('La variabile ' + name + ' è necessario per il corretto funzionamento del server');
  }
  return process.env[name];
};

const APP_NAME = requireProcessEnv('APP_NAME');

const config = {
  all: {
    appName: _.capitalize(APP_NAME),
    port: process.env.PORT || 9000,
    privateKey: requireProcessEnv('PRIVATE_KEY'),
    env: requireProcessEnv('ENV'),
    awsMasterUrl: process.env.SECRET_MASTER_URL,
    awsMasterName: process.env.SECRET_MASTER_NAME,
    iotEndpoint: process.env.IOT_ENDPOINT,
    mongo: {
      createMongo: requireProcessEnv('CREATE_MONGO') === 'true',
      options: {
        strictQuery: false,
        strictPopulate: false
      }
    }
  },

  test: {
    mongo: {
      uri: `mongodb://localhost:27888/${APP_NAME}-test`,
      options: {
        debug: false,
      }
    }
  },
  development: {
    mongo: {
      uri: process.env.MONGODB_URI || `mongodb://localhost:27888/${APP_NAME}-dev`,
      options: {
        debug: true,
      }
    }
  },
  production: {
    ip: process.env.IP,
    port: process.env.PORT || 8080,
    expressSSLRedirect: process.env.DISABLE_SSL_REDIRECT !== 'true',
    mongo: {
      uri: process.env.MONGODB_URI || `mongodb://localhost:27888/${APP_NAME}`,
    }
  }
};
module.exports = _.merge(config.all, config[config.all.env]);