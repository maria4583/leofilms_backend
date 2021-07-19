const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')

const usersRouter = require('./routes/users')
const moviesRouter = require('./routes/movies')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use('/', express.static(path.resolve(__dirname, 'static')))

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/users', usersRouter)
app.use('/api/movies', moviesRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        })

        app.listen(PORT, () => {
            console.log(`Starting development server on port ${PORT}`)
        })
    } catch (error) {
        console.log(`Server Error ${error.message}`)
    }
}

start()
