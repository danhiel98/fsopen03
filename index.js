const express = require('express')

const app = express()

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response
        .send(`
            <p>Phonebook has info for ${persons.length} people
            <p>${date.toString()}</p>
        `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find(p => p.id === id)

    if (!person) {
        response.statusMessage = "The person was not found"
        response.status(404).end()
    }
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const { name, number } = body

    if (!(name && number)) {
        return serverError(response,
            { code: 400, error: 'name and number are required' }
        )
    }

    if (existsPerson(name)) {
        return serverError(response,
            { code: 400, error: 'the person already exists' }
        )
    }

    const person = {
        name,
        number,
        id: getId()
    }

    persons = persons.concat(person)

    response.status(201).json({ person })
})

const serverError = (response, data) => {
    response.status(data.code).json(data)
}

const getId = () => {
    return Math.floor(Math.random() * 1000)
}

const existsPerson = (name) => {
    return persons.
        find(p => p.name.toLowerCase() === name.toLowerCase())
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`app listen in port ${PORT}`)
})