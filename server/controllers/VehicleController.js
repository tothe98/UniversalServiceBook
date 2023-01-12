const mongoose = require('mongoose')
const {uploadVehicle, deleteFiles} = require("../core/FilesManagment");
const multer = require('multer')
require('../models/DesignTypeModel')
require('../models/DriveTypeModel')
require('../models/FuelModel')
require('../models/ManufactureModel')
require('../models/ModelModel')
require('../models/TransmissionModel')
require('../models/VehicleTypeModel')
require('../models/VehicleModel')
require('../models/ServiceEntryModel')
require('../models/PictureModel')

exports.addVehicle = (req, res) => {
    uploadVehicle(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({message: 'LimitFileCount', data: {error: err}})
        }

        if (!req.files?.picture || !req.files?.preview) {
            return res.status(422).json({message: 'PictureIsEmpty', data: {error: err}})
        }
        const filesArray = req.files.picture

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

        if (!manufacture || !model || !fuel || !driveType ||
            !designType || !transmission || !vin || !vintage ||
            !ownMass || !fullMass || !cylinderCapacity || !performance || !nod || !mileage) {
            return res.status(422).json({message: 'AllFieldsMustBeFill', data: {}})
        }

        try {
            const fileName = req.files.picture.map(picture => picture.path.replaceAll('\\', '/')).join('@')
            const previewName = req.files.preview[0].path.replaceAll('\\', '/')
            const Vehicles = mongoose.model('Vehicles')
            const Pictures = mongoose.model('Pictures')
            const Manufactures = mongoose.model('Manufactures')
            const Models = mongoose.model('Models')
            const Fuels = mongoose.model('Fuels')
            const DriveTypes = mongoose.model('DriveTypes')
            const DesignTypes = mongoose.model('DesignTypes')
            const Transmissions = mongoose.model('Transmissions')

            const isExistVin = await Vehicles.findOne({vin: vin})
            if (isExistVin) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                return res.status(409).json({message: "VinIsExists", data: {}})
            }

            const isExistManufacture = await Manufactures.findOne({_id: manufacture})
            if (!isExistManufacture) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                return res.status(409).json({message: "ManufactureIsNotExists", data: {}})
            }
            const isExistModel = await Models.findOne({_id: model, _manufacture: manufacture})
            if (!isExistModel) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                return res.status(409).json({message: "ModelIsNotExists", data: {}})
            }
            const isExistFuel = await Fuels.findOne({_id: fuel})
            if (!isExistFuel) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                return res.status(409).json({message: "FuelIsNotExists", data: {}})
            }
            const isExistDriveType = await DriveTypes.findOne({_id: driveType})
            if (!isExistDriveType) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                return res.status(409).json({message: "DriveTypeIsNotExists", data: {}})
            }
            const isExistDesignType = await DesignTypes.findOne({_id: designType})
            if (!isExistDesignType) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                return res.status(409).json({message: "DesignTypeIsNotExists", data: {}})
            }
            const isExistTransmission = await Transmissions.findOne({_id: transmission})
            if (!isExistTransmission) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                return res.status(409).json({message: "TransmissionIsNotExists", data: {}})
            }
            let uploadedImg = undefined
            let previewImg = undefined

            const pictures = {
                picture: fileName,
                _uploadFrom: req.userId
            }
            const preview = {
                picture: previewName,
                _uploadFrom: req.userId
            }

            console.log("sad")
            const createPicture = new Pictures(pictures)
            const createPreview = new Pictures(preview)
            await createPicture.save()
            await createPreview.save()

            uploadedImg = createPicture._id
            previewImg = createPreview._id

            if (uploadedImg === undefined || previewImg === undefined) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                return res.status(400).json({message: 'error', data: {}})
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
            return res.status(201).json({message: '', data: {vehicle: newVehicle}})
        } catch (err) {
            deleteFiles(filesArray)
            deleteFiles(req.files?.preview)
            return res.status(400).json({message: "error", data: {err}})
        }
    })
}

exports.getVehicles = async (req, res) => {
    try {
        const Vehicles = mongoose.model("Vehicles")
        const resFromDB = await Vehicles.find({_userId: req.userId, isActive: true})
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

        return res.status(200).json({message: '', data: {vehicles: responseData}})
    } catch (err) {
        return res.status(400).json({message: 'error', data: {error: err}})
    }
}

