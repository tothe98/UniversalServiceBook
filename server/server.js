require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const routesUrls = require('./routes/routes')

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: ['http://localhost:8080'],
        methods: ['GET', 'POST', 'PATH', 'DELETE'],
        credentials: true
    })
)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
    session({
        key: 'userId',
        secret: 'öZlŰaPew',
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24
        }
    })
)

mongoose
    .connect(process.env.MONGODB, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Adatbázis kapcsolat létrejött.");
    })
    .catch((e) => {
        console.log(e);
    })

app.use('/api', routesUrls)

app.get("/api", (req, res) => {
    res.status(200).json({ name: 'signin', url: '/api/signin', method: 'GET' })
})

app.listen(process.env.PORT, () => { console.log(`Szerver elindult a ${process.env.PORT}-as porton.`) })