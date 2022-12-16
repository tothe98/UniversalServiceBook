const express = require('express')
const router = express.Router()


const { signup, signin, confirmEmail, isValidToken } = require('../controllers/AuthController')
const { addVehicle, getVehicles, getVehicle, updateVehicle } = require('../controllers/VehicleController')
const { getUser, updateUser, forgotPassword, newPassword } = require('../controllers/UserController')
const { authenticateToken, authenticateAdmin, authenticateWorkshop } = require('../core/Auth')
const {
    getManufactures,
    getCategories,
    getModels,
    addCategory,
    addManufacture,
    addModel,
    getFuels,
    addFuel,
    addDesignType,
    getDesignTypes,
    addDriveType,
    getDriveType,
    addTransmission,
    getTransmissions
} = require('../controllers/VehicleParameterController')

//AuthController
router.post('/signup', signup)
router.post('/signin', signin)
router.get('/emailConfirmation/:token', confirmEmail)
router.get('/isValidToken/:token', isValidToken)
router.get('/isLoggedIn', authenticateToken, (req, res) => { res.status(200).json({ message: 'ok', data: {} }) })

//UserController
router.get('/getUserData', authenticateToken, getUser)
router.put('/updateUser', authenticateToken, updateUser)
router.post('/forgotPassword', forgotPassword)
router.post('/newPassword', newPassword)

//VehicleParameterController
router.post('/getManufactures', authenticateToken, getManufactures)
router.post('/getCategories', authenticateToken, getCategories)
router.post('/getModels', authenticateToken, getModels)
router.post('/getFuels', authenticateToken, getFuels)
router.post('/getDesignTypes', authenticateToken, getDesignTypes)
router.post('/getDriveTypes', authenticateToken, getDriveType)
router.post('/getTransmissions', authenticateToken, getTransmissions)
router.post('/addCategory', authenticateAdmin, addCategory)
router.post('/addManufacture', authenticateAdmin, addManufacture)
router.post('/addModel', authenticateAdmin, addModel)
router.post('/addFuel', authenticateAdmin, addFuel)
router.post('/addDesignType', authenticateAdmin, addDesignType)
router.post('/addDriveType', authenticateAdmin, addDriveType)
router.post('/addTransmission', authenticateAdmin, addTransmission)

//VehicleController
router.post('/addVehicle', authenticateToken, addVehicle)
router.get('/getVehicles', authenticateToken, getVehicles)
router.get('/getVehicle/:id', authenticateToken, getVehicle)
router.put('/updateVehicle', authenticateToken, updateVehicle)

//404 API Request
router.get('*', (req, res) => {
    res.status(404).json({ message: "Not Found" })
})


module.exports = router