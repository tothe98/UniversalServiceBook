const mongoose = require('mongoose')
const ROLES = require('../core/Role')
const moment = require('moment')
const jwt = require('jsonwebtoken')
require('../models/WorkShopModel')
require('../models/UserModel')
require('../models/ServiceEntryModel')
require('../models/PictureModel')

const fs = require("fs")
const multer = require('multer')
const { request } = require('http')

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const Workshops = mongoose.model('WorkShops')
        const workshop = await Workshops.findOne({ $or: [{ employees: req.userId }, { _owner: req.userId }] })
        if (!fs.existsSync('uploads/serviceEntries/' + workshop._id + '/' + moment().format('YYYYMMDD') + '/')) {
            fs.mkdirSync('uploads/serviceEntries/' + workshop._id + '/' + moment().format('YYYYMMDD') + '/', { recursive: true })
        }
        cb(null, 'uploads/serviceEntries/' + (workshop._id.toString()) + '/' + moment().format('YYYYMMDD') + '/')
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
        name: "pictures",
        maxCount: 10
    },
])

exports.getWorkshops = async (req, res) => {
    try {
        const Workshops = mongoose.model("WorkShops")
        const resFromDB = await Workshops.find({}).populate('_owner').populate('employees')
        let responseData = []
        resFromDB.forEach((workshop) => {
            let worksp = workshop.getWorkshop
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
        const { name, country, city, address, owner, phone, email } = req.body
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
            phone: phone,
            email: email,
            _owner: isExistUser._id,
        })
        isExistUser.roles.push(!isExistUser.roles.includes(ROLES.Owner) ? ROLES.Owner : '')
        await isExistUser.save()
        return res.status(201).json({ message: '', data: { workshop: newWorkshop } })
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

exports.getMyWorkshop = async (req, res) => {
    try {
        const Workshops = mongoose.model("WorkShops")
        const workshop = await Workshops.findOne({ _owner: req.userId }).populate("_owner").populate("employees")
        if (!workshop) {
            return res.status(404).json({ message: "NotFoundYourWorkshop", data: {} })
        }
        return res.status(200).json({ message: '', data: { workshop: workshop.getWorkshop } })

    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}

exports.editWorkshop = async (req, res) => {
    try {
        const { name, country, city, address, email, phone } = req.body
        if (!name || !country || !city || !address) {
            return res.status(422).json({ message: 'AllFieldsMustBeFill', data: {} })
        }
        const Workshops = mongoose.model("WorkShops")
        const workshop = await Workshops.findOne({ _owner: req.userId })
        if (!workshop) {
            return res.status(404).json({ message: "NotFoundYourWorkshop", data: {} })
        }
        workshop.name = name
        workshop.country = country
        workshop.city = city
        workshop.address = address
        workshop.email = email ? email : undefined
        workshop.phone = phone ? phone : undefined

        await workshop.save(function (err, result) {
            if (err) {
                return res.status(400).json({ message: 'error', data: { error: err } })
            } else {
                return res.status(200).json({ message: '', data: { workshop: workshop } })
            }
        })

    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}

exports.getEmployees = async (req, res) => {
    try {
        const Workshops = mongoose.model('WorkShops')
        const workshop = await Workshops.findOne({ _owner: req.userId }).populate('employees')
        if (!workshop) {
            return res.status(404).json({ message: "NotFoundYourWorkshop", data: {} })
        }
        return res.status(200).json({ message: '', data: { employees: workshop.employees } })
    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}

exports.addEmployee = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(422).json({ message: "EmailIsEmpty", data: {} })
        }
        const Workshops = mongoose.model('WorkShops')
        const Users = mongoose.model('UserInfo')
        const user = await Users.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "UserNotFound", data: {} })
        }
        const isAlreadyEmployee = await Workshops.findOne({ employees: user._id })
        if (isAlreadyEmployee) {
            return res.status(409).json({ message: "EmailAlreadyEmployee", data: {} })
        }
        const workshop = await Workshops.findOne({ _owner: req.userId })
        if (!workshop) {
            return res.status(404).json({ message: "WorkshopNotFound", data: {} })
        }
        workshop.employees.push(user._id)
        await workshop.save()
        user.roles.push(!user.roles.includes(ROLES.Employee) ? ROLES.Employee : '')
        await user.save()

        return res.status(202).json({ message: '', data: { workshop: workshop, employee: user } })

    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            res.status(422).json({ message: "IdIsEmpty", data: {} })
        }
        const Workshops = mongoose.model('WorkShops')
        const Users = mongoose.model('UserInfo')
        const workshop = await Workshops.findOne({ _owner: req.userId, employees: id })
        if (!workshop) {
            return res.status(404).json({ message: 'WorkshopNotFound', data: {} })
        }
        const employee = await Users.findOne({ _id: id })
        if (!employee) {
            return res.status(404).json({ message: 'EmployeeNotFound', data: {} })
        }
        const indexEmployee = workshop.employees.indexOf(id)
        if (indexEmployee !== -1) {
            workshop.employees.splice(indexEmployee, 1)
        }
        await workshop.save()

        const indexRole = employee.roles.indexOf(ROLES.Employee)
        if (indexRole !== -1) {
            employee.roles.splice(indexRole, 1)
        }
        await employee.save()

        return res.status(204).json({ message: '', data: { workshop: workshop, employee: employee } })

    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}


