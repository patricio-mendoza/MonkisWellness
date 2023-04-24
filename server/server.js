const express = require("express");
const bodyParser = require("body-parser")
const mysql = require("mysql")

const server = express()
server.use(bodyParser.urlencoded({ extended: false}));

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

server.get("/api/user-exists", (req, res) => {
    var sql = ""
    if (req.body.matricula) {
        sql += `SELECT * FROM Alumno WHERE "${req.body.matricula}" = matricula`
    } else {
        sql += `SELECT * FROM Administrador WHERE "${req.body.num_nomina}" = num_nomina`
    }

    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error retrieving the data") 
        } else {
            res.send({ status: true, data: result })
        }
    });
});