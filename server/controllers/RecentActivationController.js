const { logger } = require("../config/logger")
const { RecentActivations, Vehicles, ServiceEntries } = require("../core/DatabaseInitialization")

const getMileageFromServices = async (vehicleID) => {
    let currentMaxMileage = false
    const serviceEntries = await ServiceEntries.find({ _vehicle: vehicleID })
    if (serviceEntries.length > 0) {
        currentMaxMileage = Math.max(...serviceEntries.map(e => e.mileage))
    }
    return currentMaxMileage
}

exports.getServiceInformation = async (req, res) => {
    try {
        const serviceInformation = await RecentActivations.find({ userId: req.userId, isActive: true, category: { $ne: 'vehicle' } }).sort({ date: -1 }).limit(5)
        return res.status(200).json({ message: '', data: { servceInformation: serviceInformation } })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a szerviz információk lekérése során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'error', data: { error } })
    }
}

exports.getLastViewed = async (req, res) => {
    try {
        const lastViewes = await RecentActivations.find({ userId: req.userId, isActive: true, category: 'vehicle' }).sort({ date: -1 }).limit(3)
        let lastViewed = []
        for (lastView of lastViewes) {
            const vehicle = await Vehicles.findOne({ _id: lastView.vehicleId, _userId: req.userId, isActive: true })
                .populate('_manufacture')
                .populate('_model')
                .populate('_fuel')
                .populate('_driveType')
                .populate('_designType')
                .populate('_transmission')
                .populate('pictures')
                .populate('preview')
            const currentMaxMileage = await getMileageFromServices(vehicle._id)
            vehicle.mileage = currentMaxMileage ? currentMaxMileage : vehicle.mileage
            lastViewed.push(vehicle.getVehicleData)
        }
        return res.status(200).json({ message: '', data: { lastViewed: lastViewed } })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a legutóbbi aktivitásaim lekérése során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'error', data: { error } })
    }
}