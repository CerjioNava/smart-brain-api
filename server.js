// API PARA SMART BRAIN

import express from 'express';

const app = express();
app.use(express.json());        // Middleware para poder interpretar el JSON del body.

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
    ]

}

// ----------------------------------------------------------------
// Functionality

// HOME PASE GET
app.get('/', (req, res) => {
    // res.send('This is working');
    res.send(database.users);
});

// SIGN IN POST
app.post('/signin', (req, res) => {
    // res.send('signin');
    //res.json('signin');
    if (req.body.email === database.users[0].email &&           // Comparamos usuario
        req.body.password === database.users[0].password) {
        res.json("success");
    } else {
        res.status(400).json("error logging in");
    }
});

// REGISTER POST
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;     // Obtenemos la data del body
    database.users.push({                           // Añadimos a la base de datos con el body
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()        
    });
    res.json(database.users[database.users.length-1]);     // Devolvemos un response con el nuevo
});

// PROFILE GET
app.get('/profile/:id', (req, res) => {
    const { id } = req.params                       // Obtiene los parametros del "id" del URL.    
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

app.listen(3000, () => {
   console.log('app is running on port 3000');
});
