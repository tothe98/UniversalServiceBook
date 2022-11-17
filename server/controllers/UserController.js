const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('../models/UserModel')
require('../models/PictureModel')

exports.getUser = async (req, res) => {
    try {
        const User = mongoose.model('UserInfo')
        const resUser = await User.findOne({ _id: req.userId }).populate("_profilImg")
        req.email = resUser.getUserData.email
        res.status(200).json({ message: '', data: { user: resUser.getUserData } });
    } catch (err) {
        res.stats(400).json({ message: 'error', data: { error: err } })
    }
}

exports.updateUser = async (req, res) => {
    const User = mongoose.model('UserInfo')
    console.log(req.body)
    const { lname, fname, picture, phone, home, oldPassword, newPassword } = req.body

    const updateUser = await User.findOne({ _id: req.userId })

    let uploadImg = undefined

    if (picture) {
        const Picture = mongoose.model('Pictures')
        await Picture.create({
            picture: picture,
            _uploadFrom: req.userId
        }).then((e) => {
            uploadImg = e['_id'].toString()
        }).catch((e) => {
            return res.status(400).json({ message: 'error', data: { error: err } })
        })
    }

    let updatePsw = undefined

    if (oldPassword && newPassword) {
        if (await bcrypt.compare(oldPassword, updateUser.password)) {
            const salt = bcrypt.genSaltSync(10)
            updatePsw = bcrypt.hashSync(newPassword, salt)
        } else {
            return res.status(40).json({ message: 'passwordNotCorrect', data: {} })
        }
    }

    updateUser._profilImg = uploadImg ? uploadImg : updateUser._profilImg
    updateUser.password = updatePsw ? updatePsw : updateUser.password
    updateUser.fName = fname ? fname : updateUser.fName
    updateUser.lName = lname ? lname : updateUser.lName
    updateUser.phone = phone ? phone : updateUser.phone
    updateUser.home = home ? home : updateUser.home
    try {
        await updateUser.save()
    } catch (err) {
        return res.status(400).json({ message: 'error', data: { error: err } })
    }
    res.status(200).json({ message: 'OK', data: {} })
}