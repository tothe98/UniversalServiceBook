const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('../models/UserModel')


exports.signup = async (req, res) => {
    const User = mongoose.model('UserInfo')
    const { fname, lname, email, password, phone } = req.body

    if (!password) {
        return res.status(400).json({ message: 'error', data: {} })
    }

    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    try {
        const isExistEmail = await User.findOne({ email: email })

        if (isExistEmail) {
            return res.status(409).json({ message: 'exist', data: {} })
        }
        await User.create({
            fName: fname,
            lName: lname,
            email: email,
            phone: phone,
            password: encryptedPassword
        })
        res.status(201).json({ message: 'success', data: {} })
    } catch (error) {
        res.status(400).json({ message: 'error', data: { error } })
    }
}

exports.signin = async (req, res) => {
    const User = mongoose.model('UserInfo')
    const { email, password } = req.body

    const emailIsExist = await User.findOne({ email })
    if (!emailIsExist) {
        return res.status(400).json({ message: 'error', data: {} })
    }
    if (!emailIsExist.isActive) {
        return res.status(403).json({ message: 'notActive', data: {} })
    }
    if (await bcrypt.compare(password, emailIsExist.password)) {
        const token = jwt.sign({ userId: emailIsExist.id, email: emailIsExist.email, isAdmin: emailIsExist.isAdmin, workShop:emailIsExist._workshop}, process.env.JWT_SECRET)

        if (res.status(200)) {
            return res.status(200).json({ message: 'success', data: { token: token } })
        } else {
            return res.status(400).json({ message: 'error', data: { token: null } })
        }
    } else {
        res.status(400).json({ message: 'error', data: {} })
    }

}