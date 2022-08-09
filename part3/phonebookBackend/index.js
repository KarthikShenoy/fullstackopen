const express = require('express')
const app = express()
app.use(express.json())

const PORT = 3001
const persons = [
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
const getCurrentEntries =() =>{
  return persons.length;
}
app.get('/api/persons', (request, response)=>{
    console.log('Non parameterized get')
    response.json(persons)
})
app.get('/info', (request, response)=>{
  const numEntries = getCurrentEntries()
  const date = new Date()
  console.log("In info api")
  response
  .status(200)
  .write(`Phonebook has info for ${numEntries} people\n${date}`)
  response.end()
})
app.get('/api/persons/:id', (request, response)=>{
  console.log("Parameterized get")
  const id = Number(request.params.id)
  const person = persons.find(person=> person.id===id)
  if(person){
    response.json(person)
  }else{
    response.status(404).end()
  }
})
app.listen(PORT)
console.log(`Phonebook backend listening on ${PORT}`)