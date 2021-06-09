// Register function sacada del "server.js" para ocupar menos espacio allá.

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;     // Obtenemos la data del body

    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }

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
}

// module.export = {
//     handleRegister: handleRegister
// }

export default handleRegister;