const express = require('express')
const router = express.Router()

const { signup } = require('../controllers/AuthController')

router.get('/sigup', signup)


module.exports = router