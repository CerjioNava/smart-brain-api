// Image function sacada del "server.js" para ocupar menos espacio allá.
import Clarifai from 'clarifai';
import { response } from 'express';

const app = new Clarifai.App({
    apiKey: process.env.API_KEY,    
  });

const handleAPIcall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('unable to work with api'))

}

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

export { handleImage, handleAPIcall };