const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// ⚠️ Change YOUR_USERNAME and YOUR_CLUSTER_URL to match your Atlas URI
const url = `mongodb+srv://fullstack:${password}@cluster0.3yzf4z3.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

// Connect (family:4 helps with Atlas IPv4 requirement)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// If only password is given -> list all
if (process.argv.length === 3) {
  console.log('phonebook:')

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

} else {
  // If name and number provided -> add new
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
