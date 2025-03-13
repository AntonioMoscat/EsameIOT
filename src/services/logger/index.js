const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const expressWinston = require('express-winston');

// formatting console message
const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Define the log format for file
const fileFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [
    new transports.Console({
      format: combine(
        format.colorize(),
        consoleFormat
      )
    }),
    new transports.File({
      level: 'info',
      filename: 'logs/info.log',
      format: fileFormat
    }),
    new transports.File({
      level: 'errors',
      filename: 'logs/error.log',
      format: fileFormat
    }),
    new transports.File({
      level: 'warn',
      filename: 'logs/warn.log',
      format: fileFormat
    }),

  ]
});

/* eslint-disable */
logger.expressLogger = expressWinston.logger({
  winstonInstance: logger,
  msg:
    '{{req.method}} {{res.statusCode}} {{res.responseTime}}ms user:{{req.userId?req.userId:"Anonymous"}} {{req.url.split("?")[0]}}',
  colorize: true
});


module.exports = logger;
