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

db.connect(function (error) {
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
        if (error) res.send({ status: false, data: [] })
        else res.send({ status: true, data: result });    
    });
});
server.get("/api/user/reservaciones/:id", (req, res) => {
    let id = req.params.id;
    sql = `SELECT sub.id_reservacion, sub.hora_entrada, sub.hora_salida, sub.estatus, sub.nombre_espacio, sub.nombre_deporte, sub.nombre_instalacion
    FROM (
        SELECT res.id_reservacion, DATE_FORMAT(res.hora_entrada, '%Y/%m/%d %H:%i') as hora_entrada, DATE_FORMAT(res.hora_salida, '%Y/%m/%d %H:%i') as hora_salida, res.estatus, esp.nombre as nombre_espacio, dep.nombre as nombre_deporte, ins.nombre AS nombre_instalacion,
               ROW_NUMBER() OVER (PARTITION BY res.id_reservacion ORDER BY res.id_reservacion) AS row_num
        FROM Reservacion res
        JOIN Espacio esp ON res.id_espacio = esp.id_espacio
        JOIN EspacioDeporte espdep ON espdep.id_espacio = esp.id_espacio
        JOIN Deporte dep ON dep.id_deporte = espdep.id_deporte
        JOIN Instalacion ins ON ins.id_instalacion = esp.id_instalacion
        WHERE ("${id}" = matricula OR "${id}" = num_nomina)
    ) sub
    WHERE sub.row_num = 1
    ORDER BY sub.estatus, sub.hora_entrada`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });
    });
});
server.get("/api/avisos/:id", (req, res) => {
    let id = req.params.id;
    sql = `SELECT CONCAT(DATE_FORMAT(res.hora_entrada, '%H:%i'), ' - ', DATE_FORMAT(res.hora_salida, '%H:%i')) AS tiempoReserva,
                DATE_FORMAT(avi.tiempo, '%H:%i') AS tiempoNotif,
                avi.texto AS textoAnuncio,
                avi.encabezado AS tituloNofif,
                esp.nombre as cancha,
                DATE_FORMAT(avi.tiempo, '%Y/%m/%d') AS fechaNotif,
                avi.id_anuncio as id_anuncio
            FROM Reservacion res JOIN Anuncio avi ON avi.id_reservacion = res.id_reservacion JOIN Espacio esp ON esp.id_espacio = res.id_espacio
            WHERE avi.matricula="${id}"
            ORDER BY avi.tiempo DESC`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });
    });
});
server.post('/api/generar/aviso', (req, res) => {
    let sql = `INSERT INTO Anuncio(matricula, encabezado, texto, tiempo, id_reservacion) VALUES ('${req.body.matricula}', '${req.body.encabezado}', '${req.body.texto}', now(), ${req.body.id_reservacion})`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
    });
});
server.delete('/api/delete/aviso/:id', (req, res) => {
    let id = req.params.id;
    let sql = `DELETE FROM Anuncio WHERE id_anuncio=${id}`;
    
    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else{
            res.send({ data: true });
        } 
    });
});

