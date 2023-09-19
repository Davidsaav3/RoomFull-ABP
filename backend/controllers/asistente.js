const request = require('request');
const nodemailer = require("nodemailer");
const mongodb = require('mongodb').MongoClient;



const getAsistente = async(req, res = response) => {

    res.json({
        ok: true,
        msg: 'getAsistente',
        mensaje: 'Api Roul'
    });
}

const postAsistente = async(req, res = response) => {
    const base_env = process.env.DBCONNECTION.split("/")[3];
    let action = req.body.queryResult.action;

    // tiempo // 
    if (action == 'tiempo') {
        let pcity = req.body.queryResult.outputContexts[0].parameters.geocity;
        let pkey = 'b7a014119001185ce4cd7abd788beaed';
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${pcity}&APPID=${pkey}`;

        // get API RESTful https
        request(url, function(error, response, body) {

            // convert to JSON
            let obj = JSON.parse(body);
            console.log(obj);

            var botSpeech = "Error tiempo";


            if (obj.cod == '200') {
                //Response to Dialogflow
                let tiempo = obj.weather[0].description;

                let kelvin = 273.15;
                let temperature = Math.round(parseFloat(obj.main.temp - kelvin) * 100) / 100;
                if (obj.weather[0].description == "clear sky") {
                    tiempo = "el cielo está despejado";
                }
                if (obj.weather[0].description == "scattered clouds") {
                    tiempo = "nubes dispersas";
                }
                botSpeech = "La temperatura en " + pcity + " es de " + temperature + " ºC y " + tiempo + "";
            }
            res.setHeader('Content-Type', 'application/json');

            out = {
                fulfillmentText: botSpeech,
                fulfillmentMessages: null
            };

            var outString = JSON.stringify(out);
            res.send(outString);

        });
    }

    // recordatorio //
    if (action == 'recordatorio') {
        let fecha = req.body.queryResult.parameters.date.toString();
        let email = req.body.queryResult.parameters.email.toString();
        let mensaje = req.body.queryResult.parameters.mensaje.toString();

        console.log(fecha);
        console.log(email);
        console.log(mensaje);
        var botSpeech = "Error correo";

        mail(email, mensaje, fecha).catch(console.error);
        botSpeech = "Correo enviado";
        console.log("Okay correo");

        res.setHeader('Content-Type', 'application/json');

        out = {
            fulfillmentText: botSpeech,
            fulfillmentMessages: null
        };

        var outString = JSON.stringify(out);
        res.send(outString);
    }

    // busqueda //
    if (action == 'busqueda') {
        let texto = req.body.queryResult.parameters.texto;
        console.log(texto);
        var botSpeech = "Error busqueda";
        mongodb.connect(process.env.DBCONNECTION, (err, con) => {
            if (err) {
                console.log(`No se puede conectar al servidor de mongo ${process.env.DBCONNECTION}`);
                process.exit(1);
            }
            con.db(base_env).collection('usuarios')
                .find({ nombreUsuario: texto }).toArray((err, docs) => {
                    if (err) {
                        console.log(`Error al momento de realizar la consulta`);
                    }
                    botSpeech = "Resultados de busqueda: \n";
                    const tarjetas= [];
                    const payload= [];
                    const richContent= [];
                    const fulfillment= [];

                      docs.forEach(element => {
                        var card = {
                            type: "image",
                            rawUrl: element.imagen,
                            accessibilityText: "Dialogflow across platforms",
                        }
                        var card2 = {
                            actionLink: "https://roomfull.ovh/user/modelo/" + element.nombreUsuario,
                            type: "info",
                            title: element.nombreUsuario,
                            subtitle: "Empresa: " + element.empresa,
                        }
                        richContent.push(card);
                        richContent.push(card2);

                    });
                    payload.push({richContent:richContent});
                    fulfillment.push({payload:payload});

                    console.log("Okay busqueda");
                    res.setHeader('Content-Type', 'application/json');
                    out = {
                        //fulfillmentMessages: tarjetas,
                        //richContent: tarjetas2,
                        fulfillmentMessages: fulfillment
                    };
                    const obj = {
                        fulfillmentMessages: [
                            {
                                payload:{
                                    richContent:[
                                        richContent
                                        ]
                                }
                            }
                        ]
                    };
                    var outString = JSON.stringify(obj);
                    res.send(outString);
                })
        });

    }

    // suscripcion //
    if (action == 'suscripcion') {
        let tipo = req.body.queryResult.parameters.tipo;
        console.log(tipo);
        var botSpeech = "Error suscripcion";

        mongodb.connect(process.env.DBCONNECTION, (err, con) => {
            // si hay error finalizar
            if (err) {
                console.log(`No se puede conectar al servidor de mongo ${expreprocessss.env.DBCONNECTION}`);
                process.exit(1);
            }
            // si no hay error consultar los estudiantes con el id prorpocionado
            con.db(base_env).collection('tipoSuscripciones')
                .find({}).toArray((err, docs) => {
                    // si hay error entonces finalizar
                    if (err) {
                        console.log(`Error al momento de realizar la consulta`);
                    }
                    let cadena_speech = "";
                    botSpeech = "Aquí tienes todos los tipo de suscripción: \n";
                    const payload= [];
                    const richContent= [];
                    const fulfillment= [];

                    docs.forEach(element => {
                        var card = {
                            title: element.nombre,
                            type: "info",
                            subtitle: element.descripcion + "\n Con un coste de " + element.precio + "€",
                            actionLink: "https://roomfull.ovh/ajustes/premium"
                        }
                        richContent.push(card);
                    });
                    payload.push({richContent:richContent});
                    fulfillment.push({payload:payload});

                    console.log("Okay suscripción");
                    res.setHeader('Content-Type', 'application/json');
                    out = {
                        fulfillmentMessages: fulfillment
                    };
                    const obj = {
                        fulfillmentMessages: [
                            {
                                payload:{
                                    richContent:[
                                        richContent
                                        ]
                                }
                            }
                        ]
                    };
                    var outString = JSON.stringify(obj);
                    res.send(outString);
                })
        });
    }

    if (action == 'IntroduceTipo') {
        let tipo = req.body.queryResult.parameters.subscription;
        if (tipo == "ultra") {
            tipo = "premium ultra";
        }
        if (tipo == "plus") {
            tipo = "premium plus";
        }
        console.log(tipo);
        var botSpeech = "Error suscripcion";

        mongodb.connect(process.env.DBCONNECTION, (err, con) => {
            // si hay error finalizar
            if (err) {
                console.log(`No se puede conectar al servidor de mongo ${expreprocessss.env.DBCONNECTION}`);
                process.exit(1);
            }
            // si no hay error consultar los estudiantes con el id prorpocionado
            con.db(base_env).collection('tipoSuscripciones')
                .find({ nombre: tipo }).toArray((err, docs) => {
                    // si hay error entonces finalizar
                    if (err) {
                        console.log(`Error al momento de realizar la consulta`);
                    }
                    let cadena_speech = "";
                    botSpeech = "Aquí tienes todos los tipo de suscripción: \n";
                    const payload= [];
                    const richContent= [];
                    const fulfillment= [];

                    docs.forEach(element => {
                        var card = {
                            title: element.nombre,
                            type: "info",
                            subtitle: element.descripcion + "\n Con un coste de " + element.precio + "€ \n\nCaracterísticas:\n " + element.caract,
                            actionLink: "https://roomfull.ovh/ajustes/premium"
                        }
                        richContent.push(card);
                    });
                    payload.push({richContent:richContent});
                    fulfillment.push({payload:payload});

                    console.log("Okay suscripción gratis");
                    res.setHeader('Content-Type', 'application/json');
                    out = {
                        fulfillmentMessages: fulfillment
                    };
                    const obj = {
                        fulfillmentMessages: [
                            {
                                payload:{
                                    richContent:[
                                        richContent
                                        ]
                                }
                            }
                        ]
                    };
                    var outString = JSON.stringify(obj);
                    res.send(outString);
                })
        });
    }
}

//

function handle_error(qParameters) {

    out = {
        fulfillmentText: 'Se ha producido un error',
        fulfillmentMessages: null
    };

    return out;
}

//

async function mail(email, mensaje, fecha) {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'fulloopteam@gmail.com', // generated ethereal user
            pass: 'erfrbmkdxaymbgrb', // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: '"FulLoop" <fulloopteam@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Recordatorio Roul (RoomFull):", // Subject line
        text: mensaje, // plain text body
        html: '<html lang="es"><head><style>body{ background-color: #0073ca; display:flex; } h1{color: ffffff; } h3{color: ffffff; }</style><meta charset="utf-8"></head><body><div><img src="https://scontent-mad1-1.xx.fbcdn.net/v/t39.30808-6/316685929_130263016537238_3255098085750535264_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Sg68AC3b0QQAX8vmcj8&_nc_ht=scontent-mad1-1.xx&oh=00_AfB23XIW1ehSJ6eRi3DS2urG2eUm65nt27DmOgcEd-M1Kg&oe=63D2D265" alt="xd" width="50" height="50"><h1>Recordatorio de RoomFull</h1><h3>' + mensaje + '</h3></div></body></html>',
    });
}

module.exports = { getAsistente, postAsistente }