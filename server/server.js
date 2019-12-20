require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//Configuración global de rutas
app.use(require('./routes/index.js'));


const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;
        console.log('Database Cafe Working ' + process.env.URLDB);
    });


app.listen(process.env.PORT, () => {
    console.log(`Server runnig on port ${process.env.PORT} v1`);
})