const mongoose = require('mongoose')
require('../models/UserModel')

exports.getUser = async (req, res) => {
    const User = mongoose.model('UserInfo')
    const resUser = await User.findOne({ _id: req.userId })

    res.status(200).json({ message: '', data: { user: resUser.getUserData } });
}