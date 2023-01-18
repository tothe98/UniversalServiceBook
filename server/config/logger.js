const {createLogger, format, transports, error} = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const {label, timestamp, json, combine, metadata} = format
require('winston-mongodb')

const logger = createLogger({
    format: combine(
        label(),
        timestamp(),
        metadata(),
        json(),
    ),
    transports: [
        new DailyRotateFile({
            filename: 'log-%DATE%.log',
            dirname: './logs/',
            datePattern: 'YYYYMMDDHH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            prepend: true
        }),
        new transports.Console({
            level:error
        }),
        new transports.MongoDB({
            db: process.env.MONGODB,
            options: {
                useUnifiedTopology: true
            }
        })
    ]
});

module.exports = {logger}
