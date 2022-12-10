const express = require('express')
const router = express.Router()

const { signup, signin } = require('../controllers/AuthController')
const { addNewVehicle } = require('../controllers/VehicleController')
const { getUser, updateUser } = require('../controllers/UserController')
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
router.get('/isLoggedIn', authenticateToken, (req, res) => { res.status(200).json({ message: 'ok', data: {} }) })

//UserController
router.get('/getUserData', authenticateToken, getUser)
router.put('/updateUser', authenticateToken, updateUser)
router.post('/addNewVehicle', authenticateToken, addNewVehicle)

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


module.exports = router