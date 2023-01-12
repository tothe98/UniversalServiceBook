const mongoose = require('mongoose')
require('../models/DesignTypeModel')
require('../models/DriveTypeModel')
require('../models/FuelModel')
require('../models/ManufactureModel')
require('../models/ModelModel')
require('../models/TransmissionModel')
require('../models/VehicleTypeModel')
require('../models/VehicleModel')
require('../models/ServiceEntryModel')

const fs = require("fs")
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads/' + req.userId + '/')) {
            fs.mkdirSync('uploads/' + req.userId + '/')
        }
        cb(null, 'uploads/' + req.userId + '/')
    },
    filename: function (req, file, cb) {
        cb(null, require('crypto').createHash('md5').update(new Date().toISOString() + file.originalname).digest("hex") + "." + file.mimetype.split("/")[1]);
    },
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).fields([
    {
        name: "picture",
        maxCount: 10
    },
    {
        name: "preview",
        maxCount: 1
    }
])

exports.addVehicle = (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'LimitFileCount', data: { error: err } })
        }

        if (!req.files) {
            return res.status(400).json({ message: 'PictureIsEmpty', data: { error: err } })
        }

        const {
            manufacture,
            model,
            fuel,
            driveType,
            designType,
            transmission,
            licenseNumber,
            vin,
            vintage,
            ownMass,
            fullMass,
            cylinderCapacity,
            performance,
            mot,
            nod,
            mileage
        } = req.body

        if (!manufacture) {
            return res.status(422).json({ message: 'ManufactureIsEmpty', data: {} })
        }
        if (!model) {
            return res.status(422).json({ message: 'ModelIsEmpty', data: {} })
        }
        if (!fuel) {
            return res.status(422).json({ message: 'FuelIsEmpty', data: {} })
        }
        if (!driveType) {
            return res.status(422).json({ message: 'DriveTypeIsEmpty', data: {} })
        }
        if (!designType) {
            return res.status(422).json({ message: 'DesignTypeIsEmpty', data: {} })
        }
        if (!transmission) {
            return res.status(422).json({ message: 'TransmissionIsEmpty', data: {} })
        }
        if (!vin) {
            return res.status(422).json({ message: 'VinIsEmpty', data: {} })
        }
        if (!vintage) {
            return res.status(422).json({ message: 'VintageIsEmpty', data: {} })
        }
        if (!ownMass) {
            return res.status(422).json({ message: 'OwnMassIsEmpty', data: {} })
        }
        if (!fullMass) {
            return res.status(422).json({ message: 'FullMassIsEmpty', data: {} })
        }
        if (!cylinderCapacity) {
            return res.status(422).json({ message: 'CylinderCapacityIsEmpty', data: {} })
        }
        if (!performance) {
            return res.status(422).json({ message: 'PerformanceIsEmpty', data: {} })
        }
        if (!nod) {
            return res.status(422).json({ message: 'NodIsEmpty', data: {} })
        }
        if (!mileage) {
            return res.status(422).json({ message: 'MilageIsEmpty', data: {} })
        }

        const fileName = req.files['picture'].map(picture => picture.filename + "@")
        
        const Vehicles = mongoose.model('Vehicles')
        const Pictures = mongoose.model('Pictures')
        const Manufactures = mongoose.model('Manufactures')
        const Models = mongoose.model('Models')
        const Fuels = mongoose.model('Fuels')
        const DriveTypes = mongoose.model('DriveTypes')
        const DesignTypes = mongoose.model('DesignTypes')
        const Transmissions = mongoose.model('Transmissions')

        try {
            const isExistVin = await Vehicles.findOne({ vin: vin })
            if (isExistVin) {
                return res.status(409).json({ message: "VinIsExists", data: {} })
            }

            let uploadedImg = undefined
            let previewImg = undefined
            await Pictures.create({
                picture: fileName,
                _uploadFrom: req.userId
            }).then((e) => {
                uploadedImg = e["_id"].toString()
            }).catch((err) => {
                return res.status(400).json({ message: 'error', data: { error: err } })
            })
            await Pictures.create({
                picture: req.files.preview[0].path,
                _uploadFrom: req.userId
            }).then((e) => {
                previewImg = e["_id"].toString()
            }).catch((err) => {
                return res.status(400).json({ message: 'error', data: { error: err } })
            })

            if (uploadedImg === undefined || previewImg === undefined) {
                return res.status(400).json({ message: 'error', data: {} })
            }

            const isExistManufacture = await Manufactures.findOne({ _id: manufacture })
            if (!isExistManufacture) {
                return res.status(409).json({ message: "ManufactureIsNotExists", data: {} })
            }
            const isExistModel = await Models.findOne({ _id: model, _manufacture: manufacture })
            if (!isExistModel) {
                return res.status(409).json({ message: "ModelIsNotExists", data: {} })
            }
            const isExistFuel = await Fuels.findOne({ _id: fuel })
            if (!isExistFuel) {
                return res.status(409).json({ message: "FuelIsNotExists", data: {} })
            }
            const isExistDriveType = await DriveTypes.findOne({ _id: driveType })
            if (!isExistDriveType) {
                return res.status(409).json({ message: "DriveTypeIsNotExists", data: {} })
            }
            const isExistDesignType = await DesignTypes.findOne({ _id: designType })
            if (!isExistDesignType) {
                return res.status(409).json({ message: "DesignTypeIsNotExists", data: {} })
            }
            const isExistTransmission = await Transmissions.findOne({ _id: transmission })
            if (!isExistTransmission) {
                return res.status(409).json({ message: "TransmissionIsNotExists", data: {} })
            }

            const newVehicle = await Vehicles.create({
                _userId: req.userId,
                _manufacture: manufacture,
                _model: model,
                _fuel: fuel,
                _driveType: driveType,
                _designType: designType,
                _transmission: transmission,
                licenseNumber,
                vin: vin,
                vintage: vintage,
                ownMass: ownMass,
                fullMass: fullMass,
                cylinderCapacity: cylinderCapacity,
                performance: performance,
                mot,
                nod: nod,
                mileage: mileage,
                pictures: uploadedImg,
                preview: previewImg
            })
            return res.status(200).json({ message: '', data: { vehicle: newVehicle } })
        } catch (err) {
            return res.status(400).json({ message: "", data: { err } })
        }
    })
}

