const { uploadVehicle, deleteFiles, deleteFile } = require("../core/FilesManagment");
const multer = require('multer')
const {
    ServiceEntries,
    Vehicles,
    Manufactures,
    Models,
    Fuels,
    DriveTypes,
    DesignTypes,
    Transmissions,
    Pictures,
    RecentActivations
} = require("../core/DatabaseInitialization");
const { addVehicleValidate } = require("../models/ValidationSchema");
const { logger } = require("../config/logger");
const moment = require("moment");

const getMileageFromServices = async (vehicleID) => {
    let currentMaxMileage = false
    const serviceEntries = await ServiceEntries.find({ _vehicle: vehicleID })
    if (serviceEntries.length > 0) {
        currentMaxMileage = Math.max(...serviceEntries.map(e => e.mileage))
    }
    return currentMaxMileage
}

exports.addVehicle = (req, res) => {
    uploadVehicle(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            logger.warn(`Sikertelen jármű hozzáadás! Exception: Kép elérte a maximum számot!`, {
                user: req.userId,
                data: JSON.stringify(err)
            })
            return res.status(400).json({ message: 'LimitFileCount', data: { error: err } })
        }

        if (!req.files?.picture || !req.files?.preview) {
            logger.warn(`Sikertelen jármű hozzáadás! Exception: Kép nincs feltöltve!`, {
                user: req.userId,
                data: JSON.stringify(req.files)
            })
            return res.status(422).json({ message: 'PictureIsEmpty', data: {} })
        }
        const filesArray = req.files.picture

        const { value, error } = addVehicleValidate(req.body)

        if (error) {
            deleteFiles(filesArray)
            deleteFiles(req.files?.preview)
            logger.warn(`Sikertelen jármű hozzáadás! Exception: ${error.details[0].message}`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(422).json({ message: error.details[0].message, data: {} })
        }

        try {
            const fileName = req.files.picture.map(picture => picture.path.replaceAll('\\', '/')).join('@')
            const previewName = req.files.preview[0].path.replaceAll('\\', '/')

            const isExistVin = await Vehicles.findOne({ vin: value.vin })
            if (isExistVin) {
                deleteFiles(req.files?.preview)
                deleteFiles(filesArray)
                logger.warn(`Sikertelen jármű hozzáadás! Exception: Ezzel az alvázszámmal már létezik jármű! VIN: ${value.vin}`, {
                    user: req.userId,
                    data: JSON.stringify(value)
                })
                return res.status(409).json({ message: "VinIsExists", data: {} })
            }

            const isExistManufacture = await Manufactures.findOne({ _id: value.manufacture })
            if (!isExistManufacture) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                logger.warn(`Sikertelen jármű hozzáadás! Exception: Nem létezik ilyen márka! MANUFACTURE: ${value.manufacture}`, {
                    user: req.userId,
                    data: JSON.stringify(value)
                })
                return res.status(409).json({ message: "ManufactureIsNotExists", data: {} })
            }
            const isExistModel = await Models.findOne({ _id: value.model, _manufacture: value.manufacture })
            if (!isExistModel) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                logger.warn(`Sikertelen jármű hozzáadás! Exception: Nem létezik ilyen model! MODEL: ${value.model}`, {
                    user: req.userId,
                    data: JSON.stringify(value)
                })
                return res.status(409).json({ message: "ModelIsNotExists", data: {} })
            }
            const isExistFuel = await Fuels.findOne({ _id: value.fuel })
            if (!isExistFuel) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                logger.warn(`Sikertelen jármű hozzáadás! Exception: Nem létezik ilyen üzemanyag fajta! FUEL: ${value.fuel}`, {
                    user: req.userId,
                    data: JSON.stringify(value)
                })
                return res.status(409).json({ message: "FuelIsNotExists", data: {} })
            }
            const isExistDriveType = await DriveTypes.findOne({ _id: value.driveType })
            if (!isExistDriveType) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                logger.warn(`Sikertelen jármű hozzáadás! Exception: Nem létezik ilyen hajtás típus! DRIVETYPE: ${value.driveType}`, {
                    user: req.userId,
                    data: JSON.stringify(value)
                })
                return res.status(409).json({ message: "DriveTypeIsNotExists", data: {} })
            }
            const isExistDesignType = await DesignTypes.findOne({ _id: value.designType })
            if (!isExistDesignType) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                logger.warn(`Sikertelen jármű hozzáadás! Exception: Nem létezik ilyen kiviteli típus! DESIGNTYPE: ${value.designType}`, {
                    user: req.userId,
                    data: JSON.stringify(value)
                })
                return res.status(409).json({ message: "DesignTypeIsNotExists", data: {} })
            }
            const isExistTransmission = await Transmissions.findOne({ _id: value.transmission })
            if (!isExistTransmission) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                logger.warn(`Sikertelen jármű hozzáadás! Exception: Nem létezik ilyen sebességváltó típus! TRANSMISSION: ${value.transmission}`, {
                    user: req.userId,
                    data: JSON.stringify(value)
                })
                return res.status(409).json({ message: "TransmissionIsNotExists", data: {} })
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

            const createPicture = new Pictures(pictures)
            const createPreview = new Pictures(preview)
            await createPicture.save()
            await createPreview.save()

            uploadedImg = createPicture._id
            previewImg = createPreview._id

            if (uploadedImg === undefined || previewImg === undefined) {
                deleteFiles(filesArray)
                deleteFiles(req.files?.preview)
                logger.warn(`Sikertelen jármű hozzáadás! Exception: Képek nem kerültek elmentésre!`, {
                    user: req.userId,
                    data: JSON.stringify(req.files)
                })
                return res.status(400).json({ message: 'error', data: {} })
            }


            const newVehicle = await Vehicles.create({
                _userId: req.userId,
                _manufacture: value.manufacture,
                _model: value.model,
                _fuel: value.fuel,
                _driveType: value.driveType,
                _designType: value.designType,
                _transmission: value.transmission,
                licenseNumber: value.licenseNumber,
                vin: value.vin,
                vintage: value.vintage,
                ownMass: value.ownMass,
                fullMass: value.fullMass,
                cylinderCapacity: value.cylinderCapacity,
                performance: value.performance,
                mot: value.mot,
                nod: value.nod,
                mileage: value.mileage,
                pictures: uploadedImg,
                preview: previewImg
            })
            logger.info(`Sikeres jármű hozzáadás!`, { user: req.userId, data: JSON.stringify(newVehicle) })
            return res.status(201).json({ message: '', data: { vehicle: newVehicle } })
        } catch (error) {
            deleteFiles(filesArray)
            deleteFiles(req.files?.preview)
            logger.error("[SERVER] Hiba történt a jármű hozzáadás során!", {
                user: req.userId,
                data: JSON.stringify(error)
            })
            return res.status(500).json({ message: "error", data: { error } })
        }
    }
    )
}

