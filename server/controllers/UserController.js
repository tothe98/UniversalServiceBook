const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const moment = require('moment')
const sendEmail = require("../core/Mailer")
const { newPasswordView } = require('../core/MailViews')
const { uploadUser } = require("../core/FilesManagment");
const { Users, Pictures, EmailConfirmation } = require("../core/DatabaseInitialization");
const { newPasswordValidate } = require("../models/ValidationSchema");
const { logger } = require("../config/logger");

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateString = (length) => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.getUser = async (req, res) => {
    try {
        const resUser = await Users.findOne({ _id: req.userId }).populate("_profilImg")
        req.email = resUser.getUserData.email
        return res.status(200).json({ message: '', data: { user: resUser.getUserData } });
    } catch (error) {
        logger.error("[SERVER] Hiba történt a user adatok lekérésénél!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'error', data: { error } })
    }
}

exports.updateUser = async (req, res) => {
    uploadUser(req, res, async function (err) {
        const { lName, fName, phone, home, oldPassword, newPassword } = req.body
        try {
            if (err instanceof multer.MulterError) {
                logger.warn(`Sikertelen user adatok frissítése! Exception: Kép száma elérte a maximumot!`, {
                    user: req.userId,
                    data: JSON.stringify(err)
                })
                return res.status(422).json({ message: 'LimitFileCount', data: { error: err } })
            }

            let uploadImg = undefined
            const updateUser = await Users.findOne({ _id: req.userId })
            if (req.files?.picture) {
                await Pictures.create({
                    picture: req.files.picture[0].path.replaceAll('\\', '/'),
                    _uploadFrom: req.userId
                }).then((e) => {
                    uploadImg = e['_id'].toString()
                }).catch((err) => {
                    logger.error("[SERVER] Hiba történt a user adatok frissítésnél a képfeltöltésénél!", {
                        user: req.userId,
                        data: JSON.stringify(err)
                    })
                    return res.status(500).json({ message: 'error', data: { error: err } })
                })
            }

            let updatePsw = undefined

            if (oldPassword && newPassword) {
                if (await bcrypt.compare(oldPassword, updateUser.password)) {
                    const salt = bcrypt.genSaltSync(10)
                    updatePsw = bcrypt.hashSync(newPassword, salt)
                } else {
                    updateUser.password = ""
                    logger.warn(`Sikertelen user adatok frissítése! Exception: A jelszó nem egyezik!`, {
                        user: req.userId,
                        data: JSON.stringify(updateUser)
                    })
                    return res.status(422).json({ message: 'passwordNotCorrect', data: {} })
                }
            }

            updateUser._profilImg = uploadImg ? uploadImg : updateUser._profilImg
            updateUser.password = updatePsw ? updatePsw : updateUser.password
            updateUser.fName = fName ? fName : updateUser.fName
            updateUser.lName = lName ? lName : updateUser.lName
            updateUser.phone = phone ? phone : updateUser.phone
            updateUser.home = home ? home : updateUser.home

            await updateUser.save()
            updateUser.password = ""
            logger.info('Sikeres user adat frissítés!', { user: req.userId, data: JSON.stringify(updateUser) })
            return res.status(202).json({ message: 'OK', data: { user: updateUser } })

        } catch (error) {
            logger.error("[SERVER] Hiba történt a user adatok frissítésénél!", {
                user: req.userId,
                data: JSON.stringify(error)
            })
            return res.status(500).json({ message: 'error', data: { error } })
        }
    })

}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    if (!email) {
        logger.warn(`Sikertelen elfelejtett jelszó kérés! Exception: Az email mező hiányzik!`, {
            user: 'System',
            data: ''
        })
        return res.status(422).json({ message: 'EmailIsEmpty', data: {} })
    }
    try {
        const findUser = await Users.findOne({ email: email })

        if (!findUser) {
            logger.warn(`Sikertelen elfelejtett jelszó kérés! Exception: A felhasználó nem létezik! Email: ${email}`, {
                user: 'System',
                data: ''
            })
            return res.status(404).json({ message: 'UserIsNotFound', data: {} })
        }

        const verificationCode = generateString(25)
        const userId = findUser._id
        const isAlreadyRequest = await EmailConfirmation.findOne({ userId: userId, isActive: true, category: 'password' })
        if (isAlreadyRequest) {
            if (moment(isAlreadyRequest.expireDate).diff(moment(), 'minutes') > 0) {
                logger.warn(`Sikertelen elfelejtett jelszó kérés! Exception: Már létezik a kérés! UserId: ${userId}`, {
                    user: 'System',
                    data: JSON.stringify(isAlreadyRequest)
                })
                return res.status(409).json({ message: 'AlreadyRequested', data: {} })
            }
        }
        await EmailConfirmation.create({
            verificationCode: verificationCode,
            userId: userId,
            category: 'password',
            expireDate: moment().add(15, 'minutes').format()
        }).then(async (response) => {
            await sendEmail(findUser.email, "Elfelejtett jelszó",
                newPasswordView(`${process.env.CLIENT_URL}/elfelejtett/${userId}/${verificationCode}`)
            )
            logger.info(`Sikeres elfelejtett jelszó kérés! Email: ${email}`, { user: 'System', data: '' })
            return res.status(200).json({ message: 'EmailIsSent', data: {} })
        }).catch((error) => {
            logger.error(`Sikertelen elfelejtett jelszó kérés! Execeptions: Kérés nem lett hozzáadva!`, { user: 'System', data: JSON.stringify(error) })
            return res.status(400).json({ message: 'EmailIsNotSend', data: { error } })
        })
    } catch (error) {
        logger.error("[SERVER] Hiba történt az elfelejtett jelszó kérésnél!", {
            user: 'System',
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'error', data: { error } })
    }
}

