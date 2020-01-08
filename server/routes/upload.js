const express = require('express');
const fileUpload = require('express-fileupload');
const { verificaToken } = require('../middlewares/autenticacion');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

const app = express();

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', verificaToken, (req, resp) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return resp.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    // validar tipos
    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return resp.status(400).json({
            ok: false,
            err: {
                message: `tipo no válido ${tipo}, los válidos son:` + tiposValidos.join(',')
            }
        })
    }

    let archivo = req.files.archivo;
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return resp.status(400).json({
            ok: false,
            err: {
                message: 'Extension no válida, son validas:' + extensionesValidas.join(',')
            }
        })
    }

    //  Canviar el nom de l'arxiu
    let newName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${newName}`, function(err) {
        if (err)
            return resp.status(500).json({
                ok: false,
                err: err
            })

        // La imatge ja està crregada
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, resp, newName);

                break;
            case 'productos':
                break;
            default:
                break;
        }


    });

});

function imagenUsuario(id, resp, newName) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarArchivo(newName, 'usuarios');
            return resp.status(400).json({
                ok: false,
                err: err
            })
        } else {

            if (!usuarioDB) {
                borrarArchivo(newName, 'usuarios');
                return resp.status(400).json({
                    ok: false,
                    err: {
                        message: 'user not exists'
                    }
                })
            }

            borrarArchivo(usuarioDB.img, 'usuarios');


            usuarioDB.img = newName;
            usuarioDB.save((err, usuarioDB) => {
                resp.json({
                    ok: true,
                    usuario: usuarioDB,
                    img: newName
                });
            })
        }



    })


}


function borrarArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;