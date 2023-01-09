const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require("../core/Mailer")
const confirmationEmail = require('../core/MailViews')
require('../models/UserModel')
require('../models/PictureModel')

const fs = require("fs")
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads/' + req.userId + '/')) {
            fs.mkdirSync('uploads/' + req.userId + '/')
            if (!fs.existsSync('uploads/' + req.userId + '/avatar/')) {
                fs.mkdirSync('uploads/' + req.userId + '/avatar/')
            }
        }
        cb(null, 'uploads/' + req.userId + '/avatar/')
        rmDir('uploads/' + req.userId + '/avatar/', false)
    },
    filename: function (req, file, cb) {
        cb(null, require('crypto').createHash('md5').update(new Date().toISOString() + file.originalname).digest("hex") + "." + file.mimetype.split("/")[1]);
    },
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).fields([
    {
        name: "picture",
        maxCount: 1
    }
])

const rmDir = async function (dirPath, removeSelf) {
    const Pictures = mongoose.model('Pictures')
    if (removeSelf === undefined)
        removeSelf = true;
    try { var files = fs.readdirSync(dirPath); }
    catch (e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {
                console.log(filePath);
                const pictureOnDB = await Pictures.findOneAndUpdate({ picture: filePath.replaceAll('//', '/').replaceAll('\\', '/') }, { isDelete: true });
                console.log(pictureOnDB);
                fs.unlinkSync(filePath);
            }
            else
                rmDir(filePath);
        }
    if (removeSelf)
        fs.rmdirSync(dirPath);
};

exports.getUser = async (req, res) => {
    try {
        const User = mongoose.model('UserInfo')
        const resUser = await User.findOne({ _id: req.userId }).populate("_profilImg")
        req.email = resUser.getUserData.email
        res.status(200).json({ message: '', data: { user: resUser.getUserData } });
    } catch (err) {
        res.status(400).json({ message: 'error', data: { error: err } })
    }
}

exports.updateUser = async (req, res) => {
    upload(req, res, async function (err) {
        const { lname, fname, phone, home, oldPassword, newPassword } = req.body
        const User = mongoose.model('UserInfo')

        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'LimitFileCount', data: { error: err } })
        }

        let uploadImg = undefined
        const updateUser = await User.findOne({ _id: req.userId })
        if (req.files?.picture) {
            const Picture = mongoose.model('Pictures')
            await Picture.create({
                picture: req.files.picture[0].path.replaceAll('\\', '/'),
                _uploadFrom: req.userId
            }).then((e) => {
                uploadImg = e['_id'].toString()
            }).catch((err) => {
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
    })

}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(422).json({ message: 'EmailIsEmpty', data: {} })
    }
    try {
        const User = mongoose.model('UserInfo')
        const findUser = await User.findOne({ email: email })
        if (findUser) {
            const token = jwt.sign({ userId: findUser._id, email: findUser.email }, process.env.JWT_SECRET, { expiresIn: '15m' })

            await sendEmail(findUser.email, "Elfelejtett jelszó",
                confirmationEmail(`http://127.0.0.1:8080/api/v1/newPassword/${token}`)
            )
            return res.status(200).json({ message: 'EmailIsSent', data: {} })
        } else {
            return res.status(404).json({ message: 'UserIsNotFound', data: { error } })
        }
    } catch (error) {
        return res.status(500).json({ message: 'error', data: { error } })
    }
}

exports.newPassword = async (req, res) => {
    const { token, password, cpassword } = req.body

    if (!token || !password || !cpassword) {
        return res.status(422).json({ message: 'FieldsMustBeField', data: {} })
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(409).json({ message: 'TokenIsExpired', data: [] })
        }
        try {
            if (password === cpassword) {
                const User = mongoose.model('UserInfo')
                const updateUser = await User.findOne({ _id: decoded.userId, email: decoded.email })
                const salt = bcrypt.genSaltSync(10)
                const updatePsw = bcrypt.hashSync(password, salt)
                updateUser.password = updatePsw
                await updateUser.save()
                return res.status(201).json({ message: 'success', data: {} })
            } else {
                return res.status(409).json({ message: 'PasswordIsNotEqual', data: [] })
            }
        } catch (error) {
            return res.status(500).json({ message: 'error', data: { error } })
        }
    })
}