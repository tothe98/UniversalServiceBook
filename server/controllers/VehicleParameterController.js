const {
    VehicleTypes,
    Manufactures,
    Models,
    Fuels,
    DesignTypes,
    DriveTypes,
    Transmissions
} = require("../core/DatabaseInitialization");
const { logger } = require("../config/logger");

//Kategóriák kilistázása
exports.getCategories = async (req, res) => {
    try {
        const responseFromDB = await VehicleTypes.find({ isActive: true })
            .then((response) => {
                return res.status(200).json({ message: '', data: { categories: response } });
            })
            .catch((err) => {
                logger.error("[SERVER] Hiba történt a kategória listázása során!", {
                    user: req.userId,
                    data: JSON.stringify(err)
                })
                return res.status(400).json({ message: 'Error', data: { err } })
            })

    } catch (error) {
        logger.error("[SERVER] Hiba történt a kategória listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'Error', data: { error } })
    }
}

//Auto ID: 637e08068850125b86f2ad69
//Új járműkategória hozzáadás
exports.addCategory = async (req, res) => {
    const { vehicleType } = req.body
    if (!vehicleType) {
        return res.status(422).json({ message: 'VehicleTypeIsEmpty', data: {} })
    }
    try {
        const isExist = await VehicleTypes.findOne({ vehicleType: vehicleType })
        if (!isExist) {
            const response = await VehicleTypes.create({
                vehicleType: vehicleType
            })
            return res.status(201).json({ message: "Successful", data: { response } })
        } else {
            return res.status(409).json({ message: 'Exist', data: {} })
        }

    } catch (err) {
        return res.status(500).json({ message: 'Error', data: { err } })
    }
}


//Jármű márkák kilistázása
exports.getManufactures = async (req, res) => {
    const { category } = req.body
    if (!category) {
        return res.status(422).json({ message: 'CategoryIsEmpty', data: {} })
    }
    try {
        const responseFromDB = await Manufactures.find({ _vehicleType: category, isActive: true }).sort({ manufacture: 1 })
            .then((response) => {
                return res.status(200).json({ message: '', data: { manufacture: response } })
            })
            .catch((err) => {
                return res.status(404).json({ message: 'NotFound', data: { err } })
            })

    } catch (error) {
        logger.error("[SERVER] Hiba történt a márka listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'Error', data: { error } })
    }
}


//Új jármű márka hozzáadása
exports.addManufacture = async (req, res) => {
    const { vehicleType, manufacture } = req.body
    if (!vehicleType || !manufacture) {
        return res.status(422).json({ message: 'VehicleTypeOrManufactureIsEmpty', data: {} })
    }
    try {
        const isExistCategory = await VehicleTypes.findOne({ _id: vehicleType })
        if (isExistCategory) {
            const isExistManufacture = await Manufactures.findOne({ manufacture: manufacture, _vehicleType: vehicleType })
            if (!isExistManufacture || isExistManufacture.manufacture.toUpperCase() !== manufacture.toUpperCase()) {
                const response = await Manufactures.create({
                    _vehicleType: vehicleType,
                    manufacture: manufacture
                })
                return res.status(201).json({ message: "Successful", data: { response } })
            } else {
                return res.status(409).json({ message: 'Exist', data: {} })
            }
        } else {
            return res.status(404).json({ message: 'NotExistCategory', data: {} })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error', data: { err } })
    }
}


//Jármű modelek kilistázása
exports.getModels = async (req, res) => {
    const { manufacture } = req.body
    if (!manufacture) {
        return res.status(422).json({ message: 'ManufactureIsEmpty', data: {} })
    }
    try {
        const responseFromDB = await Models.find({ _manufacture: manufacture, isActive: true }).sort({ model: 1 })
            .then((response) => {
                return res.status(200).json({ message: '', data: { models: response } });
            })
            .catch((err) => {
                return res.status(404).json({ message: 'NotFound', data: { err } })
            })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a model listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'Error', data: { error } })
    }
}


//Új jármű model hozzáadása
exports.addModel = async (req, res) => {
    const { manufacture, model } = req.body
    if (!manufacture || !model) {
        return res.status(422).json({ message: 'ModelOrManufactureIsEmpty', data: {} })
    }
    try {
        const isExistManufacture = await Manufactures.findOne({ _id: manufacture })

        if (isExistManufacture) {
            const isExistModel = await Models.findOne({ model: model, _manufacture: manufacture })
            if (!isExistModel) {
                const response = await Models.create({
                    model: model,
                    _manufacture: manufacture
                })
                return res.status(201).json({ message: "Successful", data: { response } })
            } else {
                return res.status(409).json({ message: 'Exist', data: {} })
            }
        } else {
            return res.status(404).json({ message: 'NotExistManufacture', data: {} })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error', data: { err } })
    }
}

//Üzemanyagok listázása
exports.getFuels = async (req, res) => {
    try {
        const responseFromDB = await Fuels.find({ isActive: true })
            .then((response) => {
                return res.status(200).json({ message: '', data: { fuels: response } });
            })
            .catch((err) => {
                return res.status(404).json({ message: 'Error', data: { err } })
            })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a üzemanyag listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'Error', data: { error } })
    }
}

