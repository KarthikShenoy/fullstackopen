const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <passord>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://scott:${password}@localhost/notes-app?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected')
    Note.find({ important: true }).then(result => {
      result.forEach(note => {
        console.log(note)
      })
    })
  })
  .then(() => {
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))