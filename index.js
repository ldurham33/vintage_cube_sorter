require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
const User = require('./user')
/*const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    cards: Array,
    indx: Number,
    sort_index: Number
}
)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})*/
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({
    extended: true,
    limit:'50mb'
}))
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))
morgan.token('data', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.get('/', (request, response) => {
    return response.send('<h1>Hello World!</h1>')
})
/*if (process.argv.length > 3) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}*/
app.get('/api/users', (request, response) => {
    console.log('get all in backend')
    User.find({}).then(users => {
        return response.json(users)
    })
})
app.get('/api/users/:id', (request, response,next) => {
    User.findById(request.params.id).then(user => {
        return response.json(user)
    }).catch(error => next(error))
    return
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
app.put('/api/users/:id', (request, response,next) => {
    console.log('put has been called')
    const body = request.body
    
    const user = {
        name: body.name,
        cards: body.cards,
        indx1: body.indx1,
        indx2: body.indx2,
        sortArray: body.sortArray,
        sort_index: body.sort_index
    }
    console.log(request.params.id)
    User.findByIdAndUpdate(request.params.id, user, { new: true })
        .then(updatedUser => {
            return response.json(updatedUser)
        })
        .catch(error => next(error))
    return
})
app.delete('/api/users/:id', (request, response,next) => {
    User.findByIdAndRemove(request.params.id)
        .then(()=>{
            console.log('delete')
            return response.status(204).end()
        })
        .catch(error => next(error))
    return
})
app.post('/api/users', (request, response, next) => {
    console.log('post called')
    const body = request.body
    console.log(body)
    const user = new User ({
        name: body.name,
        cards: body.cards,
        sortArray: body.sortArray,
        sort_index: body.sort_index,
        indx1: body.indx1,
        indx2: body.indx2
    })
    console.log(user)
    user.save().then(() => {
        console.log('added', user.name, 'to database')
    }).catch(error => next(error))
    return response.json(user)
})
const unknownEndpoint = (request, response) => {
    console.log('unknown')
    return response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        console.log('cast')
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)