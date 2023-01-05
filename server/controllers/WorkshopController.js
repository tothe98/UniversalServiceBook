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
        isExistUser.roles += !(isExistUser.roles.map((role) => role === ROLES.Owner)) && parseInt(ROLES.Owner)
        await isExistUser.save()
        return res.status(200).json({ message: '', data: { workshop: newWorkshop } })
    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}

exports.deleteWorkshop = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(422).json({ message: "IdIsEmpty", data: {} })
        }
        const Workshops = mongoose.model("WorkShops")
        const Users = mongoose.model("UserInfo")
        const workshopById = await Workshops.findOne({ _id: id })
        if (!workshopById) {
            return res.status(422).json({ message: "WorkshopIsNotExists", data: {} })
        }
        const owner = await Users.findOne({ _id: workshopById._owner })
        if (!owner) {
            return res.status(422).json({ message: 'OwnerIsNotExists', data: {} })
        }
        if (!workshopById.isActive) {
            return res.status(202).json({ message: "AlreadyDeleted", data: { workshop: workshopById } })
        }
        const index = owner.roles.indexOf(parseInt(ROLES.Owner))
        if (index !== -1) {
            owner.roles.splice(index, 1)
        }
        await owner.save()

        workshopById.oldOwner = workshopById._owner
        workshopById._owner = req.userId

        workshopById.employees.forEach(async (employee) => {
            const e = await Users.findOne({ _id: employee })
            if (!e) { return }
            const index = e.roles.indexOf(parseInt(ROLES.Employee))
            if (index !== -1) {
                e.roles.splice(index, 1)
            }
            e.save();
        })

        workshopById.employees = []
        workshopById.isActive = false
        await workshopById.save()
        return res.status(204).json({ message: '', data: { workshop: workshopById, owner: owner } })


    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}