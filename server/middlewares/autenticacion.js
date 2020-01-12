const jwt = require('jsonwebtoken');

// Middleware
// Verificar Token
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            res.status(401).json({
                ok: false,
                err,
                message: 'token invalid'
            })
        } else {
            req.usuario = decode.usuario;
            console.log('Token OK!');
            next();
        }

    })

    // try {
    //     jwt.verify(token, process.env.SEED);
    //     next();
    // } catch (err) {
    //     res.status(401).json({
    //         ok: false,
    //         message: 'token invalid'
    //     })
    // }


};

let verificaTokenURL = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            res.status(401).json({
                ok: false,
                err,
                message: 'token invalid'
            })
        } else {
            req.usuario = decode.usuario;
            console.log('Token OK!');
            next();
        }

    })
}

// Middleware para verificar el role de administración
let verificaRole = (req, res, next) => {

    let usuario = req.usuario;
    console.log('Role' + usuario.role);
    if (usuario.role != 'ADMIN_ROLE') {
        res.status(401).json({
            ok: false,
            message: 'User not authorised'
        })
    } else {
        next();
    }


}


module.exports = {
    verificaToken,
    verificaRole,
    verificaTokenURL
}