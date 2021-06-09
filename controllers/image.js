// Image function sacada del "server.js" para ocupar menos espacio allá.

const handleImage = (req, res, db) => {
    const { id } = req.body                       // Obtiene los parametros del "id" del BODY  
    
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json('Unable to get entries'))
}

export default handleImage;