require('dotenv').config()
const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.status(200).send("Szia")
})

app.listen(process.env.PORT, () => { console.log(`Szerver elindult a ${process.env.PORT}-as porton.`) })