import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [filteredPeople, setFilteredPeople] = useState(persons)

  
  const personHook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log("Got response ", response)
        setPersons(response.data)
        setFilteredPeople(response.data)
      })
  }
  useEffect(personHook, [])
  const handleNameUpdate = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberUpdate = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return;
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
    setFilteredPeople((state) => {
      let tmpState = state.concat(newPerson)
      return filterPeople(tmpState, nameSearch)
    })
  }
  const handleNameSearch = (event) => {
    setNameSearch(event.target.value)
    if (event.target.value !== '') {
      setFilteredPeople(filterPeople(persons, nameSearch))
    }
    else {
      setFilteredPeople(persons)
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        Filter shown with<input value={nameSearch} onChange={handleNameSearch} />
      </div>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameUpdate} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberUpdate} />
        </div>
        <div>
          <button type="submit" onClick={handleSubmit}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPeople.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default App

const filterPeople = (persons, str) => {
  let searchStr = str.toLowerCase()
  return persons.filter(person => person.name.toLowerCase().includes(searchStr))
}
