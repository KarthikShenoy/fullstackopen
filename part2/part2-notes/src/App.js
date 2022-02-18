import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
    noteService
      .getAll()
      .then(intialNotes => {
        setNotes(intialNotes)
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      import: Math.random() < 0.5,
    }
    noteService.create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  useEffect(hook, [])

  const toggleImportance = (id) => {
    console.log(`importance of  ${id} needs to be toggled`);
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    console.log(`Posting ${changedNote.important} `);
    noteService.update(id, changedNote)
      .then(returnedNote => {
        console.log("Posted data")
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      }).catch(error => {
        alert(
          `the note '${note.content}' was already deleted from server.`
        )
        setNotes(notes.filter(n => n.id!==id))
      })
  }
  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input text="Add a new note" value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App


