const mongoose = require('mongoose');
const logger = require("../logger");
const dbConnection = async() => {
    try {
        mongoose.set("debug", function(coll, method, query, doc, options) {
            let set = {
                coll: coll,
                method: method,
                query: query,
                doc: doc,
                options: options
            };
            if(method === "error"){
                logger.error("Error en operación Mongo " + JSON.stringify(set.doc));
            }
        });

        await mongoose.connect(process.env.DBCONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB online');
    } catch (error) {
        console.log(error);
        logger.error("Error al realizar conexión con la base de datos MongoDB");
        throw new Error('Error al iniciar la BD');
    }
    mongoose.connection.on('error', (error) => {
        logger.error("Detección de error en middleware Mongo", + error);
      });
}

module.exports = {
    dbConnection
}