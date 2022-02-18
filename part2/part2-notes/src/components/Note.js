import React from 'react'

const Note = ({ note, toggleImportance }) => {
  const lable = note.important
    ? 'make not important' : 'make important'
  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{lable}</button>
    </li>
  )
}

export default Note