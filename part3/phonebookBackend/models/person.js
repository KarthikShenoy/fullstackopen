const mongoose = require('mongoose')

const url = process.env.MONGODB_CONNECT_STRING

console.log(`Connecting to ${url}`)

mongoose
    .connect(url)
    .then((result) => {
        console.log(`Connected to MongoDB`)
    })
    .catch((err) => {
        console.log(`Error connecting to MongoDB`, err.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
personSchema.set('toJSON',{
    transform:(doc, retDoc)=>{
        retDoc.id=retDoc._id.toString()
        delete retDoc._id
        delete retDoc.__v
    }
})
module.exports = mongoose.model('Person', personSchema)

