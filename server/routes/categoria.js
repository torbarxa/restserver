const express = require('express');
const Categoria = require('../models/categoria');
const _ = require('underscore');

let { verificaToken, verificaRole } = require('../middlewares/autenticacion');
let app = express();

// Llista de categories
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcio')
        .populate('usuario', 'nom email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                })
            }

            res.json({
                ok: true,
                categorias: categorias
            })

        })
});

// Obtenir una categoria per Id
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findOne({ _id: id }, (err, categoriaDB) => {
        //    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'La categoria no existe'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
})

// Crear categoria
app.post('/categoria', verificaToken, (req, res) => {
    //req.usuario._id

    let body = req.body;
    let categoria = new Categoria();
    categoria.descripcio = body.descripcio;
    categoria.usuario = req.usuario._id;

    categoria.save((err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err: err
            })
        } else {
            res.json({
                ok: true,
                categoria: categoria
            })
        }
    })


});

// Actualitzar una catrgoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, { descripcio: req.body.descripcio }, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

})

// Borrar una catrgoria
app.delete('/categoria/:id', [verificaToken, verificaRole], (req, res) => {
    // solo un admin puede borrar categorías

    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, { estat: false }, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });


})



module.exports = app;