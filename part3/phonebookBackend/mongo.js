const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Usage node mongo.js <password> <username> <phonenumber>')
    process.exit(1)
}

const password = process.argv[2]
const username = process.argv[3]
const phNumber = process.argv[4]

const url = `mongodb://scott:${password}@localhost/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose
    .connect(url)
    .then((result) => {
        if (username !== undefined || phNumber !== undefined) {
            const person = new Person({
                name: username,
                number: phNumber
            })
            console.log(`Added ${username} number ${phNumber} to phonebook`)
            person.save().then(() =>
                mongoose.connection.close())
        } else {
            // console.log('phonebook:')
            Person.find({}).then(results => {
                results.forEach(result => {
                    console.log(result)
                })
            }).then(() =>
                mongoose.connection.close())
        }
    })
    .catch((err) => {
        console.log(err)
    })