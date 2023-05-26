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
    sql = `SELECT * FROM Reservacion WHERE ("${id}" = matricula OR "${id}" = num_nomina) AND estatus = 1`;

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
server.post('/api/generar/aviso', (req, res) => {
    let sql = `INSERT INTO Anuncio(matricula, encabezado, texto, tiempo) VALUES ('${req.body.matricula}', 'Reservacion Confirmada', 'Tu reservacion en la ${req.body.id_espacio} en el CBD2 ha sido guardada', now())`;
    
    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
    });
});
server.get('/api/reservacionesActivas/espacio/:id', (req, res) => {
    let id = req.params.id;
    let sql = `SELECT id_reservacion as id, matricula, CONCAT(HOUR(hora_entrada), ':', MINUTE(hora_entrada), ' - ',HOUR(hora_salida), ':', MINUTE(hora_salida)) as hora, DATE_FORMAT(hora_entrada, '%Y/%m/%d') as fecha FROM Reservacion WHERE "${id}" = id_espacio AND estatus=1`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });
    });
});
server.delete('/api/reservacion/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = `DELETE FROM Reservacion WHERE id_reservacion=${id}`;
    
    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else{
            res.send({ data: true });
        } 
    });
}); 

// GYM
server.get("/api/gym/estado", (req, res) => {    
    let sql = `SELECT estado FROM Wellness WHERE id = 1`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ estado: result[0].estado });    
    });
});

// Daniel
// Cambiar el estado del gimnasio a abierto 
server.put("/api/gym/estado/abrir", (req,res) => {
    let sql = "UPDATE Wellness SET estado = 1";

    db.query(sql, function (error) {
        if (error) console.log("Error abriendo el gimnasio")
        else res.send({ data: true });
    });
});

// Daniel
// Cambiar el estado del gimnasio a abierto 
server.put("/api/gym/estado/cerrar", (req,res) => {
    let sql = "UPDATE Wellness SET estado = 0"

    db.query(sql, function (error) {
        if (error) console.log("Error cerrando el gimnasio")
        else res.send({ data: true });
    });

});

server.put("/api/gym/updateAforo/:newAforo", (req, res) => {
    let newAforo = req.params.newAforo;
    let sql = `UPDATE Wellness SET aforo_max = ${newAforo} WHERE id=1;`
    
    db.query(sql, function (error) {
        if (error) console.log("Error Updating the Data")
        else res.send({ data: true });    
    });
});

server.get("/api/gym/aforo", (req, res) => {
    let sql = `SELECT aforo_max, aforo_actual FROM Wellness WHERE id = 1`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result[0] });    
    });
});

// Programar nuevos cierres

server.post('/api/bloqueo/', (req, res) => {
    let sql = "";
    sql = `INSERT INTO Bloqueo(id_espacio, id_wellness, dia, hora_inicio, hora_fin, repetible) VALUES (${req.body.id_espacio}, "${req.body.id_wellness}", "${req.body.dia}", '${req.body.hora_inicio}', '${req.body.hora_fin}', ${req.body.repetible})` // Esto es una query
    db.query(sql, function (error, result) {
        if (error) console.log(sql)
        else res.send({ status: true });
    });
});


server.get('/api/gym/estimaciones', (req, res) => {
    let fecha = new Date();
    var offset = -(new Date().getTimezoneOffset() / 60);

    fecha.setHours(fecha.getHours() + offset)
    fecha = fecha.toISOString().slice(0, 19).replace('T', ' ');

    let sql = `SELECT aforo FROM Historial WHERE tiempo > '${fecha}' LIMIT 3`;
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
})

// Daniel
// Obtener todos los cierres repetibles
server.get('/api/gym/cierresR', (req,res) => {
    // Ordena por dia y hora las siguientes aperturas aplicables, obtiene el primer resultado aplicable
    sql = "select id_bloqueo, dia, hora_inicio, hora_fin from bloqueo where repetible = 1 order by dia, hora_inicio, hora_fin"
    db.query(sql, function (error, result) {
        if (error) console.log(error)
        else res.send({ data: result });
    });
})