exports.newPassword = async (req, res) => {
    const { value, error } = newPasswordValidate(req.body)

    if (error) {
        logger.warn(`Sikertelen új jelszó létrehozás! Exception: ${error.details[0].message}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(422).json({ message: error.details[0].message, data: {} })
    }
    try {
        const isValidCode = await EmailConfirmation.findOne({ userId: value.userId, verificationCode: value.verificationCode, isActive: true, category: 'password' })
        if (isValidCode) {
            if (moment(isValidCode.expireDate).diff(moment(), 'minutes') > 0) {
                const isExistsUser = await Users.findOne({ _id: isValidCode.userId })
                if (!isExistsUser) {
                    logger.warn(`Sikertelen új jelszó létrehozás! Exception: User nem található!`, { user: 'System', data: JSON.stringify(isValidCode) })
                    return res.status(404).json({ message: 'UserNotFound', data: {} })
                }
                if (value.password === value.cpassword) {
                    isValidCode.isActive = false
                    await isValidCode.save()
                    const salt = bcrypt.genSaltSync(10)
                    const updatePsw = bcrypt.hashSync(value.password, salt)
                    isExistsUser.password = updatePsw
                    await isExistsUser.save()
                    isExistsUser.password = ""
                    logger.info(`Sikeres új jelszó létrehozás!`, { user: 'System', data: JSON.stringify(isExistsUser) })
                    return res.status(201).json({ message: 'success', data: {} })
                } else {
                    logger.warn(`Sikertelen új jelszó létrehozás! Exception: A két jelszó nem egyezik!`, {
                        user: 'System',
                        data: ''
                    })
                    return res.status(422).json({ message: 'PasswordIsNotEqual', data: {} })
                }
            } else {
                logger.warn(`Sikertelen új jelszó létrehozás! Exception: Lejárt a code`, {
                    user: 'System',
                    data: JSON.stringify(isValidCode)
                })
                return res.status(409).json({ message: 'NotValidCoce', data: {} })
            }
        } else {
            logger.warn(`Sikertelen új jelszó létrehozás! Exception: Nem található newPassord kérés`, {
                user: 'System',
                data: JSON.stringify(value)
            })
            return res.status(404).json({ message: 'NotFoundCode', data: {} })
        }
    } catch (error) {
        logger.error("[SERVER] Hiba történt az új jelszó létrehozásnál!", {
            user: 'System',
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: 'error', data: { error } })
    }
}