exports.getVehicle = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) {
            return res.status(409).json({message: "IdIsNotExists", data: {}})
        }
        const Vehicles = mongoose.model("Vehicles")
        const ServiceEntires = mongoose.model("ServiceEntries")

        const isExist = Vehicles.findOne({_id: id, _userId: req.userId})
        if (!isExist) {
            return res.status(409).json({message: "VehicleIsNotExists", data: {}})
        }

        const resFromDB = await Vehicles.findOne({_userId: req.userId, _id: id})
            .populate('_manufacture')
            .populate('_model')
            .populate('_fuel')
            .populate('_driveType')
            .populate('_designType')
            .populate('_transmission')
            .populate('pictures')
            .populate('preview')

        const resFromDBServices = await ServiceEntires.find({_vehicle: id, isDelete: false})
            .populate("_workshop")
            .populate("pictures")
            .populate('_mechanicer')

        let responseData = []
        resFromDBServices.forEach((service) => {
            responseData.push(service.getServices)
        })

        return res.status(200).json({
            message: '', data: {vehicle: resFromDB.getVehicleDataById, serviceEntries: responseData || []}
        })
    } catch (err) {
        return res.status(400).json({message: 'error', data: {error: err}})
    }
}

exports.updateVehicle = async (req, res) => {
    uploadVehicle(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({message: 'LimitFileCount', data: {error: err}})
        }

        try {
            const {
                cylinderCapacity,
                ownMass,
                fullMass,
                performance,
                nod,
                licenseNumber,
                mot,
                deletedPictures
            } = req.body
            const {id} = req.params
            if (!id) {
                return res.status(422).json({message: 'IdIsEmpty', data: {}})
            }
            const Vehicles = mongoose.model('Vehicles')
            const vehicle = await Vehicles.findOne({
                _id: id,
                _userId: req.userId
            }).populate('pictures').populate('preview')
            if (!vehicle) {
                return res.status(404).json({message: 'VehicleNotFound', data: {}})
            }
            let currentPictures = vehicle.pictures?.picture.split('@')
            let currentPreview = vehicle.preview?.picture

            if (deletedPictures) {
                deletedPictures.split('@').forEach(deletedPicture => {
                    const indexAtCurrentPictures = currentPictures.indexOf(deletedPicture);
                    if (indexAtCurrentPictures > -1) {
                        currentPictures.splice(indexAtCurrentPictures, 1);
                    }
                    if (deletedPicture == currentPreview && req.files.preview) {
                        currentPreview = ""
                    }
                })
            }

            if (req.files) {
                req.files.picture?.forEach(picture => {
                    currentPictures.push(picture.path.replaceAll('\\', '/'))
                })
                if (req.files.preview) {
                    currentPreview = req.files.preview[0]?.path.replaceAll('\\', '/')
                }
            }

            const Pictures = mongoose.model('Pictures')
            await Pictures.findOneAndUpdate({_id: vehicle.pictures._id.toString()}, {picture: currentPictures.join('@')})
            await Pictures.findOneAndUpdate({_id: vehicle.preview._id.toString()}, {picture: currentPreview})
            vehicle.cylinderCapacity = cylinderCapacity ? cylinderCapacity : vehicle.cylinderCapacity
            vehicle.ownMass = ownMass ? ownMass : vehicle.ownMass
            vehicle.fullMass = fullMass ? fullMass : vehicle.fullMass
            vehicle.performance = performance ? performance : vehicle.performance
            vehicle.nod = nod ? nod : vehicle.nod
            vehicle.licenseNumber = licenseNumber ? licenseNumber : vehicle.licenseNumber
            vehicle.mot = mot ? mot : vehicle.mot
            await vehicle.save()

            return res.status(202).json({message: '', data: {vehicle: vehicle}})

        } catch (err) {
            return res.status(400).json({message: 'error', data: {error: err}})
        }
    })
}

exports.deleteVehicle = async (req, res) => {
    const {id} = req.params

    if (!id) {
        return res.status(422).json({message: "IDIsEmpty", data: {}})
    }

    try {
        const Vehicles = mongoose.model('Vehicles')
        const vehicle = await Vehicles.findOne({_id: id, _userId: req.userId})
        if (!vehicle) {
            return res.status(404).json({message: "VehicleNotFound", data: {}})
        }
        vehicle.isActive = false
        await vehicle.save()
        return res.status(202).json({message: '', data: {vehicle: vehicle}})
    } catch (err) {
        return res.status(400).json({message: 'error', data: {error: err}})
    }

}



