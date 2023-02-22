const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require("moment")
const sendEmail = require("../core/Mailer")
const { confirmationEmail } = require('../core/MailViews')
const ROLES = require('../core/Role')
const { Users, EmailConfirmation } = require('../core/DatabaseInitialization')
const { authSignUpValidate, authSignInValidate } = require("../models/ValidationSchema")
const { logger } = require("../config/logger")

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateString = (length) => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.signup = async (req, res) => {
    const { value, error } = authSignUpValidate(req.body)
    if (error) {
        req.body.password = ""
        logger.warn(`Sikertelen regisztráció! Exception: ${error.details[0].message}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(422).json({ message: error.details[0].message, data: {} })
    }

    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(value.password, salt);

    try {
        const isExistEmail = await Users.findOne({ email: value.email })

        if (isExistEmail) {
            req.body.password = ""
            logger.warn(`Sikertelen regisztráció! Exception: Felhasználó már létezik! Email: ${value.email}`, {
                user: 'System',
                data: JSON.stringify(req.body)
            })
            return res.status(409).json({ message: 'EmailIsExists', data: {} })
        }
        let createdUser = await Users.create({
            fName: value.fName,
            lName: value.lName,
            email: value.email,
            phone: value.phone,
            password: encryptedPassword,
            roles: [ROLES.User]
        })
        createdUser = createdUser.toJSON()

        const verificationCode = generateString(20)
        const userId = createdUser['_id']
        const activationReguest = await EmailConfirmation.create({
            verificationCode: verificationCode,
            userId: userId,
            category: 'email',
            expireDate:moment().add(3, 'days').format()
        })
        if (activationReguest) {
            await sendEmail(createdUser["email"], "Email megerősítés",
                confirmationEmail(`${process.env.CLIENT_URL}/aktivalas/${userId}/${verificationCode}`)
            )
            createdUser.password = ""
            logger.info('Sikeres regisztráció', { user: 'System', data: JSON.stringify(createdUser) })
            return res.status(201).json({ message: 'success', data: {} })

        } else {
            logger.error(`Sikertelen regisztráció! Execeptions: Kérés nem lett hozzáadva!`, { user: 'System', data: JSON.stringify(error) })
            return res.status(400).json({ message: 'EmailIsNotSend', data: { error } })
        }
    } catch (error) {
        logger.error("[SERVER] Hiba történt regisztráció során!", { user: 'System', data: JSON.stringify(error) })
        return res.status(500).json({ message: 'error', data: { error } })
    }
}

exports.signin = async (req, res) => {
    const { value, error } = authSignInValidate(req.body)
    if (error) {
        req.body.password = ""
        logger.warn(`Sikertelen bejelentkezés! Exception: ${error.details[0].message}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(422).json({ message: error.details[0].message, data: {} })
    }
    const emailIsExist = await Users.findOne({ email: value.email })
    if (!emailIsExist) {
        req.body.password = ""
        logger.warn(`Sikertelen bejelentkezés! Exception: Felhasználó nem létezik! Email: ${value.email}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(409).json({ message: 'error', data: {} })
    }
    if (!emailIsExist.isActive) {
        req.body.password = ""
        logger.warn(`Sikertelen bejelentkezés! Exception: Felhasználó nincs aktiválva! Email: ${value.email}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(403).json({ message: 'Forbidden', data: {} })
    }
    if (await bcrypt.compare(value.password, emailIsExist.password)) {
        try {
            const token = jwt.sign({
                userId: emailIsExist.id,
                email: emailIsExist.email,
                roles: emailIsExist.roles
            }, process.env.JWT_SECRET)

            emailIsExist.password = ""
            logger.info('Sikeres bejelentkezés!', { user: 'System', data: JSON.stringify(emailIsExist) })
            return res.status(200).json({ message: 'success', data: { token: token } })
        } catch (error) {
            logger.error("[SERVER] Hiba történt bejelentkezés során!", { user: 'System', data: JSON.stringify(error) })
            return res.status(500).json({ message: 'error', data: { error } })
        }
    } else {
        req.body.password = ""
        logger.warn(`Sikertelen bejelentkezés! Exception: Jelszó nem egyezik! Email: ${value.email}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(409).json({ message: 'error', data: {} })
    }

}

exports.confirmEmail = async (req, res) => {
    try {
        const { verificationCode, userId } = req.body
        if (!verificationCode || !userId) {
            logger.warn(`Sikertelen email megerősítés! Exception: Nem találhatóak az adatok!`, {
                user: 'System',
                data: JSON.stringify(req.body)
            })
            return res.status(422).json({ message: 'MissingData', data: {} })
        }
        const isValidCode = await EmailConfirmation.findOne({ verificationCode: verificationCode, userId: userId, isActive: true, category: 'email' })
        if (!isValidCode) {
            logger.warn(`Sikertelen email megerősítés! Exception: Nem létezik ilyen megerősítés a rendszerben!`, {
                user: 'System',
                data: JSON.stringify(req.body)
            })
            return res.status(404).json({ message: 'NotValidCode', data: [] })
        }
        if (moment(isValidCode.expireDate).diff(moment(), 'days') < 1) {
            logger.warn(`Sikertelen email megerősítés! Exception: Lejárt a megerősítési kód!`, {
                user: 'System',
                data: JSON.stringify(isValidCode)
            })
            return res.status(409).json({ message: 'CodeIsExpired', data: [] })
        }
        const isExistsUser = await Users.findOne({ _id: isValidCode.userId, isActive: false })
        if (!isExistsUser) {
            logger.warn(`Sikertelen email megerősítés! Exception: Nem található a felhasználó!`, {
                user: 'System',
                data: JSON.stringify(isValidCode)
            })
            return res.status(404).json({ message: 'UserNotFound', data: [] })
        }
        isExistsUser.isActive = true
        await isExistsUser.save()

        isValidCode.isActive = false
        await isValidCode.save()

        isExistsUser.password = ""
        logger.info('Sikeres email megerősítés!', { user: 'System', data: JSON.stringify(isExistsUser) })
        return res.status(202).json({ message: "success", data: {} })
    } catch (error) {
        logger.error("[SERVER] Hiba történt email megerősítés során!", {
            user: 'System',
            data: JSON.stringify(error)
        })
        return res.status(500).json({ message: '', data: {} })
    }
}

exports.isValidToken = async (req, res) => {
    const { token } = req.body
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(409).json({ message: "TokenIsExpired", data: {} })
            } else {
                if (decoded.exp * 1000 < Date.now()) {
                    return res.status(409).json({ message: "TokenIsExpired", data: {} })
                }
            }
            return res.status(200).json({ message: "Valid", data: {} })
        })
    } else {
        return res.status(404).json({ message: "NotFound", data: {} })
    }
}
