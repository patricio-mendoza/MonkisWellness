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
    host: "wellness-monkis-server.mysql.database.azure.com",
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

// USERS
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
server.get("/api/user/reservaciones/:id", (req, res) => {   
    let id = req.params.id;
    sql = `SELECT * FROM Reservacion WHERE "${id}" = matricula OR "${id}" = num_nomina`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});
server.get("/api/avisos/:id", (req, res) => {
    let id = req.params.id;
    sql = `SELECT * FROM Anuncio WHERE matricula = "${id}"`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});

// GYM
server.get("/api/gym/estado", (req, res) => {    
    sql = `SELECT estado FROM Wellness WHERE id = 1`

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ estado: result[0].estado });    
    });
});


//DEPORTES
server.get("/api/deportes", (req, res) => {
    sql = `SELECT * FROM Deporte`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});
server.get("/api/deportes/cancha/:id", (req, res) => {    
    let id = req.params.id;
    let sql = `SELECT esp.id_espacio, esp.nombre AS nombre_espacio, esp.url_fotos, ins.nombre AS nombre_instalacion
    FROM Espacio esp JOIN Instalacion ins ON esp.id_instalacion = ins.id_instalacion JOIN EspacioDeporte espdep ON esp.id_espacio = espdep.id_espacio JOIN Deporte dep ON dep.id_deporte = espdep.id_deporte
    WHERE espdep.id_deporte = ${id}
    ORDER BY esp.id_espacio`

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});

//ESPACIOS
server.get("/api/reservaciones/espacio/:id", (req, res) => {
    let id = req.params.id;
    let sql = `SELECT DATE_FORMAT(hora_entrada, "%Y-%m-%dT%k:%i") as start, DATE_FORMAT(hora_salida, "%Y-%m-%dT%k:%i") as end FROM Reservacion WHERE estatus=1 AND id_espacio=${id}`

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});
