const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('../models/UserModel')


exports.signup = async (req, res) => {
    const User = mongoose.model('UserInfo')
    const { fname, lname, email, password, } = req.body

    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(password, salt)

    try {
        const isExistEmail = await User.findOne({ email })
        const isExistUser = await User.findOne({ username })
        if (isExistUser || isExistEmail) {
            return res.status(409).json({ message: 'exist' }, { expries: '14s' })
        }
        await User.create({
            fname: fname,
            lname: lname,
            email: email,
            password: encryptedPassword
        })
        res.status(201).json({ message: 'success' })
    } catch (error) {
        res.status(400).json({ message: error })
    }
}

exports.signin = async (req, res) => {
    const User = mongoose.model('UserInfo')
    const { email, password } = req.body

    const emailIsExist = await User.findOne({ email })
    if (!emailIsExist) {
        return res.status(400).json({ message: 'notExist' })
    }
    if (!emailIsExist.isActive) {
        return res.status(403).json({ message: 'notActive' })
    }
    if (await bcrypt.compare(password, emailIsExist.password)) {
        const token = jwt.sign({ userId: emailIsExist.id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET)

        if (res.status(201)) {
            return res.status(201).json({ token: token })
        } else {
            return res.status(400).json({ token: null })
        }
    } else {
        res.status(400).json({ message: 'wrongPassword' })
    }

}