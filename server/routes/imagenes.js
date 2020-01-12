const express = require('express');
const { verificaTokenURL } = require('../middlewares/autenticacion');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/imagenes/:tipo/:img', verificaTokenURL, (req, resp) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        return resp.sendFile(pathImagen);
    }

    pathImagen = path.resolve(__dirname, '../assets/no-image.jpg');
    return resp.sendFile(pathImagen);
    /*    return resp.status(400).json({
            
            ok: false,
            err: {
                message: 'File not exists'
            }
        })


    */


})





module.exports = app;