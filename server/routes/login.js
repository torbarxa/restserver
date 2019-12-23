const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nom: payload.name,
        email: payload.email,
        img: payload.picture
    }
}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `User can't use google authentication`
                    }
                })
            } else {
                // autenticamos un usuario ya existente
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRES_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    message: 'User correctly authenticated with google'
                })
            }
        } else {
            // creamos el usuario en DB
            let usuario = new Usuario();
            usuario.nom = googleUser.nom;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    })
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRES_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    message: 'User correctly authenticated with google'
                })
            });

        }

    })



})

module.exports = app;