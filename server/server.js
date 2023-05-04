const express = require("express");
const bodyParser = require("body-parser")
const mysql = require("mysql")
const cors = require("cors")

const server = express()
const port = 8888;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
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
server.get(`/api/deporte/:id`, (req, res) => {
    let id = req.params.id;
    let sql = `SELECT nombre FROM Deporte WHERE id_deporte=${id}`;
    
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
    let sql = `SELECT ADDTIME(hora_entrada, '-06:00:10') as start, ADDTIME(hora_salida, '-06:00:10') as end FROM Reservacion WHERE estatus=1 AND id_espacio=${id}`

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});
server.post('/api/reservar/espacio', (req, res) => {
    let sql = `INSERT INTO Reservacion(matricula, num_nomina, id_espacio, hora_entrada, hora_salida, prioridad, estatus) VALUES ("${req.body.matricula}", ${req.body.num_nomina}, ${req.body.id_espacio}, "${req.body.hora_entrada}", "${req.body.hora_salida}", ${req.body.prioridad}, ${req.body.estatus})`
    
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ status: true });
    });
});
server.get('/api/instalacion/horario/:id', (req, res) => {
    let id = req.params.id;
    let dia = new Date();
    numDia = dia.getDate() === 0 ? 7 : dia.getDate();

    let sql = `SELECT HOUR(ho.hora_apertura) as apertura, HOUR(ho.hora_cierre) as cierre FROM Horario ho JOIN Instalacion ins ON ins.id_instalacion = ho.id_instalacion JOIN Espacio es ON ins.id_instalacion = es.id_instalacion WHERE es.id_espacio=${id} AND dia=${numDia}`
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
})