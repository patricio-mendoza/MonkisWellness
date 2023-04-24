const express = require("express");
const bodyParser = require("body-parser")
const mysql = require("mysql")

const server = express()
server.use(bodyParser.json())

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

server.listen(8088, function check(error) {
    if (error) console.log("Error...!!!!")
    else console.log("Started...!!!!")
});

server.post("/api/add/alumno", (req, res) => {
    let details = {
        matricula: req.body.matricula,
        nombre: req.body.nombre,
        carrera: req.body.carrera
    };
    let sqlquery = "INSERT INTO Alumno(matricula, nombre, carrera) VALUES ('A12345678', 'Omar Mendoza', 'ITC')"
    db.query(sqlquery, details, (error) => {
        if (error) {
            res.send({ status: false, message: "student created failed" });
        } else {
            res.send({ status: true, message: "student created succeded" });
        }
    })
});