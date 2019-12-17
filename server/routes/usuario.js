const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const _ = require('underscore');

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let condicio = {
        estat: true
    }

    Usuario.find(condicio, 'nom email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                })
            }

            Usuario.count(condicio, (err, conteo) => {
                res.json({
                    ok: true,
                    usuario: usuarios,
                    quantos: conteo
                })

            })

        });

})

app.post('/usuario', function(req, res) {
    let body = req.body;
    let salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(body.password, salt);

    let usuario = new Usuario({
        nom: body.nom,
        email: body.email,
        password: hash,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }
        usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nom', 'email', 'img', 'role', 'estat']);
    //let body = req.body;
    console.log("put started");
    //    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })


    })


})

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estat: false }, { new: true }, (err, usuarioBorrado) => {
        //    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found!'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})

module.exports = app;