require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Note = require('./models/note')
const app = express()
app.use(cors())
app.use(express.json())

// let notes = [
//     {
//       "id": 1,
//       "content": "HTML is easy",
//       "important": false
//     },
//     {
//       "id": 2,
//       "content": "Browser can execute only JavaScript",
//       "important": false
//     },
//     {
//       "id": 3,
//       "content": "GET and POST are the most important methods of HTTP protocol",
//       "important": true
//     }
// ]

//middleware

const requestLogger = (request,response,next) => {
    console.log('method: ', request.method)
    console.log('path: ', request.path)
    console.log('body: ', request.body)
    console.log("---")
    next()
}

app.use(requestLogger)

const unknownEndpoint = (request,response) =>{
    response.status(404).send({
        error: "unknown endpoint"
    })
}

//error handler

const errorhandler = (error, request, response, next) => {
    console.error('my error handler',  error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }else if(error.name === 'validationError'){
        return response.status(400).send({error: error.message})
    }

    next(error)
}
// se carga este middleware after everything else

app.use(express.static('dist'))

//--

// const autoGenerateId = () =>{
//     const higherId =  (notes.length >0)
//         ? Math.max(...notes.map(n => n.id))
//         : 0
//     return higherId + 1
// }

// app.get('/', (request,response) => {
//     response.send("<h1>Hello world</h1>")
// })

app.get('/api/notes', (request,response) => {
    Note.find({}).then(notes =>{
        //console.log(notes)
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request,response,next) =>{
    // const id = Number(request.params.id)
    // const note = notes.find(note => {
    //     //console.log('note', note.id, typeof note.id, 'param', id, typeof id)
    //     return note.id === id})
    // if(note){
    //     response.send(note)
    // }else{
    //     response.status(404).end()
    // }

    Note.findById(request.params.id).then(note => {
        if(note){
            response.json(note)
        }else{
            response.status(404).end()
        }
    }).catch(error => {
        // console.log(error)
        // response.status(400).send({error: 'malformatted id'})
        next(error)
    })
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if(!body.content){
        return response.status(400).json({
            error: 'missing content'
        })
    }

    const note = new Note({
        content: body.content,
        important: Boolean(body.important)||false,
    })

    note.save().then(savedNote =>{
        response.json(savedNote)
    }).catch(errror => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    const id = Number(request.params.id)
    // notes = notes.filter(note => note.id !== id)

    // response.status(204).end()
    Note.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(request.params.id, note, {
        new: true,
        runValidators: true,
        context: 'query'}
    )
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)

//use error handler
app.use(errorhandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`)
})