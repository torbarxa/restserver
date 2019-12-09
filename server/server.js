require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.json('Evento get')

})

app.post('/', function(req, res) {
    let body = req.body;
    if (body.nom === undefined) {
        res.status(400).json({
            ok: false,
            messaje: 'El nom es obligatori'
        })
    } else {
        res.json({
            persona: body
        });
    }

})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id: id
    })


})

app.delete('/', function(req, res) {
    res.json('Evento delete')

})

app.listen(process.env.PORT, () => {
    console.log(`Server runnig on port ${process.env.PORT} v1`);
})