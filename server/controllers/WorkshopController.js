const mongoose = require('mongoose')
require('../models/WorkShopModel')
require('../models/UserModel')


exports.getWorkshops = async (req, res) => {
    try {
        const Workshops = mongoose.model("WorkShops")
        const resFromDB = await Workshops.find().populate('_owner').populate('employees').exec()

        let responseData = []

        resFromDB.forEach((workshop) => {
            responseData.push(workshop.getWorkshop)
        })

        return res.status(200).json({ message: '', data: { workshops: responseData } })
    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}