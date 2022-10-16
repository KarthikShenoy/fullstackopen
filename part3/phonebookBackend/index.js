require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => {
  const body = JSON.stringify(req.body)
  return body !== '{}' ? body : ''
})

const morgan38 = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
})

const requestLogger = (request, response, next) => {
  console.log(`Method: ${request.method}`)
  console.log(`Path: ${request.path}`)
  console.log(`Body: ${request.body}`)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
app.use(morgan38)
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(res => response.json(res))
})
app.get('/info', (request, response) => {
  Person.count().then((count) => {
    const date = new Date()
    response.json({
      code: `Phonebook has info for ${count} people\n${date}`
    })
  })

})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(result => {
      if (!result) {
        return response.status(404).end()
      }
      return response.json(result)
    })
    .catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    }).catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    }
    ).catch(error => next(error))
}
)
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  const person = new Person({
    name: name,
    number: number
  })
  person.save().then(res => {
    console.log(`Added person ${person}`)
    response.json(person)
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(`From error handler ${error.message}`)
  if (error.name === 'CastError' || error.name === 'BSONTypeError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})