exports.getVehicles = async (req, res) => {
    try {
        const Vehicles = mongoose.model("Vehicles")
        const resFromDB = await Vehicles.find({ _userId: req.userId, isActive: true })
            .populate('_manufacture')
            .populate('_model')
            .populate('_fuel')
            .populate('_driveType')
            .populate('_designType')
            .populate('_transmission')
            .populate('pictures')
            .populate('preview')

        let responseData = []
        resFromDB.forEach((vehicle) => {
            responseData.push(vehicle.getVehicleData)
        })

        return res.status(200).json({ message: '', data: { vehicles: responseData } })
    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}

exports.getVehicle = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(409).json({ message: "IdIsNotExists", data: {} })
        }
        const Vehicles = mongoose.model("Vehicles")
        const ServiceEntires = mongoose.model("ServiceEntries")

        const isExist = Vehicles.findOne({ _id: id, _userId: req.userId })
        if (!isExist) {
            return res.status(409).json({ message: "VehicleIsNotExists", data: {} })
        }

        const resFromDB = await Vehicles.findOne({ _userId: req.userId, _id: id })
            .populate('_manufacture')
            .populate('_model')
            .populate('_fuel')
            .populate('_driveType')
            .populate('_designType')
            .populate('_transmission')
            .populate('pictures')
            .populate('preview')



        const resFromDBServices = await ServiceEntires.find({ _vehicle: id, isDelete: false })
            .populate("_vehicle")
            .populate("_workshop")
            .populate("pictures")
            .populate('_mechanicer')
            .getServices

        return res.status(200).json({ message: '', data: { vehicle: resFromDB.getVehicleDataById, serviceEntries: resFromDBServices || [] } })
    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}

exports.updateVehicle = async (req, res) => {
    const {
        id,
        cylinderCapacity,
        ownMass,
        fullMass,
        performance,
        nod,
        licenseNumber,
        mot
    } = req.body

    if (!id) {
        return res.status(422).json({ message: 'IDIsEmpty', data: {} })
    }
    if (!cylinderCapacity) {
        return res.status(422).json({ message: 'CylinderCapacityIsEmpty', data: {} })
    }
    if (!ownMass) {
        return res.status(422).json({ message: 'OwnMassIsEmpty', data: {} })
    }
    if (!fullMass) {
        return res.status(422).json({ message: 'FullMassIsEmpty', data: {} })
    }
    if (!performance) {
        return res.status(422).json({ message: 'PerformanceIsEmpty', data: {} })
    }
    if (!nod) {
        return res.status(422).json({ message: 'NodIsEmpty', data: {} })
    }

    //TODO



}