server.get('/api/reservacionesActivas/espacio/:id', (req, res) => {
    let id = req.params.id;
    let sql = `SELECT id_reservacion as id, COALESCE(matricula, num_nomina) AS dueno, CONCAT(DATE_FORMAT(hora_entrada, '%H:%i'), ' - ', DATE_FORMAT(hora_salida, '%H:%i')) as hora, DATE_FORMAT(hora_entrada, '%Y/%m/%d') as fecha FROM Reservacion WHERE "${id}" = id_espacio AND estatus=1`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });
    });
});
server.delete('/api/reservacion/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = `UPDATE Reservacion SET estatus=3 WHERE id_reservacion=${id}`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else {
            res.send({ data: true });
        }
    });
});
server.post('/api/generar/avisoCancelacion', (req, res) => {
    let id = localStorage.getItem("id")
    let sql = `INSERT INTO Anuncio(matricula, encabezado, texto, tiempo) VALUES ('${id}, 'Reservacion Cancelada', ''')`
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
server.get('/api/gym/estaSemana', (req, res) => {
    let sql = `SELECT DAYOFWEEK(tiempo) as dia, AVG(aforo) as aforo FROM Historial WHERE tiempo > DATE_FORMAT(NOW() - INTERVAL 7 day, '%Y-%m-%d 00:00.000') AND tiempo < now() GROUP BY DAYOFWEEK(tiempo) ORDER BY DAYOFWEEK(tiempo);`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
});
server.get('/api/gym/semana/:fecha', (req, res) => {
    let fecha = req.params.fecha;

    let sql = `SELECT DAYOFWEEK(tiempo) as dia, AVG(aforo) as aforo FROM Historial WHERE tiempo > DATE_FORMAT("${fecha}" - INTERVAL 7 day, '%Y-%m-%d 00:00.000') AND tiempo < "${fecha}" GROUP BY DAYOFWEEK(tiempo) ORDER BY DAYOFWEEK(tiempo);`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
});
server.get('/api/gym/historial/:fecha', (req, res) => {
    let fecha = req.params.fecha;

    let sql = `SELECT HOUR(tiempo) as hora, CASE WHEN tiempo < now() THEN aforo ELSE 0 END aforo FROM Historial WHERE tiempo >= DATE_FORMAT("${fecha}", '%Y-%m-%d 00:00.000') AND tiempo < DATE_ADD(DATE_FORMAT("${fecha}", '%Y-%m-%d 00:00.000'),INTERVAL 1 DAY) and aforo > 0;
    `
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
});
server.get('/api/gym/descargar/:fechaInicio/:fechaFinal', (req, res) => {
    let fecha = req.params.fecha;

    let sql = `SELECT tiempo, aforo FROM Historial WHERE tiempo > '${fechaInicio}' AND tiempo < '${fechaFinal}';
    `
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
});

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

//Get para tabla historial
server.get('/api/gym/historial/:fecha/:fecha_sem_ant', (req, res) => {
    let fecha = req.params.fecha;
    let fecha_sem_ant = req.params.fecha_sem_ant;
    let sql = `Select aforo, tiempo, dayname(tiempo) as dia from historial  WHERE (tiempo < '${fecha}' AND tiempo > '${fecha_sem_ant}') ORDER BY dia desc, tiempo asc`
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
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

// Daniel
// Obtener reservaciones de un espacio de tiempo bloqueado
server.get("/api/reservaciones/bloqueadas/:id/:fecha_inicio/:fecha_fin", (req, res) => {
    let id = req.params.id;
    
    let sql = `select id_reservacion, matricula from reservacion where id_espacio = ${id} and hora_entrada > '${req.params.fecha_inicio}' and hora_salida < '${req.params.fecha_fin}';`
    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});

server.get("/api/reservaciones/bloqueos_espacio/:id", (req,res) => {
    let id = req.params.id;
    let sql = `select id_bloqueo, fecha_inicio, hora_inicio, hora_fin from bloqueo where id_espacio = ${id};`;

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});

server.put("/api/reservaciones/liberar_espacio/:id", (req,res) => {
    let id = req.params.id;
    let sql = `delete from bloqueo where id_bloqueo = ${id};`;

    db.query(sql, function (error, result) {
        if (error) console.log(error)
        else res.send({data: result });
    });
});

server.post('/api/reservar/espacio', (req, res) => {
    let sql = "";
    if (req.body.matricula) sql = `INSERT INTO Reservacion(matricula, num_nomina, id_espacio, hora_entrada, hora_salida, prioridad, estatus) VALUES ("${req.body.matricula}", ${req.body.num_nomina}, ${req.body.id_espacio}, "${req.body.hora_entrada}", "${req.body.hora_salida}", ${req.body.prioridad}, ${req.body.estatus})`
    else sql = `INSERT INTO Reservacion(matricula, num_nomina, id_espacio, hora_entrada, hora_salida, prioridad, estatus) VALUES (${req.body.matricula}, "${req.body.num_nomina}", ${req.body.id_espacio}, "${req.body.hora_entrada}", "${req.body.hora_salida}", ${req.body.prioridad}, ${req.body.estatus})`

    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ status: true });
    });
});
server.get('/api/instalacion/datos/:id', (req, res) => {
    let id = req.params.id;
    let dia = new Date();
    numDia = dia.getDay() === 0 ? 7 : dia.getDay();

    let sql = `SELECT es.nombre as nombre, ins.id_instalacion as inst_id, ins.nombre as nombreInstalacion FROM Horario ho JOIN Instalacion ins ON ins.id_instalacion = ho.id_instalacion JOIN Espacio es ON ins.id_instalacion = es.id_instalacion WHERE es.id_espacio=${id} AND dia=${numDia}`
    db.query(sql, function (error, result) {
        if (error) console.log("Error")
        else res.send({ data: result });
    });
})
server.put('/api/cancelar/mireserva/:id', (req, res) => {
    let id = req.params.id;
    let sql = `UPDATE Reservacion SET estatus = 3 WHERE id_reservacion = ${id}`

    db.query(sql, function (error) {
        if (error) console.log("Error retrieving the data")
        else{
            res.send({ data: true });
        } 
    });
});
server.put('/api/reserva/enprogreso/:id', (req, res) => {
    let id = req.params.id;
    let sql = `UPDATE Reservacion SET estatus = 0 WHERE id_reservacion = ${id}`
    
    db.query(sql, function (error) {
        if (error) console.log("Error retrieving the data")
        else{
            res.send({ data: true });
        } 
    });
});


