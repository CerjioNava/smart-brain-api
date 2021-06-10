// API PARA SMART BRAIN

import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import register from './controllers/register.js';
import signin from './controllers/signin.js';
import profile from './controllers/profile.js';
import { handleImage, handleAPIcall } from './controllers/image.js';

// Conexión con la base de datos a través del módulo Knex
const db = knex({
    client: 'pg',
    connection: {
        host : process.env.DATABASE_URL,
        ssl: true,
    //   host : 'postgresql-perpendicular-91881',
    //   user : 'postgres',
    //   password : 'root',
    //   database : 'smartbrain'
    }
});

// console.log(postgres.select('*').from('users'));
db.select('*').from('users').then(data => {         // Query 
    console.log('We have', data.length, 'users!');
});


const app = express();
app.use(express.json());        // Middleware para poder interpretar el JSON del body.
app.use(cors());                // Middleware para evitar el error en el browser.

// Base de datos de prueba
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]

}

// ----------------------------------------------------------------
// Functionality

// HOME PAGE GET
app.get('/', (req, res) => {
    res.send('It is working!');
});

// SIGN IN POST
app.post('/signin', (req, res) => {
    signin(req, res, db, bcrypt)
});

// REGISTER POST
app.post('/register', (req, res) => {
    register(req, res, db, bcrypt)
});

// PROFILE GET
app.get('/profile/:id', (req, res) => {
    profile(req, res, db)
});

// IMAGE PUT
app.put('/image', (req, res) => {
    handleImage(req, res, db)
});

// IMAGE POST
app.post('/imageurl', (req, res) => {
    handleAPIcall(req, res)
});

// ----------------------------------------------------------------
// Extraido de la página de bcrypt-nodejs para hacer hash en las passwords. (ASINCRONO)

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

// SINCRONO

// var hash = bcrypt.hashSync("bacon");

// bcrypt.compareSync("bacon", hash); // true
// bcrypt.compareSync("veggies", hash); // false

// ----------------------------------------------------------------

app.listen(process.env.PORT || 3000, () => {
   console.log(`app is running on port ${process.env.PORT}`);
});
