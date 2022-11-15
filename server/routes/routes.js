const express = require('express')
const router = express.Router()

const { signup, signin } = require('../controllers/AuthController')
const { addNewVehicle } = require('../controllers/VehicleController')
const { authenticateToken, authenticateAdmin, authenticateWorkshop } = require('../core/Auth')

router.get('/', (req, res) => {
    res.status(200).json(
        {
            API: [
                {
                    name: 'SignUp',
                    url: '/api/singup',
                    method: 'POST',
                    dataType: 'body',
                    datas: 'fname, lname, username, email, password',
                    isRequiredAuth: false,
                },
                {
                    name: 'SignIn',
                    url: '/api/singin',
                    method: 'POST',
                    dataType: 'body',
                    datas: 'username, password',
                    isRequiredAuth: false,
                },
            ]
        }
    )
})
/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     summary: Felhasználó regisztrálása
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *                 description: Felhasználó keresztneve.
 *                 example: Erik
 *               lname:
 *                  type: string
 *                  description: Felhasználó vezetékneve.
 *                  example: Molnár
 *               email:
 *                  type: string
 *                  description: Felhasználó email címe.
 *                  example: erik.molnar@gmail.com
 *               password:
 *                  type: string
 *                  description: Felhasználó jelszava.
 *     responses:
 *       201:
 *         'Sikeres regisztráció'
*/
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/addNewVehicle', authenticateToken, addNewVehicle)

module.exports = router