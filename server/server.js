require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const routesUrls = require('./routes/routes')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


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

mongoose.connect(
    process.env.MONGODB, {
    useNewUrlParser: true,
})
    .then(() => {
        console.log("Adatbázis kapcsolat létrejött.");
    })
    .catch((e) => {
        console.log(e);
    })


const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            version: "1.0.0",
            title: "Universal ServiceBook Backend",
            description: "API Information",
            contact: {
                name: "Molnár Dániel & Tóth Erik"
            },
            servers: [`http://127.0.0.1:${process.env.PORT}/api/v1`]
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            }
        ]
    },
    // ['.routes/*.js']
    apis: ["routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.use('/api/v1', routesUrls)

app.listen(process.env.PORT || 5000, () => { console.log(`Szerver elindult a ${process.env.PORT || 5000}-as porton.`) })