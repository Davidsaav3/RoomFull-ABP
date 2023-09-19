const winston = require('winston');
/* Limitado a 5MB y un archivo nuevo se genera */
const logger = winston.createLogger({
    format : winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    "transports": [
        new winston.transports.File({
            filename: 'logs/api.log',
            maxsize: 5000000,
            maxFiles: 1,
        })
    ]
});
module.exports = logger;