exports.getVehicleByVin = async (req, res) => {
    try {
        const { vin } = req.params
        if (!vin) {
            return res.status(409).json({ message: 'VinIsEmpty', data: {} })
        }
        require('../models/VehicleModel')
        const Vehicles = mongoose.model('Vehicles')
        const ServiceEntires = mongoose.model('ServiceEntries')

        const vehicle = await Vehicles.findOne({ vin: vin })
            .populate('_manufacture')
            .populate('_model')
            .populate('_userId')
            .populate('preview')

        if (vehicle) {
            const serviceEntries = await ServiceEntires.find({ _vehicle: vehicle.id })
            let serviceEntryMileage = 0
            let serviceEntryCount = 0
            if (serviceEntries.length > 0) {
                serviceEntryMileage = Math.max(...serviceEntries.map(e => e.mileage))
                serviceEntryCount = serviceEntries.length
                vehicle.mileage = serviceEntryMileage
            }

            return res.status(200).json({ message: '', date: { vehicle: vehicle.getVehicleByVin, serviceEntriesCount: serviceEntryCount } })
        }
        return res.status(404).json({ message: 'VehicleNotFound', data: {} })

    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
}


exports.addServiceEntry = (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'LimitFileCount', data: { error: err } })
        }
        let files = undefined
        if (req.files?.pictures) {
            files = req.files.pictures
        }
        const { vehicleID, date, mileage, description } = req.body
        if (!vehicleID || !date || !mileage || !description) {
            deleteFiles(files)
            return res.status(422).json({ message: 'AllFieldsMustBeFill', data: {} })
        }
        try {

            // if (vehicleID.length !== 12 || vehicleID.length !== 24) {
            //     deleteFiles(files)
            //     return res.status(422).json({ message: 'IDIsNotValid', data: {} })
            // }

            const Vehicles = mongoose.model('Vehicles')
            const vehicle = await Vehicles.findOne({ _id: vehicleID })
            if (!vehicle) {
                deleteFiles(files)
                return res.status(404).json({ message: 'VehicleNotFound', data: {} })
            }
            let currentMaxMileage = vehicle.mileage ? vehicle.mileage : 0

            const ServiceEntires = mongoose.model('ServiceEntries')
            const serviceEntries = await ServiceEntires.find({ _vehicle: vehicleID })
            if (serviceEntries.length > 0) {
                currentMaxMileage = Math.max(...serviceEntries.map(e => e.mileage))
            }
            if (currentMaxMileage > mileage) {
                deleteFiles(files)
                return res.status(409).json({ message: "MileageIsLowerThanOldMileage", data: {} })
            }


            let uploadImg = undefined
            if (req.files?.pictures) {
                const picturesJoin = req.files.pictures.map(picture => picture.path.replaceAll('\\', '/')).join('@')
                const Pictures = mongoose.model('Pictures')
                await Pictures.create({
                    picture: picturesJoin,
                    _uploadFrom: req.userId
                }).then((e) => {
                    uploadImg = e["_id"].toString()
                }).catch((err) => {
                    return res.status(400).json({ message: 'error', data: { error: err } })
                })
            }
            const Workshops = mongoose.model('WorkShops')
            const workshop = await Workshops.findOne({ $or: [{ employees: req.userId }, { _owner: req.userId }] })

            const newServcieEntry = await ServiceEntires.create({
                _vehicle: vehicleID,
                _workshop: workshop._id,
                _mechanicer: req.userId,
                description: description,
                mileage: mileage,
                pictures: uploadImg,
                createdAt: date
            })

            return res.status(201).json({ message: "", date: { serviceEntry: newServcieEntry } })

        } catch (err) {
            deleteFiles(files)
            return res.status(400).json({ message: "error", data: { err } })
        }


    })
}

const deleteFiles = (array) => {
    if (array != undefined) {
        array.forEach(file => {
            if (fs.existsSync(array)) { }
            try {
                fs.unlinkSync((file.path.replaceAll('\\', '/')))
            } catch (err) {
                return;
            }

        })
    }
}
