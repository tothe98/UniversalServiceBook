const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require("../core/Mailer")
const confirmationEmail = require('../core/MailViews')
const ROLES = require('../core/Role')
const {Users} = require('../core/DatabaseInitialization')
const {authSignUpValidate, authSignInValidate} = require("../models/ValidationSchema");
const {logger} = require("../config/logger");


exports.signup = async (req, res) => {
    const {value, error} = authSignUpValidate(req.body)
    if (error) {
        req.body.password = ""
        logger.warn(`Sikertelen regisztráció! Exception: ${error.details[0].message}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(422).json({message: error.details[0].message, data: {}})
    }

    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(value.password, salt);

    try {
        const isExistEmail = await Users.findOne({email: value.email})

        if (isExistEmail) {
            req.body.password = ""
            logger.warn(`Sikertelen regisztráció! Exception: Felhasználó már létezik! Email: ${value.email}`, {
                user: 'System',
                data: JSON.stringify(req.body)
            })
            return res.status(409).json({message: 'EmailIsExists', data: {}})
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

        const token = jwt.sign({
            userId: createdUser["_id"],
            email: createdUser["email"]
        }, process.env.JWT_SECRET, {expiresIn: '7d'})

        await sendEmail(createdUser["email"], "Email megerősítés",
            confirmationEmail(`http://127.0.0.1:3000/aktivalas/${token}`)
        )
        createdUser.password = ""
        logger.info('Sikeres regisztráció', {user: 'System', data: JSON.stringify(createdUser)})
        return res.status(201).json({message: 'success', data: {}})
    } catch (error) {
        logger.error("[SERVER] Hiba történt regisztráció során!", {user: 'System', data: JSON.stringify(error)})
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.signin = async (req, res) => {
    const {value, error} = authSignInValidate(req.body)
    if (error) {
        req.body.password = ""
        logger.warn(`Sikertelen bejelentkezés! Exception: ${error.details[0].message}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(422).json({message: error.details[0].message, data: {}})
    }
    const emailIsExist = await Users.findOne({email: value.email})
    if (!emailIsExist) {
        req.body.password = ""
        logger.warn(`Sikertelen bejelentkezés! Exception: Felhasználó nem létezik! Email: ${value.email}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(422).json({message: 'error', data: {}})
    }
    if (!emailIsExist.isActive) {
        req.body.password = ""
        logger.warn(`Sikertelen bejelentkezés! Exception: Felhasználó nincs aktiválva! Email: ${value.email}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(403).json({message: 'Forbidden', data: {}})
    }
    if (await bcrypt.compare(value.password, emailIsExist.password)) {
        try {
            const token = jwt.sign({
                userId: emailIsExist.id,
                email: emailIsExist.email,
                roles: emailIsExist.roles
            }, process.env.JWT_SECRET)

            emailIsExist.password = ""
            logger.info('Sikeres bejelentkezés!', {user: 'System', data: JSON.stringify(emailIsExist)})
            return res.status(200).json({message: 'success', data: {token: token}})
        } catch (error) {
            logger.error("[SERVER] Hiba történt bejelentkezés során!", {user: 'System', data: JSON.stringify(error)})
            return res.status(500).json({message: 'error', data: {error}})
        }
    } else {
        req.body.password = ""
        logger.warn(`Sikertelen bejelentkezés! Exception: Jelszó nem egyezik! Email: ${value.email}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(422).json({message: 'error', data: {}})
    }

}

exports.confirmEmail = async (req, res) => {
    const {token} = req.params
    if (!token) {
        logger.warn(`Sikertelen email megerősítés! Exception: Nem található a token!`, {
            user: 'System',
            data: ''
        })
        return res.status(404).json({message: 'TokenIsNotFound', data: []})
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                logger.warn(`Sikertelen email megerősítés! Exception: Lejárt a token!`, {
                    user: 'System',
                    data: ''
                })
                return res.status(409).json({message: 'TokenIsExpired', data: []})
            } else {
                try {
                    const findUser = await Users.findOne({_id: decoded.userId, email: decoded.email})
                    if (findUser) {
                        findUser.isActive = true
                        await findUser.save()
                        findUser.password = ""
                        logger.info('Sikeres email megerősítés!', {user: 'System', data: JSON.stringify(findUser)})
                        return res.status(202).json({message: "success", data: []})
                    } else {
                        logger.warn(`Sikertelen email megerősítés! Exception: Nem található a felhasználó!`, {
                            user: 'System',
                            data: ''
                        })
                        return res.status(404).json({message: 'UserIsNotFound', data: []})
                    }
                } catch (error) {
                    logger.error("[SERVER] Hiba történt email megerősítés során!", {
                        user: 'System',
                        data: JSON.stringify(error)
                    })
                    return res.status(500).json({message: '', data: {}})
                }
            }
        })
    }
}

exports.isValidToken = async (req, res) => {
    const {token} = req.params
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(409).json({message: "TokenIsExpired", data: {}})
            } else {
                if (decoded.exp * 1000 < Date.now()) {
                    return res.status(409).json({message: "TokenIsExpired", data: {}})
                }
            }
            return res.status(200).json({message: "Valid", data: {}})
        })
    } else {
        return res.status(404).json({message: "NotFound", data: {}})
    }
}