// Actualitzaem el port en funció de l'entorno
process.env.PORT = process.env.PORT || 3000;

// Entorn
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de dades
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;