exports.getVehicles = async (req, res) => {
    try {
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

        for (const vehicle of resFromDB) {
            const currentMaxMileage = await getMileageFromServices(vehicle._id)
            vehicle.mileage = currentMaxMileage ? currentMaxMileage : vehicle.mileage
            responseData.push(vehicle.getVehicleData)
        }

        return res.status(200).json({ message: '', data: { vehicles: responseData } })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a járművek listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'error', data: { error: error } })
    }
}

exports.getVehicle = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            logger.warn(`Sikertelen jármű listázás! Exception: Id paraméter hiányzik!`, {
                user: req.userId,
                data: JSON.stringify(req.params)
            })
            return res.status(422).json({ message: "IdIsNotExists", data: {} })
        }

        const isExist = await Vehicles.findOne({ _id: id, _userId: req.userId, isActive: true })
        if (!isExist) {
            logger.warn(`Sikertelen jármű listázás! Exception: Jármű nem található!`, {
                user: req.userId,
                data: JSON.stringify(req.params)
            })
            return res.status(404).json({ message: "VehicleIsNotExists", data: {} })
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

        const resFromDBServices = await ServiceEntries.find({ _vehicle: id, isDelete: false })
            .populate("_workshop")
            .populate("pictures")
            .populate('_mechanicer')
            .sort({ createdAt: 1 })


        let responseData = []
        resFromDBServices.forEach((service) => {
            responseData.push(service.getServices)
        })

        const currentMaxMileage = await getMileageFromServices(resFromDB._id)
        resFromDB.mileage = currentMaxMileage ? currentMaxMileage : resFromDB.mileage

        const isRecentActivationExists = await RecentActivations.findOne({ vehicleId: id, isActive: true, userId: req.userId })
        if (!isRecentActivationExists) {
            const recentActivation = await RecentActivations.create({
                userId: req.userId,
                vehicleId: id,
                expireDate: moment().add(1, 'days').format(),
                category: "vehicle",
            })
        }

        return res.status(200).json({
            message: '', data: { vehicle: resFromDB.getVehicleDataById, serviceEntries: responseData || [] }
        })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a jármű listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'error', data: { error: error } })
    }
}

