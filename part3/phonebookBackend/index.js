require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => {
  const body = JSON.stringify(req.body);
  return body !== '{}' ? body : '';
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
});

const requestLogger = (request, response, next) => {
  console.log(`Method: ${request.method}`);
  console.log(`Path: ${request.path}`);
  console.log(`Body: ${request.body}`);
  console.log('---');
  next();
}

app.use(express.json());
app.use(requestLogger);
app.use(morgan38);
app.use(cors());
app.use(express.static('build'))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

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
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.sendStatus(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Both Name and number are mandatory'
    })
  }
  Person.find({ name: body.name }).then(result => {
    if (result.length>0) {
       return response.status(400).json({
        error: 'Name must be unique'
      })
    }
  }).then(res => {
    if (res == null) {
      const person = new Person({
        name: body.name,
        number: body.number
      })
      person.save().then(res => {
        console.log(`Added person ${person}`)
        response.json(person)
      })
    }
  })


})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})