const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require("../core/Mailer")
const confirmationEmail = require('../core/MailViews')
const ROLES = require('../core/Role')
const {Users} = require('../core/DatabaseInitialization')
const {authSignUpValidate, authSignInValidate} = require("../models/ValidationSchema");


exports.signup = async (req, res) => {
    const {value, error} = authSignUpValidate(req.body)
    if (error) {
        return res.status(422).json({message: error.details[0].message, data: {}})
    }

    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(value.password, salt);

    try {
        const isExistEmail = await Users.findOne({email: value.email})

        if (isExistEmail) {
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
        return res.status(201).json({message: 'success', data: {}})

    } catch (error) {
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.signin = async (req, res) => {
    const {value, error} = authSignInValidate(req.body)
    if (error) {
        return res.status(422).json({message: error.details[0].message, data: {}})
    }
    const emailIsExist = await Users.findOne({email: value.email})
    if (!emailIsExist) {
        return res.status(422).json({message: 'error', data: {}})
    }
    if (!emailIsExist.isActive) {
        return res.status(403).json({message: 'Forbidden', data: {}})
    }
    if (await bcrypt.compare(value.password, emailIsExist.password)) {
        try {
            const token = jwt.sign({
                userId: emailIsExist.id,
                email: emailIsExist.email,
                roles: emailIsExist.roles
            }, process.env.JWT_SECRET)

            return res.status(200).json({message: 'success', data: {token: token}})

        } catch (err) {
            return res.status(500).json({message: 'error', data: {err}})
        }
    } else {
        res.status(422).json({message: 'error', data: {}})
    }

}

exports.confirmEmail = async (req, res) => {
    const {token} = req.params
    if (!token) {
        res.status(404).json({message: 'TokenIsNotFound', data: []})
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(409).json({message: 'TokenIsExpired', data: []})
            } else {
                try {
                    const findUser = await Users.findOne({_id: decoded.userId, email: decoded.email})
                    if (findUser) {
                        findUser.isActive = true
                        await findUser.save()
                        return res.status(202).json({message: "success", data: []})
                    } else {
                        return res.status(404).json({message: 'UserIsNotFound', data: []})
                    }
                } catch (error) {
                    return res.status(500).json({message: '', data: []})
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