const express = require('express')
const router = express.Router()
const {authorize} = require('../core/Auth')
const ROLES = require('../core/Role')


const {signup, signin, confirmEmail, isValidToken} = require('../controllers/AuthController')
const {addVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle} = require('../controllers/VehicleController')
const {getUser, updateUser, forgotPassword, newPassword} = require('../controllers/UserController')
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
const {
    getWorkshops,
    addWorkshop,
    deleteWorkshop,
    getMyWorkshop,
    editWorkshop,
    getEmployees,
    addEmployee,
    deleteEmployee,
    getVehicleByVin,
    addServiceEntry
} = require('../controllers/WorkshopController')


//AuthController
router.post('/signup', signup)
router.post('/signin', signin)
router.get('/emailConfirmation/:token', confirmEmail)
router.get('/isValidToken/:token', isValidToken)
router.get('/isLoggedIn', authorize(ROLES.User), (req, res) => {
    res.status(200).json({message: 'ok', data: {}})
})

//UserController
router.get('/getUserData', authorize(ROLES.User), getUser)
router.put('/updateUser', authorize(ROLES.User), updateUser)
router.post('/forgotPassword', forgotPassword)
router.post('/newPassword', newPassword)

//VehicleParameterController
router.post('/getManufactures', authorize(ROLES.User), getManufactures)
router.post('/getCategories', authorize(ROLES.User), getCategories)
router.post('/getModels', authorize(ROLES.User), getModels)
router.post('/getFuels', authorize(ROLES.User), getFuels)
router.post('/getDesignTypes', authorize(ROLES.User), getDesignTypes)
router.post('/getDriveTypes', authorize(ROLES.User), getDriveType)
router.post('/getTransmissions', authorize(ROLES.User), getTransmissions)
router.post('/addCategory', authorize(ROLES.Admin), addCategory)
router.post('/addManufacture', authorize(ROLES.Admin), addManufacture)
router.post('/addModel', authorize(ROLES.Admin), addModel)
router.post('/addFuel', authorize(ROLES.Admin), addFuel)
router.post('/addDesignType', authorize(ROLES.Admin), addDesignType)
router.post('/addDriveType', authorize(ROLES.Admin), addDriveType)
router.post('/addTransmission', authorize(ROLES.Admin), addTransmission)

//VehicleController
router.post('/addVehicle', authorize(ROLES.User), addVehicle)
router.get('/getVehicles', authorize(ROLES.User), getVehicles)
router.get('/getVehicle/:id', authorize(ROLES.User), getVehicle)
router.put('/updateVehicle/:id', authorize(ROLES.User), updateVehicle)
router.delete('/deleteVehicle/:id', authorize(ROLES.User), deleteVehicle)

//WorkshopController
router.get('/getWorkshops', authorize(ROLES.Admin), getWorkshops)
router.post('/addNewWorkshop', authorize(ROLES.Admin), addWorkshop)
router.delete('/deleteWorkshop/:id', authorize(ROLES.Admin), deleteWorkshop)
router.get('/getMyWorkshop', authorize(ROLES.Owner), getMyWorkshop)
router.put('/editWorkshop', authorize(ROLES.Owner), editWorkshop)
router.get('/getEmployees', authorize(ROLES.Owner), getEmployees)
router.post('/addEmployee', authorize(ROLES.Owner), addEmployee)
router.delete('/deleteEmployee/:id', authorize(ROLES.Owner), deleteEmployee)
router.get('/getVehicleByVin/:vin', authorize(ROLES.Owner, ROLES.Employee), getVehicleByVin)
router.post('/addServiceEntry', authorize(ROLES.Owner, ROLES.Employee), addServiceEntry)

//404 API Request
router.get('*', (req, res) => {
    res.status(404).json({message: "Not Found"})
})


module.exports = router