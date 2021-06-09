// Signin function sacada del "server.js" para ocupar menos espacio allá.

const handleSignIn = (req, res, db, bcrypt) => {
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
}

// module.exports = {
//     handleSignIn: handleSignIn
// }

export default handleSignIn;