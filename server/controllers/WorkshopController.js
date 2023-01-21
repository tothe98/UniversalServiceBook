const ROLES = require('../core/Role')
const multer = require('multer')
const {uploadServiceEntry, deleteFiles} = require("../core/FilesManagment");
const {Workshops, Users, Vehicles, ServiceEntries, Pictures} = require("../core/DatabaseInitialization");
const {addWorkshopValidate, addServiceEntryValidate} = require("../models/ValidationSchema");
const {logger} = require("../config/logger");

exports.getWorkshops = async (req, res) => {
    try {
        const resFromDB = await Workshops.find({isActive:true}).populate('_owner').populate('employees')
        let responseData = []
        resFromDB.forEach((workshop) => {
            let worksp = workshop.getWorkshop
            responseData.push(worksp)
        })
        return res.status(200).json({message: '', data: {workshops: responseData}})
    } catch (error) {
        logger.error("[SERVER] Hiba történt a műhelyek lekérése során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.addWorkshop = async (req, res) => {
    try {
        const {value, error} = addWorkshopValidate(req.body)

        if (error) {
            logger.warn(`Sikertelen műhely hozzáadás! Exception: ${error.details[0].message}`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(422).json({message: error.details[0].message, data: {}})
        }

        const isExistUser = await Users.findOne({email: value.owner})
        if (!isExistUser) {
            logger.warn(`Sikertelen műhely hozzáadás! Exception: Nem létezik a felhasználó!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(422).json({message: 'EmailIsNotExists', data: {}})
        }
        const isAlreadyEmployeeOrOwner = await Workshops.findOne({$or: [{employees: isExistUser._id}, {_owner: isExistUser._id}]})
        if (isAlreadyEmployeeOrOwner) {
            logger.warn(`Sikertelen műhely hozzáadás! Exception: A felhasználó már dolgozó vagy tulajdonos! Email: ${value.owner}`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(409).json({message: 'EmailIsAlreadyOwnerOrEmployee', data: {}})
        }

        const newWorkshop = await Workshops.create({
            name: value.name,
            country: value.country,
            city: value.city,
            address: value.address,
            phone: value.phone,
            email: value.email,
            _owner: isExistUser._id,
        })
        isExistUser.roles.push(!isExistUser.roles.includes(ROLES.Owner) ? ROLES.Owner : '')
        await isExistUser.save()
        logger.info(`Sikeres műhely hozzáadás!`, {user: req.userId, data: JSON.stringify(newWorkshop)})
        return res.status(201).json({message: '', data: {workshop: newWorkshop}})
    } catch (error) {
        logger.error("[SERVER] Hiba történt a műhely hozzáadás során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.deleteWorkshop = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) {
            logger.warn(`Sikertelen műhely törlés! Exception: Az ID paraméter hiányzik!`, {
                user: req.userId,
                data: JSON.stringify(req.params)
            })
            return res.status(422).json({message: "IdIsEmpty", data: {}})
        }
        const workshopById = await Workshops.findOne({_id: id})
        if (!workshopById) {
            logger.warn(`Sikertelen műhely törlés! Exception: A műhely nem létezik!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(422).json({message: "WorkshopIsNotExists", data: {}})
        }
        const owner = await Users.findOne({_id: workshopById._owner})
        if (!owner) {
            logger.warn(`Sikertelen műhely törlés! Exception: A tulajdonos nem létezik!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(422).json({message: 'OwnerIsNotExists', data: {}})
        }
        if (!workshopById.isActive) {
            logger.warn(`Sikertelen műhely törlés! Exception: A műhely már törölt!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(202).json({message: "AlreadyDeleted", data: {workshop: workshopById}})
        }
        const index = owner.roles.indexOf(parseInt(ROLES.Owner))
        if (index !== -1) {
            owner.roles.splice(index, 1)
        }
        await owner.save()

        workshopById.oldOwner = workshopById._owner
        workshopById._owner = req.userId

        for (const employee of workshopById.employees) {
            const e = await Users.findOne({_id: employee})
            if (!e) {
                return
            }
            const index = e.roles.indexOf(parseInt(ROLES.Employee))
            if (index !== -1) {
                e.roles.splice(index, 1)
            }
            await e.save();
        }

        workshopById.employees = []
        workshopById.isActive = false
        await workshopById.save()
        logger.info('Sikeres műhely törlés!', {user: req.userId, data: JSON.stringify(workshopById)})
        return res.status(204).json({message: '', data: {workshop: workshopById, owner: owner}})
    } catch (error) {
        logger.error("[SERVER] Hiba történt a műhely törlése során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.getMyWorkshop = async (req, res) => {
    try {
        const workshop = await Workshops.findOne({_owner: req.userId}).populate("_owner").populate("employees")
        if (!workshop) {
            logger.warn(`Sikertelen műhelyem lekérése! Exception: A műhely nem létezik!`, {
                user: req.userId,
                data: ''
            })
            return res.status(404).json({message: "NotFoundYourWorkshop", data: {}})
        }
        return res.status(200).json({message: '', data: {workshop: workshop.getWorkshop}})
    } catch (error) {
        logger.error("[SERVER] Hiba történt a műhelyem lekérése során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.editWorkshop = async (req, res) => {
    try {
        const {name, country, city, address, email, phone} = req.body

        const workshop = await Workshops.findOne({_owner: req.userId})
        if (!workshop) {
            logger.warn(`Sikertelen műhely szerkesztés! Exception: A műhely nem létezik!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(404).json({message: "NotFoundYourWorkshop", data: {}})
        }
        workshop.name = name ? name : workshop.name
        workshop.country = country ? country : workshop.country
        workshop.city = city ? city : workshop.city
        workshop.address = address ? address : workshop.address
        workshop.email = email ? email : workshop.email || undefined
        workshop.phone = phone ? phone : workshop.phone || undefined

        await workshop.save(function (err, result) {
            if (err) {
                logger.warn(`Sikertelen műhely szerkesztés!`, {
                    user: req.userId,
                    data: JSON.stringify(err)
                })
                return res.status(400).json({message: 'error', data: {error: err}})
            } else {
                logger.info('Sikeres műhely szerkesztés!', {user: req.userId, data: JSON.stringify(workshop)})
                return res.status(202).json({message: '', data: {workshop: workshop}})
            }
        })
    } catch (error) {
        logger.error("[SERVER] Hiba történt a műhely szerkesztése során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.getEmployees = async (req, res) => {
    try {
        const workshop = await Workshops.findOne({_owner: req.userId}).populate('employees')
        if (!workshop) {
            logger.warn(`Sikertelen dolgozók listázás! Exception: A műhely nem létezik!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(404).json({message: "NotFoundYourWorkshop", data: {}})
        }
        return res.status(200).json({message: '', data: {employees: workshop.employees}})
    } catch (error) {
        logger.error("[SERVER] Hiba történt a dolgozók listázása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.addEmployee = async (req, res) => {
    try {
        const {email} = req.body
        if (!email) {
            logger.warn(`Sikertelen dolgozó hozzáadás! Exception: Email paraméter hiányzik!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(422).json({message: "EmailIsEmpty", data: {}})
        }
        const user = await Users.findOne({email: email})
        if (!user) {
            logger.warn(`Sikertelen dolgozó hozzáadás! Exception: Felhasználó nem létezik!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(404).json({message: "UserNotFound", data: {}})
        }
        const isAlreadyEmployee = await Workshops.findOne({$or: [{employees: user._id}, {_owner: user._id}]})
        if (isAlreadyEmployee) {
            logger.warn(`Sikertelen dolgozó hozzáadás! Exception: A felhasználó már dolgozó vagy tulajdonos!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(409).json({message: "EmailAlreadyEmployee", data: {}})
        }
        const workshop = await Workshops.findOne({_owner: req.userId})
        if (!workshop) {
            logger.warn(`Sikertelen dolgozó hozzáadás! Exception: A műhely nem létezik!`, {
                user: req.userId,
                data: JSON.stringify(req.body)
            })
            return res.status(404).json({message: "WorkshopNotFound", data: {}})
        }
        workshop.employees.push(user._id)
        await workshop.save()
        user.roles.push(!user.roles.includes(ROLES.Employee) ? ROLES.Employee : '')
        await user.save()
        user.password = ""
        logger.info(`Sikeres dolgozó hozzáadás! Email: ${user.email}`, {user: req.userId, data: JSON.stringify(user)})
        return res.status(202).json({message: '', data: {workshop: workshop, employee: user}})
    } catch (error) {
        logger.error("[SERVER] Hiba történt a dolgozó hozzáadása során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.deleteEmployee = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) {
            logger.warn(`Sikertelen dolgozó törlés! Exception: ID paraméter nincs megadva!`, {
                user: req.userId,
                data: JSON.stringify(req.params)
            })
            return res.status(422).json({message: "IdIsEmpty", data: {}})
        }

        const workshop = await Workshops.findOne({_owner: req.userId, employees: id})
        if (!workshop) {
            logger.warn(`Sikertelen dolgozó törlés! Exception: A műhely nem létezik!`, {
                user: req.userId,
                data: JSON.stringify(req.params)
            })
            return res.status(404).json({message: 'WorkshopNotFound', data: {}})
        }
        const employee = await Users.findOne({_id: id})
        if (!employee) {
            logger.warn(`Sikertelen dolgozó törlés! Exception: A felhasználó nem létezik!`, {
                user: req.userId,
                data: JSON.stringify(req.params)
            })
            return res.status(404).json({message: 'EmployeeNotFound', data: {}})
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

        return res.status(204).json({message: '', data: {workshop: workshop, employee: employee}})
    } catch (error) {
        logger.error("[SERVER] Hiba történt a dolgozó törlése során!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}


exports.getVehicleByVin = async (req, res) => {
    try {
        const {vin} = req.params
        if (!vin) {
            logger.warn(`Sikertelen jármű lekérés alvázszám alapján! Exception: VIN paraméter nincs megadva!`, {
                user: req.userId,
                data: JSON.stringify(req.params)
            })
            return res.status(422).json({message: 'VinIsEmpty', data: {}})
        }

        const vehicle = await Vehicles.findOne({vin: vin})
            .populate('_manufacture')
            .populate('_model')
            .populate('_userId')
            .populate('preview')

        if (vehicle) {
            const serviceEntries = await ServiceEntries.find({_vehicle: vehicle.id})
            let serviceEntryMileage = 0
            let serviceEntryCount = 0
            if (serviceEntries.length > 0) {
                serviceEntryMileage = Math.max(...serviceEntries.map(e => e.mileage))
                serviceEntryCount = serviceEntries.length
                vehicle.mileage = serviceEntryMileage
            }

            return res.status(200).json({
                message: '',
                data: {vehicle: vehicle.getVehicleByVin, serviceEntriesCount: serviceEntryCount}
            })
        }
        logger.warn(`Sikertelen jármű lekérés alvázszám alapján! Exception: A jármű nem létezik!`, {
            user: req.userId,
            data: JSON.stringify(req.params)
        })
        return res.status(404).json({message: 'VehicleNotFound', data: {}})
    } catch (error) {
        logger.error("[SERVER] Hiba történt a jármű lekérés alvázszám alapján!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}


exports.addServiceEntry = (req, res) => {
    uploadServiceEntry(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            logger.warn(`Sikertelen szervizbejegyzés hozzáadás! Exception: Kép száma elérte a maximumot!`, {
                user: req.userId,
                data: JSON.stringify(err)
            })
            return res.status(400).json({message: 'LimitFileCount', data: {error: err}})
        }
        let files = undefined
        if (req.files?.pictures) {
            files = req.files.pictures
        }
        const {value, error} = addServiceEntryValidate(req.body)
        if (error) {
            deleteFiles(files)
            logger.warn(`Sikertelen szervizbejegyzés hozzáadás! Exception: ${error.details[0].message}`, {
                user: req.userId,
                data: JSON.stringify(error)
            })
            return res.status(422).json({message: error.details[0].message, data: {}})

        }
        try {
            const vehicle = await Vehicles.findOne({_id: value.vehicleID})
            if (!vehicle) {
                deleteFiles(files)
                logger.warn(`Sikertelen szervizbejegyzés hozzáadás! Exception: Jármű nem létezik!`, {
                    user: req.userId,
                    data: JSON.stringify(req.body)
                })
                return res.status(404).json({message: 'VehicleNotFound', data: {}})
            }
            let currentMaxMileage = vehicle.mileage ? vehicle.mileage : 0

            const serviceEntries = await ServiceEntries.find({_vehicle: value.vehicleID})
            if (serviceEntries.length > 0) {
                currentMaxMileage = Math.max(...serviceEntries.map(e => e.mileage))
            }
            if (currentMaxMileage > value.mileage) {
                deleteFiles(files)
                logger.warn(`Sikertelen szervizbejegyzés hozzáadás! Exception: A KM óra kisebb az adatbázishoz képest!`, {
                    user: req.userId,
                    data: JSON.stringify(vehicle)
                })
                return res.status(409).json({message: "MileageIsLowerThanOldMileage", data: {}})
            }


            let uploadImg = undefined
            if (req.files?.pictures) {
                const picturesJoin = req.files.pictures.map(picture => picture.path.replaceAll('\\', '/')).join('@')
                await Pictures.create({
                    picture: picturesJoin,
                    _uploadFrom: req.userId
                }).then((e) => {
                    uploadImg = e["_id"].toString()
                }).catch((err) => {
                    logger.warn(`Sikertelen szervizbejegyzés hozzáadás! Exception: Sikertelen kép mentés!`, {
                        user: req.userId,
                        data: JSON.stringify(req.files)
                    })
                    return res.status(400).json({message: 'error', data: {error: err}})
                })
            }

            const workshop = await Workshops.findOne({$or: [{employees: req.userId}, {_owner: req.userId}]})

            const newServcieEntry = await ServiceEntries.create({
                _vehicle: value.vehicleID,
                _workshop: workshop._id,
                _mechanicer: req.userId,
                description: value.description,
                mileage: value.mileage,
                pictures: uploadImg,
                createdAt: value.date
            })
            logger.info('Sikeres szervizbejegyzés hozzáadás!', {
                user: req.userId,
                data: JSON.stringify(newServcieEntry)
            })
            return res.status(201).json({message: "", date: {serviceEntry: newServcieEntry}})

        } catch (error) {
            deleteFiles(files)
            logger.error("[SERVER] Hiba történt a szervizbejegyzés hozzáadása során!", {
                user: req.userId,
                data: JSON.stringify(error)
            })
            return res.status(500).json({message: "error", data: {error}})
        }
    })
}

