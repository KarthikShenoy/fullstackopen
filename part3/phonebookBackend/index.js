const express = require('express')
const app = express()
const morgan = require('morgan')


const morganTiny = morgan('tiny');

const requestLogger = (request, response, next) =>{
  console.log(`Method: ${request.method}`);
  console.log(`Path: ${request.path}`);
  console.log(`Body: ${request.body}`);
  console.log('---');
  next();
}
const unknownEndpoint = (request, response)=>{
  response.status(404).send({error:'unknown endpoint'});
}
app.use(express.json());
app.use(requestLogger);
app.use(morganTiny);

const PORT = 3001
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
const getCurrentEntries = () => {
  return persons.length;
}
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/info', (request, response) => {
  const numEntries = getCurrentEntries()
  const date = new Date()
  response
    .status(200)
    .write(`Phonebook has info for ${numEntries} people\n${date}`)
  response.end()
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
const generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
}
app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Both Name and number are mandatory'
    })
  }
  if(persons.find(val => val.name==body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  response.json(person)
})
app.use(unknownEndpoint);
app.listen(PORT)
console.log(`Phonebook backend listening on ${PORT}`)