exports.updateVehicle = async (req, res) => {
    uploadVehicle(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            logger.warn(`Sikertelen jármű szerkesztés! Exception: Képek elérte a maximumot!`, {
                user: req.userId,
                data: JSON.stringify(err)
            })
            return res.status(400).json({ message: 'LimitFileCount', data: { error: err } })
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
            const { id } = req.params
            if (!id) {
                logger.warn(`Sikertelen jármű szerkesztés! Exception: Id paraméter hiányzik!`, {
                    user: req.userId,
                    data: JSON.stringify(req.params)
                })
                return res.status(422).json({ message: 'IdIsEmpty', data: {} })
            }

            const vehicle = await Vehicles.findOne({
                _id: id,
                _userId: req.userId
            }).populate('pictures').populate('preview')
            if (!vehicle) {
                logger.warn(`Sikertelen jármű szerkesztés! Exception: Jármű nem létezik!`, {
                    user: req.userId,
                    data: JSON.stringify(req.body)
                })
                return res.status(404).json({ message: 'VehicleNotFound', data: {} })
            }
            let currentPictures = vehicle.pictures?.picture.split('@')
            let currentPreview = vehicle.preview?.picture

            if (deletedPictures) {
                deletedPictures.split('@').forEach(deletedPicture => {
                    const indexAtCurrentPictures = currentPictures.indexOf(deletedPicture);
                    if (indexAtCurrentPictures > -1) {
                        deleteFile(deletedPicture)
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

            currentPictures = currentPictures.filter((p) => {
                return p != ""
            })

            await Pictures.findOneAndUpdate({ _id: vehicle.pictures._id.toString() }, { picture: currentPictures.join('@') })
            await Pictures.findOneAndUpdate({ _id: vehicle.preview._id.toString() }, { picture: currentPreview })
            vehicle.cylinderCapacity = cylinderCapacity ? cylinderCapacity : vehicle.cylinderCapacity
            vehicle.ownMass = ownMass ? ownMass : vehicle.ownMass
            vehicle.fullMass = fullMass ? fullMass : vehicle.fullMass
            vehicle.performance = performance ? performance : vehicle.performance
            vehicle.nod = nod ? nod : vehicle.nod
            vehicle.licenseNumber = licenseNumber ? licenseNumber : vehicle.licenseNumber
            vehicle.mot = mot ? mot : vehicle.mot
            await vehicle.save()

            logger.info("Sikeres jármű szerkesztés!", { user: req.userId, data: JSON.stringify(vehicle) })
            return res.status(202).json({ message: '', data: { vehicle: vehicle } })

        } catch (error) {
            logger.error("[SERVER] Hiba történt a jármű szerkesztés során!", {
                user: req.userId,
                data: JSON.stringify(error)
            })
            return res.status(500).json({ message: 'error', data: { error: error } })
        }
    })
}

exports.deleteVehicle = async (req, res) => {
    const { id } = req.params
    if (!id) {
        logger.warn(`Sikertelen jármű törlés! Exception: Id paraméter hiányzik!`, {
            user: req.userId,
            data: JSON.stringify(req.params)
        })
        return res.status(422).json({ message: "IDIsEmpty", data: {} })
    }
    try {
        const vehicle = await Vehicles.findOne({ _id: id, _userId: req.userId })
        if (!vehicle) {
            logger.warn(`Sikertelen jármű törlés! Exception: Jármű nem található!`, {
                user: req.userId,
                data: JSON.stringify(req.params)
            })
            return res.status(404).json({ message: "VehicleNotFound", data: {} })
        }
        vehicle.isActive = false
        await vehicle.save()
        return res.status(204).json({ message: '', data: {} })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a jármű törlés során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'error', data: { error } })
    }

}



