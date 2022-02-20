import React, { useState, useEffect } from 'react'
import phonebook from './services/phonebook'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [filteredPeople, setFilteredPeople] = useState(persons)
  const [message, setMessage] = useState(null)
  const [isSuccess, setSuccess] = useState(true)

  const showMessage =(message, isError)=> {
    setSuccess(isError)
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }
  const personHook = () => {
    phonebook.getAll().then(response => {
      setPersons(response)
      setFilteredPeople(response)
    })
  }
  
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
    if (existingPerson !== undefined && existingPerson.length > 0) {
      if (window.confirm(`${newName} is already added to phonebook replace the old number with a new one?`)) {
        phonebook.update({ ...newPerson, id: existingPerson[0].id }).then(response => {
          personHook()
          setNameSearch('')
          setNewName('')
          setNewNumber('')
          showMessage(`Updated ${newName}`, true)
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
      showMessage(`Added ${newName}`, true)
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
      }).catch(error => {
        showMessage(`Information of ${name} has already been removed from server`, false)
        personHook()
        setNameSearch('')
      })
    }
  }
  useEffect(personHook, [])
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isSuccess={isSuccess} />
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


