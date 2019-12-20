const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: 'User not exists'
            })
        }

        //Validem el password
        if (bcrypt.compareSync(body.password, usuario.password)) {

            let token = jwt.sign({
                usuario: usuario
            }, process.env.SEED, { expiresIn: process.env.EXPIRES_TOKEN });

            res.json({
                ok: true,
                usuario: usuario,
                token: token,
                message: 'User correctly authenticated'
            })
        } else {
            res.json({
                ok: false,
                err: 'Password not correct'
            })
        }

    })




})




module.exports = app;