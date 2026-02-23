
const express = require('express')
const morgan = require('morgan')

require('dotenv').config()
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))


morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// let persons = [

//     {id: "1", name: "Arto Hellas", nuber: "040-123456"},
//     { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
//     { id: "3", name: "Dan Abramov", number: "12-43-234345" },
//     { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
// ]


app.get('/api/persons', (req, res) => {


    Person.find({}).then(persons=> {

        res.json(persons)
    })
})





app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})


app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then(updatedPerson => {
        res.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})



app.post('/api/persons', (req, res, next  ) => {
    const body = req.body
  
    if (!body.name) {
      return res.status(400).json({ error: 'name missing' })
    }
  
    if (!body.number) {
      return res.status(400).json({ error: 'number missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      res.json(savedPerson)

    }).catch(error => next(error))
  })  
  const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
  const errorHandler = (error, req, res, next) => {
    console.error(error.name, error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  app.use(unknownEndpoint)
  app.use(errorHandler)
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, ()=> {

    console.log(`Server is runing on port ${PORT}`)
})
const path = require('path')

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
