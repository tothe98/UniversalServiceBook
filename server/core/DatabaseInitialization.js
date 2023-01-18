const mongoose = require('mongoose')
require('../models/DesignTypeModel')
require('../models/DriveTypeModel')
require('../models/FuelModel')
require('../models/ManufactureModel')
require('../models/ModelModel')
require('../models/PictureModel')
require('../models/ServiceEntryModel')
require('../models/TransmissionModel')
require('../models/UserModel')
require('../models/VehicleModel')
require('../models/VehicleTypeModel')
require('../models/WorkShopModel')


const DesignTypes = mongoose.model('DesignTypes')
const DriveTypes = mongoose.model('DriveTypes')
const Fuels = mongoose.model('Fuels')
const Manufactures = mongoose.model('Manufactures')
const Models = mongoose.model('Models')
const Pictures = mongoose.model('Pictures')
const ServiceEntries = mongoose.model('ServiceEntries')
const Transmissions = mongoose.model('Transmissions')
const Users = mongoose.model('UserInfo')
const Vehicles = mongoose.model('Vehicles')
const VehicleTypes = mongoose.model('VehicleTypes')
const Workshops = mongoose.model('WorkShops')

module.exports = {
    DesignTypes,
    DriveTypes,
    Fuels,
    Manufactures,
    Models,
    Pictures,
    ServiceEntries,
    Transmissions,
    Users,
    Vehicles,
    VehicleTypes,
    Workshops
}