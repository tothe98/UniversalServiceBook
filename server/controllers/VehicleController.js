const mongoose = require('mongoose')
require('../models/VehicleModel')

exports.addNewVehicle = async (req, res) => {
    //const Vehicle = mongoose.model('Vehicles')
    const {
        manufacturer,
        model,
        licenseNum,
        vin,
        engine,
        fuel,
        gearbox,
        color,
        picture
    } = req.body

    try {

        console.log(req.file);

        /*const isExistVIN = await Vehicle.findOne({ vin })
        const isExistLicenseNum = await Vehicle.findOne({ licenseNum })

        if (isExistVIN || isExistLicenseNum) {
            return res.status(409).json({ message: 'exist' })
        }

        /*await Vehicle.create({
            UId: req.userId,
            manufacturer: manufacturer,
            model: model,
            licenseNum: licenseNum,
            vin: vin,
            engine: engine,
            fuel: fuel,
            gearbox: gearbox,
            color: color,
            picture: picture
        })*/
        res.status(201).json({ message: 'success' })
    } catch (error) {
        res.status(400).json({ message: error })
    }
}