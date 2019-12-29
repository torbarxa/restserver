const express = require('express');
const app = express();
const Producto = require('../models/producto');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');


// Obtenir tots els productes
app.get('/productos', verificaToken, (req, resp) => {
    //Obetnir productos paginats, i populate de categoria i usuari

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let condicio = {
        disponible: true
    }

    Producto.find(condicio, {})
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                return resp.status(401).json({
                    ok: false,
                    err: err
                });
            }

            Producto.count(condicio, (err, conteo) => {
                if (err) {
                    return resp.status(401).json({
                        ok: false,
                        err: err
                    });
                }

                resp.json({
                    ok: true,
                    productos: productos,
                    total: conteo
                })

            });



        });

});

// Obtenir un producte per id
app.get('/productos/:id', verificaToken, (req, resp) => {
    //Obetnir producte i populate de categoria i usuari
    Producto.findOne({ _id: req.params.id })
        .populate('usuario', 'nom email')
        .populate('categoria', 'descripcio')
        .exec((err, productoDB) => {
            if (err) {
                return resp.status(401).json({
                    ok: false,
                    err: err
                });
            }
            if (productoDB) {
                resp.json({
                    ok: true,
                    producto: productoDB
                })

            } else {
                resp.json({
                    ok: false,
                    messaje: 'Prodcuto no encontrado'
                })
            }

        });

});

// buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, resp) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcio')
        .exec((err, productos) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    err: err
                });
            }

            resp.json({
                ok: true,
                productos: productos,

            })




        });


});



// Crear un producte
app.post('/productos', verificaToken, (req, resp) => {
    //Grabar producte amb categoria i usuari

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                err: err
            })
        }

        resp.json({
            ok: true,
            producto: productoDB
        })
    })




});


// Actualitzar un producte
app.put('/productos/:id', verificaToken, (req, resp) => {
    //Grabar producte amb categoria i usuari
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'categoria']);

    Producto.findByIdAndUpdate(req.params.id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return resp.status(400).json({
                ok: false,
                messaje: 'product not found'
            });
        }

        resp.json({
            ok: true,
            producto: productoDB,
            messaje: 'Producto actualizado crrectamente'

        })
    })

});


app.delete('/productos/:id', verificaToken, (req, resp) => {
    //Borra producte, canvia disponible a falç
    Producto.findByIdAndUpdate(req.params.id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return resp.status(400).json({
                ok: false,
                messaje: 'product not found'
            });
        }

        resp.json({
            ok: true,
            producto: productoDB,
            messaje: 'Producto borrado crrectamente'

        })
    })


});


module.exports = app;