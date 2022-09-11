require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

const password = process.env.MONGO_PASSWORD

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

const requestLogger = (request, response, next)=>{
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())
// // handler of requests with unknown endpoint

app.get('/', (request, response) => {
  response.send(
    '<h1>Hello World!</h1>'
  )
})
app.get('/api/notes/', (request, response) => {
  Note.find({}).then((res)=>{
    response.json(res)
  })
})
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
  .then(note =>{
    if(note){
      response.json(note)
    }
    else{
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
  return maxId + 1
}
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  note.save().then(savedNote =>{
    response.json(savedNote)
  })
})
const errorHandler = (error, request, response, next) => {
  console.error(`from error handler ${error.message}`);
  if(error.name === 'CastError' || error.name === 'BSONTypeError') {
    return response.status(400).send({error: 'malformatted id'})
  }
  next(error)
}
app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})