const express = require("express");
const bodyParser = require("body-parser")
const mysql = require("mysql")
const cors = require("cors")

const server = express()
const port = 8888;

server.use(bodyParser.urlencoded({ extended: false}));
server.use(cors());

// Conexion con base de datos
var config = {
    host: "monkisserverdb.mysql.database.azure.com",
    user: "pato",
    password: "supercontra123!",
    database: "Monkis_DB",
    ssl: true
};

const db = new mysql.createConnection(config); 

db.connect( function (error) {
    if (error) {
        console.log("Error connecting to database")
    } else {
        console.log("Connection to database succesfull")
    }
});

server.listen(port, function check(error) {
    if (error) console.log("Error...!!!!")
    else console.log(`Started in port ${port}`)
});

server.get("/api/user/:id", (req, res) => {    
    let id = req.params.id

    if (id.length != 9 || (id[0] !== 'A' && id[0] !== 'L')) {
        res.send({ status: false, data: [] })
        return;
    }

    var sql = ""
    if (id[0] === 'A') {
        sql += `SELECT * FROM Alumno WHERE "${id}" = matricula`
    } else {
        sql += `SELECT * FROM Administrador WHERE "${id}" = num_nomina`
    }

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ status: true, data: result });    
    });
});

server.get("/api/gym/estado", (req, res) => {    
    sql = `SELECT estado FROM Wellness WHERE id = 1`

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ estado: result[0].estado });    
    });
});

server.get("/api/user/reservaciones/:id", (req, res) => {   
    let id = req.params.id;
    sql = `SELECT * FROM Reservacion WHERE "${id}" = matricula OR "${id}" = num_nomina`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});

server.get("/api/deportes", (req, res) => {
    sql = `SELECT * FROM Deporte`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});

server.get("/api/avisos/:id", (req, res) => {
    let id = req.params.id;
    sql = `SELECT CONCAT(HOUR(res.hora_entrada), ':', MINUTE(res.hora_entrada), ' - ', HOUR(res.hora_salida), ':', MINUTE(res.hora_salida)) AS tiempoReserva,
                CONCAT(HOUR(avi.tiempo), ':', MINUTE(avi.tiempo)) AS tiempoNotif,
                avi.texto AS textoAnuncio,
                avi.encabezado AS tituloNofif,
                esp.nombre as cancha,
                DATE_FORMAT(avi.tiempo, '%Y/%m/%d') AS fechaNotif,
                avi.id_anuncio as id_anuncio
            FROM Reservacion res JOIN Anuncio avi ON avi.matricula = res.matricula JOIN Espacio esp ON esp.id_espacio = res.id_espacio
            WHERE res.matricula="${id}"`;
    console.log(sql)
    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});