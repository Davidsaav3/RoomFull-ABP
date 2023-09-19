/*
Importación de módulos
*/
const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const app = express();
const { dbConnection } = require('./database/configdb');
const { mysqlConnection } = require('./database/mysqldb');
const bodyParser = require('body-parser');
const logger = require("./logger");
app.use(helmet());

//Esto esta comentado porque la subida de archivos no funcionaba y ahora si
/*  */
/* app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({ extended: true })); */
//app.use(bodyParser.MAXSIZEUPLOAD = '50mb');

/* app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));
 */



app.use(cors());
/* */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(fileUpload({
    createParentPath: true,
    limits: { fieldSize: 50000000000, fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    debug: true,
}));



app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/suscripciones', require('./routes/suscripciones'));
app.use('/api/tipoSuscripciones', require('./routes/tipoSuscripciones'));
app.use('/api/chats', require('./routes/chats'));
app.use('/api/escenas', require('./routes/escenas'));
app.use('/api/asistente', require('./routes/asistente'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/estadisticas', require('./routes/estadisticas'));



require('dotenv').config();
dbConnection();
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
    logger.info("Se ha lanzado el API");
});