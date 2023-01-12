const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require("../core/Mailer")
const confirmationEmail = require('../core/MailViews')
const ROLES = require('../core/Role')
const {Users} = require('../core/DatabaseInitialization')


exports.signup = async (req, res) => {
    const {fname, lname, email, password, phone} = req.body

    if (!password) {
        return res.status(400).json({message: 'error', data: {}})
    }

    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    try {
        const isExistEmail = await Users.findOne({email: email})

        if (isExistEmail) {
            return res.status(409).json({message: 'exist', data: {}})
        }
        let createdUser = await User.create({
            fName: fname,
            lName: lname,
            email: email,
            phone: phone,
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
        return res.status(400).json({message: 'error', data: {error}})
    }
}

exports.signin = async (req, res) => {
    const {email, password} = req.body

    const emailIsExist = await Users.findOne({email})
    if (!emailIsExist) {
        return res.status(400).json({message: 'error', data: {}})
    }
    if (!emailIsExist.isActive) {
        return res.status(403).json({message: 'notActive', data: {}})
    }
    if (await bcrypt.compare(password, emailIsExist.password)) {
        const token = jwt.sign({
            userId: emailIsExist.id,
            email: emailIsExist.email,
            roles: emailIsExist.roles
        }, process.env.JWT_SECRET)

        if (res.status(200)) {
            return res.status(200).json({message: 'success', data: {token: token}})
        } else {
            return res.status(400).json({message: 'error', data: {token: null}})
        }
    } else {
        res.status(400).json({message: 'error', data: {}})
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