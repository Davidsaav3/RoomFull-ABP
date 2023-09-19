const mysql = require('promise-mysql');
const logger = require("../logger");
const mysqlConnection = async() => {
    try {
        const conexion = await mysql.createConnection({
            host : process.env.HOSTMYSQL,
            port: process.env.PORTMYSQL,
            database : process.env.DBMYSQL,
            user : process.env.USERMYSQL,
            password : process.env.PASSWORDMYSQL,
        });
       return conexion;
    } catch (error) {
        console.log(error);
        logger.error("Error al realizar conexión con la base de datos MySQL" + error);
        throw new Error('Error al iniciar MySQL DB');
    }
}

module.exports = {
    mysqlConnection
}