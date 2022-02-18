import React, { useState, useEffect } from 'react'
import phonebook from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [filteredPeople, setFilteredPeople] = useState(persons)


  const personHook = () => {
    phonebook.getAll().then(response => {
      setPersons(response)
      setFilteredPeople(response)
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
    const existingPerson = persons.filter(person => person.name === newName)
    if (existingPerson !== undefined && existingPerson.length>0) {
      if(window.confirm(`${newName} is already added to phonebook replace the old number with a new one?`)){
        phonebook.update({...newPerson,id:existingPerson[0].id}).then(response => {
          personHook()
          setNameSearch('')
          setNewName('')
          setNewNumber('')
        })
      }
      
      return;
    }

    phonebook.create(newPerson).then(response => {
      setPersons(persons.concat(response))
      setNewName('')
      setNewNumber('')
      setFilteredPeople((state) => {
        return filterPeople(state.concat(response), nameSearch)
      })
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
  const deleteUser = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      phonebook.deleteUser(id).then(response => {
        personHook()
        setNameSearch('')
      })
    } else {
      console.log(`User chose not to delete ${id}`);
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
      {filteredPeople.map(person =>
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deleteUser(person.id, person.name)}>Delete</button>
        </p>)}
    </div>
  )
}

export default App

const filterPeople = (persons, str) => {
  let searchStr = str.toLowerCase()
  return persons.filter(person => person.name.toLowerCase().includes(searchStr))
}
