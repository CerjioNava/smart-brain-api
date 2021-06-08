// API PARA SMART BRAIN

import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

// Conexión con la base de datos a través del módulo Knex
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'root',
      database : 'smartbrain'
    }
});

// console.log(postgres.select('*').from('users'));
db.select('*').from('users').then(data => {         // Query 
    console.log(data);
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
    // res.send('This is working');
    res.send(database.users);
});

// SIGN IN POST
app.post('/signin', (req, res) => {
    // Load hash from your password DB.
    // bcrypt.compare("apple", '$2a$10$0/VMkaFrCMh15yU0WMPJeeRA/xRzIc1982GOmsDtMFwvHkGhGOJai', function(err, res) {
    //     // res == true
    //     console.log('First guess', res)
    // });
    // bcrypt.compare("veggies", '$2a$10$0/VMkaFrCMh15yU0WMPJeeRA/xRzIc1982GOmsDtMFwvHkGhGOJai', function(err, res) {
    //     // res = false
    //     console.log('Second guess', res)
    // });

    if (req.body.email === database.users[0].email &&           // Comparamos usuario
         req.body.password === database.users[0].password) {
        //res.json("success");
        res.json(database.users[0]);
    } else {
        res.status(400).json("error logging in");
    }
});

// REGISTER POST
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;     // Obtenemos la data del body
    db('users')
      .returning('*')  
      .insert({
        email: email,
        name: name,   
        joined: new Date()         
      })
      .then(user => {
        res.json(user[0]); 
      })
      .catch(err => res.status(400).json('unable to register'));

    // bcrypt.hash(password, null, null, function(err, hash) {      // Hash de password
    //     console.log(hash);
    // });

    // database.users.push({                           // Añadimos a la base de datos con el body
    //     id: '125',
    //     name: name,
    //     email: email,
    //     //password: password,
    //     entries: 0,
    //     joined: new Date()        
    // });
    // res.json(database.users[database.users.length-1]);     // Devolvemos un response con el nuevo
});

// PROFILE GET
app.get('/profile/:id', (req, res) => {
    const { id } = req.params                       // Obtiene los parametros del "id" desde el URL.    
    database.users.forEach(user => {                // Loop en los usuarios
        if (user.id === id) {
            return res.json(user);                  // Si existe, devuelve usuario
        } 
    })
    res.status(404).json('no such user');           // Si no existe, 404.
});

// IMAGE PUT
app.put('/image', (req, res) => {
    const { id } = req.body                       // Obtiene los parametros del "id" del BODY  
    database.users.forEach(user => {              // Loop en los usuarios al entrar
        if (user.id === id) {
            user.entries++;                       // Si existe, se aumenta el conteo de ingresos
            return res.json(user.entries);        // Devolvemos las entradas del user
        } 
    })
    res.status(404).json('no such user');           // Si no existe, 404.
});


// ----------------------------------------------------------------
// Extraido de la página de bcrypt-nodejs para hacer hash en las passwords.

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

// ----------------------------------------------------------------

app.listen(3001, () => {
   console.log('app is running on port 3000');
});
