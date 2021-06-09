// Profile function sacada del "server.js" para ocupar menos espacio allá.

const handleProfile = (req, res, db) => {
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
}

export default handleProfile;