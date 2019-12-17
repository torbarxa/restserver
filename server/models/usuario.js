const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
    nom: {
        type: String,
        required: [true, 'el nom es obligatori']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'el email es obligatori']
    },
    password: {
        type: String,
        required: [true, 'el password es obligatori']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'el role es obligatori'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estat: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },

});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);