const express = require('express')
const router = express.Router()

const { signup, signin } = require('../controllers/AuthController')
const { addNewVehicle } = require('../controllers/VehicleController')
const { getUser, updateUser } = require('../controllers/UserController')
const { authenticateToken, authenticateAdmin, authenticateWorkshop } = require('../core/Auth')

/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     tags:
 *         - Authentication
 *     summary: Felhasználó regisztrálása.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *                 description: Keresztnév
 *                 example: Erik
 *               lname:
 *                 type: string
 *                 description: Vezetéknév
 *                 example: Tóth
 *               email:
 *                 type: string
 *                 description: Email
 *                 example: pelda@email.com
 *               password:
 *                 type: string
 *                 description: Jelszó
 *                 example: 
 *               phone:
 *                 type: string
 *                 description: Telefonszám
 *                 example: +36322211222
 *     responses:
 *       201:
 *         description: Felhasználó sikeresen létrejött
 *       409:
 *         description: Létező felhasználó
 *       400:
 *         description: Hiányos adat
*/
router.post('/signup', signup)
/**
 * @swagger
 * /api/v1/signin:
 *   post:
 *     tags:
 *      - Authentication
 *     summary: Felhasználó bejelentkeztetése.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email
 *                 example: pelda@email.com
 *               password:
 *                 type: string
 *                 description: Jelszó
 *                 example:  
 *     responses:
 *       200:
 *         description: Sikeres bejelentkezés
 *       400:
 *         description: Sikertelen bejelentkezés
 *       403:
 *         description: Nincs aktiválva
*/
router.post('/signin', signin)
router.get('/isLoggedIn', authenticateToken, (req, res) => { res.status(200).json({ message: 'ok', data: {} }) })


/**
 * @swagger
 * /api/v1/getUserData:
 *   get:
 *     tags:
 *      - Users
 *     summary: Felhasználó adatok lekérése.
 *     header:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               x-access-token:
 *                 type: string
 *                 description: Email
 *                 example: pelda@email.com 
 *     responses:
 *       200:
 *         description: Felhasználó adatai
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Nincs hitelesítve
*/
router.get('/getUserData', authenticateToken, getUser)
router.put('/updateUser', authenticateToken, updateUser)
router.post('/addNewVehicle', authenticateToken, addNewVehicle)

module.exports = router