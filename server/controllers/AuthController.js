const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('../models/User')


exports.signup = async (req, res) => {
    const User = mongoose.model('UserInfo')
    const { fname, lname, username, email, password, } = req.body

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
            username: username,
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
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
        return res.status(400).json({ message: 'notExist' })
    }
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET)

        if (res.status(201)) {
            return res.status(201).json({ token: token })
        } else {
            return res.status(400).json({ token: null })
        }
    } else {
        res.status(400).json({ message: 'wrongPassword' })
    }

}