const express = require('express');
const fileUpload = require('express-fileupload');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload', verificaToken, (req, resp) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return resp.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    let archivo = req.files.archivo;
    archivo.mv('uploads/filename.jpg', function(err) {
        if (err)
            return resp.status(500).json({
                ok: false,
                err: err
            })

        resp.json({
            ok: true,
            message: 'file uploaded'
        });
    });

});


module.exports = app;