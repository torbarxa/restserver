// Actualitzaem el port en funció de l'entorno
process.env.PORT = process.env.PORT || 3000;

// Entorn
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Exprires 30 days
process.env.EXPIRES_TOKEN = 60 * 60 * 24 * 30;

// Seed desarrollo
process.env.SEED = process.env.SEED || 'seed desarrollo';

// Base de dades
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
process.env.CLIENT_ID = process.env.CLIENT_ID || '249551711091-294q6ofcdl5jh06m9s2f30c198jjhr9g.apps.googleusercontent.com';