//Üzemanyag hozzáadása
exports.addFuel = async (req, res) => {
    const { fuel } = req.body
    if (!fuel) {
        return res.status(422).json({ message: 'FuelIsEmpty', data: {} })
    }
    try {
        const isExist = await Fuels.findOne({ fuel: fuel })
        if (!isExist) {
            const response = await Fuels.create({
                fuel: fuel
            })
            return res.status(201).json({ message: "Successful", data: { response } })
        } else {
            return res.status(409).json({ message: 'Exist', data: {} })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error', data: { err } })
    }
}

//Jármű kivitelek listázása
exports.getDesignTypes = async (req, res) => {
    const { vehicleType } = req.body
    if (!vehicleType) {
        return res.status(422).json({ message: 'VehicleTypeIsEmpty', data: {} })
    }
    try {
        const responseFromDB = await DesignTypes.find({ _vehicleType: vehicleType, isActive: true })
            .then((response) => {
                return res.status(200).json({ message: '', data: { designTypes: response } });
            })
            .catch((err) => {
                return res.status(404).json({ message: 'Error', data: { err } })
            })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a kivitel típus listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'Error', data: { error } })
    }
}

//Jármű kivitel hozzáadása
exports.addDesignType = async (req, res) => {
    const { vehicleType, designType } = req.body
    if (!vehicleType || !designType) {
        return res.status(422).json({ message: 'VehicleTypeOrDesignTypeIsEmpty', data: {} })
    }
    try {
        const isExist = await DesignTypes.findOne({ designType: designType, _vehicleType: vehicleType })
        if (!isExist) {
            const response = await DesignTypes.create({
                designType: designType,
                _vehicleType: vehicleType
            })
            return res.status(201).json({ message: "Successful", data: { response } })
        } else {
            return res.status(409).json({ message: 'Exist', data: {} })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error', data: { err } })
    }
}

//Jármű hajtás típus listázása
exports.getDriveType = async (req, res) => {
    const { vehicleType } = req.body
    if (!vehicleType) {
        return res.status(422).json({ message: 'VehicleTypeIsEmpty', data: {} })
    }
    try {
        const responseFromDB = await DriveTypes.find({ _vehicleType: vehicleType, isActive: true })
            .then((response) => {
                return res.status(200).json({ message: '', data: { driveTypes: response } });
            })
            .catch((err) => {
                return res.status(404).json({ message: 'Error', data: { err } })
            })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a hajtás típus listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'Error', data: { error } })
    }
}

//Jármű kivitel hozzáadása
exports.addDriveType = async (req, res) => {
    const { vehicleType, driveType } = req.body
    if (!vehicleType || !driveType) {
        return res.status(422).json({ message: 'VehicleTypeOrDriveTypeIsEmpty', data: {} })
    }
    try {
        const isExist = await DriveTypes.findOne({ driveType: driveType, _vehicleType: vehicleType })
        if (!isExist) {
            const response = await DriveTypes.create({
                driveType: driveType,
                _vehicleType: vehicleType
            })
            return res.status(201).json({ message: "Successful", data: { response } })
        } else {
            return res.status(409).json({ message: 'Exist', data: {} })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error', data: { err } })
    }
}

//Jármű sebességváltók listázása
exports.getTransmissions = async (req, res) => {
    const { vehicleType } = req.body
    if (!vehicleType) {
        return res.status(422).json({ message: 'VehicleTypeIsEmpty', data: {} })
    }
    try {
        const responseFromDB = await Transmissions.find({ _vehicleType: vehicleType, isActive: true })
            .then((response) => {
                return res.status(200).json({ message: '', data: { transmissions: response } });
            })
            .catch((err) => {
                return res.status(404).json({ message: 'Error', data: { err } })
            })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a sebességváltók listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'Error', data: { error } })
    }
}

//Jármű sebességváltó hozzáadása
exports.addTransmission = async (req, res) => {
    const { vehicleType, transmission } = req.body
    if (!vehicleType || !transmission) {
        return res.status(422).json({ message: 'VehicleTypeOrTransmissionsIsEmpty', data: {} })
    }
    try {
        const isExist = await Transmissions.findOne({ transmission: transmission, _vehicleType: vehicleType })
        if (!isExist) {
            const response = await Transmissions.create({
                transmission: transmission,
                _vehicleType: vehicleType
            })
            return res.status(201).json({ message: "Successful", data: { response } })
        } else {
            return res.status(409).json({ message: 'Exist', data: {} })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error', data: { err } })
    }
}
