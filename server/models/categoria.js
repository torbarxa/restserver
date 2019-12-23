const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcio: {
        type: String,
        unique: true,
        required: [true, 'la descripció es oblicatoria']
    },

    estat: {
        type: Boolean,
        default: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);