// Daniel
// Insertar bloqueo 
server.post('/api/bloquea/:id', (req,res)=>{

    let id = req.params.id;
    let sql = `Insert into bloqueo(id_espacio, dia, hora_inicio, hora_fin, repetible, fecha_inicio, fecha_final) values (${id},${req.body.dia},'${req.body.hora_inicio}','${req.body.hora_fin}',2,'${req.body.fechaInicio}','${req.body.fechaFinal}');`
    
    db.query(sql, function (error) {
        if (error) console.log(error)
        else{
            res.send({ data: true });
        } 
    });

})

server.get('/api/instalacion/horas_disponibles/:id_instalacion/:id_dia/:time_interval', (req, res) => {
    let id_instalacion = req.params.id_instalacion;
    let id_dia = req.params.id_dia;
    let time_interval = req.params.time_interval;

    let sql = `SELECT * FROM (
        SELECT LEFT(TIME(datetime_interval), char_length(TIME(datetime_interval)) -3) AS hora, false as is_selected, false as is_disabled
            FROM (
                SELECT TIMESTAMPADD(MINUTE, (${time_interval} * (t3.num + t2.num + t1.num)), start_time) AS datetime_interval
                FROM
                    (SELECT 0 AS num UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t1,
                    (SELECT 0 AS num UNION ALL SELECT 10 UNION ALL SELECT 20 UNION ALL SELECT 30 UNION ALL SELECT 40 UNION ALL SELECT 50) t2,
                    (SELECT 0 AS num UNION ALL SELECT 100 UNION ALL SELECT 200 UNION ALL SELECT 300 UNION ALL SELECT 400 UNION ALL SELECT 500) t3,
                    (SELECT STR_TO_DATE(CONCAT('2023-05-31', hora_apertura), '%Y-%m-%d %H:%i') AS start_time, STR_TO_DATE(CONCAT('2023-05-31', hora_cierre), '%Y-%m-%d %H:%i') AS end_time
                    FROM Horario WHERE id_instalacion=${id_instalacion} AND dia=${id_dia}) params
                WHERE TIMESTAMPADD(MINUTE, (${time_interval} * (t3.num + t2.num + t1.num)), start_time) <= end_time
            ) intervals
            ORDER BY hora) res
        WHERE TIME(res.hora) >= TIME(now());`

    db.query(sql, function (error, result) {
        if (error) console.log("Error retrieving the data")
        else res.send({ data: result });    
    });
});