// Daniel
// Ver la siguiente apertura
server.get('/api/gym/siguienteAp', (req,res) => {
    // Ordena por dia y hora las siguientes aperturas aplicables, obtiene el primer resultado aplicable
    sql = "select dia, hora_fin from bloqueo where ((dia =  dayofweek(localtimestamp) AND hora_fin > localtime()) or dia = dayofweek(localtimestamp)+1 or (dia = 1 AND dayofweek(localtimestamp) = 7)) AND repetible < 2 order by case when dayofweek(localtimestamp) = 7 then dia end desc, case when dayofweek(localtimestamp) != 7 then dia end, hora_fin"
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
})

// Daniel
// Ver el siguiente cierre
server.get('/api/gym/siguienteCi', (req,res) => {
    // Ordena por dia y hora los siguientes cierres aplicables, obtiene el primer resultado aplicable
    sql = "select dia, hora_inicio from bloqueo where ((dia =  dayofweek(localtimestamp) AND hora_inicio > localtime()) or dia = dayofweek(localtimestamp)+1 or (dia = 1 AND dayofweek(localtimestamp) = 7)) AND repetible < 2 order by case when dayofweek(localtimestamp) = 7 then dia end desc,case when dayofweek(localtimestamp) != 7 then dia end,hora_inicio"
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
})

// Daniel 
// Inserta en la tabla de bloqueos el cierre y apertura manual (Utilizan el mismo query, se diferencian por los datos insertados)
server.post('/api/gym/cambioManual', (req,res) => {
    sql = `insert into bloqueo(id_wellness, dia, hora_inicio, hora_fin, repetible) values (1,${req.body.dia},'${req.body.hora_inicio}','${req.body.hora_fin}',0)`
    db.query(sql,function(error,result) {

        if(error) console.log(error)
        else {
            res.send({data:result})
        };
    });
})

// Daniel
// Cancela todos los cierres manuales, ya que solo puede haber uno activo a la vez
server.put("/api/gym/cancelarCierresM", (req, res) => {
    let sql = `Delete from bloqueo WHERE repetible = 0;`
    
    db.query(sql, function (error) {
        if (error) console.log("Error Updating the Data")
        else res.send({ data: true });    
    });
});

// Daniel
// Borra el cierre repetible seleccionado
server.put("/api/gym/borrar", (req, res) => {
    let sql = `Delete from bloqueo WHERE id_bloqueo = ${req.body.id_bloqueo};`
    
    db.query(sql, function (error) {
        if (error) console.log(sql)
        else res.send({ data: true });    
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
    let hourOffSet = new Date().getTimezoneOffset() / 60;
    let sql = `SELECT ADDTIME(hora_entrada, '-${hourOffSet}:00:10') as start, ADDTIME(hora_salida, '-${hourOffSet}:00:10') as end FROM Reservacion WHERE estatus=1 AND id_espacio=${id}`;
    
    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});
server.post('/api/reservar/espacio', (req, res) => {
    let sql = "";
    if (req.body.matricula) sql = `INSERT INTO Reservacion(matricula, num_nomina, id_espacio, hora_entrada, hora_salida, prioridad, estatus) VALUES ("${req.body.matricula}", ${req.body.num_nomina}, ${req.body.id_espacio}, "${req.body.hora_entrada}", "${req.body.hora_salida}", ${req.body.prioridad}, ${req.body.estatus})`
    else  sql = `INSERT INTO Reservacion(matricula, num_nomina, id_espacio, hora_entrada, hora_salida, prioridad, estatus) VALUES (${req.body.matricula}, "${req.body.num_nomina}", ${req.body.id_espacio}, "${req.body.hora_entrada}", "${req.body.hora_salida}", ${req.body.prioridad}, ${req.body.estatus})`
    
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ status: true });
    });
});
server.get('/api/instalacion/horario/:id', (req, res) => {
    let id = req.params.id;
    let dia = new Date();
    numDia = dia.getDay() === 0 ? 7 : dia.getDay();

    let sql = `SELECT es.nombre as nombre, HOUR(ho.hora_apertura) as apertura, HOUR(ho.hora_cierre) as cierre FROM Horario ho JOIN Instalacion ins ON ins.id_instalacion = ho.id_instalacion JOIN Espacio es ON ins.id_instalacion = es.id_instalacion WHERE es.id_espacio=${id} AND dia=${numDia}`
    console.log(sql);
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
})