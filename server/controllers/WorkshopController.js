const mongoose = require('mongoose')
const ROLES = require('../core/Role')
require('../models/WorkShopModel')
require('../models/UserModel')


exports.getWorkshops = async (req, res) => {
    try {
        const Workshops = mongoose.model("WorkShops")
        const resFromDB = await Workshops.find({}).populate('_owner').populate('employees')
        let responseData = []
        resFromDB.forEach((workshop) => {
            let worksp = workshop.getWorkshop
            //worksp.owner = workshop.owner?.lName + " " + workshop.owner?.fName
            responseData.push(worksp)
        })

        return res.status(200).json({ message: '', data: { workshops: responseData } })
    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}

exports.addWorkshop = async (req, res) => {
    try {
        const Workshops = mongoose.model("WorkShops")
        const Users = mongoose.model("UserInfo")
        const { name, country, city, address, owner } = req.body
        if (!name || !country || !city || !address || !owner) {
            return res.status(422).json({ message: 'AllFieldsMustBeFill', data: {} })
        }
        const isExistUser = await Users.findOne({ email: owner })
        if (!isExistUser) {
            return res.status(422).json({ message: 'EmailIsNotExists', data: {} })
        }

        const newWorkshop = await Workshops.create({
            name: name,
            country: country,
            city: city,
            address: address,
            _owner: isExistUser._id,
        })
        isExistUser.roles += ROLES.Owner
        await isExistUser.save()
        return res.status(200).json({ message: '', data: { workshop: newWorkshop } })
    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}