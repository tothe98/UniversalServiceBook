require('dotenv').config({path: './config/.env'})
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const routesUrls = require('./routes/routes')
const {logger} = require("./config/logger");

const app = express()
app.use(express.json({limit: '100mb'}))
app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'PATH', 'DELETE'],
        credentials: true
    })
)
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}))
app.use('/uploads', express.static('uploads'))
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
app.use('/api/v1', routesUrls)

mongoose.connect(
    process.env.MONGODB, {
        useNewUrlParser: true,
    })
    .then(() => {
        logger.info('[DATABASE]:Adatbázis kapcsolat létrejött.', {user: 'System', data: ""})
        console.log('[DATABASE]:Adatbázis kapcsolat létrejött.')
        app.listen(process.env.PORT || 5000, () => {
            logger.info(`[SERVER]:Szerver elindult a ${process.env.PORT || 5000}-as porton.`, {
                user: 'System',
                data: ""
            })
            console.log(`[SERVER]:Szerver elindult a ${process.env.PORT || 5000}-as porton.`)
        })
    })
    .catch((e) => {
        logger.error('Nem sikerült csatlakozni az adatbázishoz.', {user: 'System', data: JSON.stringify(e)})
        console.log(e);
    })

