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
    res.send(database.users);
});

// SIGN IN POST
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
        console.log(data[0])
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);    // if true
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('Unable to get user'))
        } else {
          res.status(400).json('Wrong credentials');
        }
      }) 
      .catch(err => res.status(400).json('Wrong credentials'))         
});

// REGISTER POST
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;     // Obtenemos la data del body
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into("login")
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')  
                .insert({
                    email: loginEmail[0],
                    name: name,   
                    joined: new Date()         
                })
                .then(user => {
                    res.json(user[0]); 
                })                
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })    
    .catch(err => res.status(400).json('unable to register'));
});

// PROFILE GET
app.get('/profile/:id', (req, res) => {
    const { id } = req.params                       // Obtiene los parametros del "id" desde el URL.    
    
    db.select('*').from('users').where({id: id})
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not Found')
            }
        })
        .catch(err => res.status(400).json('Error getting user'))    
});

// IMAGE PUT
app.put('/image', (req, res) => {
    const { id } = req.body                       // Obtiene los parametros del "id" del BODY  
    
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json('Unable to get entries'))
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

app.listen(3001, () => {
   console.log('app is running on port 3001');
});
