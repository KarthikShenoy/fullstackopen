import React from 'react'

const Note = ({ key,note }) => {
  console.log("Key", key, "note",note)
  return (
    <li key={key}>{note}</li>
  )
}

export default Note