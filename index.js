
const express = require('express')
const morgan = require('morgan')


const app = express()

app.use(express.json())


morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [

    {id: "1", name: "Arto Hellas", nuber: "040-123456"},
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]


app.get('/api/person', (req, res) => {

    res.json(persons)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> {

    console.log(`Server is runing on port ${PORT}`)
})

app.get('/api/info', (req, res)=> {

    const count = persons.length
    const time = new Date()

    res.send(`
        
        <p> Phonebook has info for ${count} people </p>
        <p>${time}</p>

        `)

})

app.get('/api/persons/:id', (req, res) => {

    const id = req.params.id
    const person = persons.find(p => p.id === id)


    if (person) {

        res.json(person)
    } else {
        res.status(404).end()
    }

})

app.delete('/api/persons/:id', (req, res) => {

    const id = req.params.id
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()


})


app.post('/api/persons', (req, res) => {

    const body = req.body

    if (!body.name){

        return res.status(400).json({error: 'name missing'})
    }

    if (!body.number){

        return res.status(400).json({error: 'number missing'})
    }

    const nameExists = persons.some (p => p.name === body.name) 
    
    if (nameExists){

        return res.status(400).json({error: 'name must be unique'})
    }

    const person = {

        id: String(Math.floor(Math.random() * 1000000)),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

