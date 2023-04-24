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

server.get("/api/user/:id", (req, res) => {
    let id = req.params.id

    if (id.length != 9 || (id[0] != 'A' && id[0] != 'L')) {
        console.log('a')
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
        if (error) {
            console.log("Error retrieving the data") 
        } else {
            res.send({ status: true, data: result })
        }
    });
});