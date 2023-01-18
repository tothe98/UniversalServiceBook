const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require("../core/Mailer")
const confirmationEmail = require('../core/MailViews')
const {uploadUser} = require("../core/FilesManagment");
const multer = require('multer')
const {Users, Pictures} = require("../core/DatabaseInitialization");
const {newPasswordValidate} = require("../models/ValidationSchema");
const {logger} = require("../config/logger");


exports.getUser = async (req, res) => {
    try {
        const resUser = await Users.findOne({_id: req.userId}).populate("_profilImg")
        req.email = resUser.getUserData.email
        return res.status(200).json({message: '', data: {user: resUser.getUserData}});
    } catch (error) {
        logger.error("[SERVER] Hiba történt a user adatok lekérésénél!", {
            user: req.userId,
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.updateUser = async (req, res) => {
    uploadUser(req, res, async function (err) {
        const {lName, fName, phone, home, oldPassword, newPassword} = req.body
        try {
            if (err instanceof multer.MulterError) {
                logger.warn(`Sikertelen user adatok frissítése! Exception: Kép száma elérte a maximumot!`, {
                    user: req.userId,
                    data: JSON.stringify(err)
                })
                return res.status(422).json({message: 'LimitFileCount', data: {error: err}})
            }

            let uploadImg = undefined
            const updateUser = await Users.findOne({_id: req.userId})
            if (req.files?.picture) {
                await Pictures.create({
                    picture: req.files.picture[0].path.replaceAll('\\', '/'),
                    _uploadFrom: req.userId
                }).then((e) => {
                    uploadImg = e['_id'].toString()
                }).catch((err) => {
                    logger.error("[SERVER] Hiba történt a user adatok frissítésnél a képfeltöltésénél!", {
                        user: req.userId,
                        data: JSON.stringify(err)
                    })
                    return res.status(500).json({message: 'error', data: {error: err}})
                })
            }

            let updatePsw = undefined

            if (oldPassword && newPassword) {
                if (await bcrypt.compare(oldPassword, updateUser.password)) {
                    const salt = bcrypt.genSaltSync(10)
                    updatePsw = bcrypt.hashSync(newPassword, salt)
                } else {
                    updateUser.password = ""
                    logger.warn(`Sikertelen user adatok frissítése! Exception: A jelszó nem egyezik!`, {
                        user: req.userId,
                        data: JSON.stringify(updateUser)
                    })
                    return res.status(422).json({message: 'passwordNotCorrect', data: {}})
                }
            }

            updateUser._profilImg = uploadImg ? uploadImg : updateUser._profilImg
            updateUser.password = updatePsw ? updatePsw : updateUser.password
            updateUser.fName = fName ? fName : updateUser.fName
            updateUser.lName = lName ? lName : updateUser.lName
            updateUser.phone = phone ? phone : updateUser.phone
            updateUser.home = home ? home : updateUser.home

            await updateUser.save()
            updateUser.password = ""
            logger.info('Sikeres user adat frissítés!', {user: req.userId, data: JSON.stringify(updateUser)})
            return res.status(202).json({message: 'OK', data: {user: updateUser}})

        } catch (error) {
            logger.error("[SERVER] Hiba történt a user adatok frissítésénél!", {
                user: req.userId,
                data: JSON.stringify(error)
            })
            return res.status(500).json({message: 'error', data: {error}})
        }
    })

}

exports.forgotPassword = async (req, res) => {
    const {email} = req.body
    if (!email) {
        logger.warn(`Sikertelen elfelejtett jelszó kérés! Exception: Az email mező hiányzik!`, {
            user: 'System',
            data: ''
        })
        return res.status(422).json({message: 'EmailIsEmpty', data: {}})
    }
    try {
        const findUser = await Users.findOne({email: email})

        if (findUser) {
            const token = jwt.sign({
                userId: findUser._id,
                email: findUser.email
            }, process.env.JWT_SECRET, {expiresIn: '15m'})

            await sendEmail(findUser.email, "Elfelejtett jelszó",
                confirmationEmail(`http://127.0.0.1:8080/api/v1/newPassword/${token}`)
            )
            logger.info(`Sikeres elfelejtett jelszó kérés! Email: ${email}`, {user: 'System', data: ''})
            return res.status(200).json({message: 'EmailIsSent', data: {}})
        } else {
            logger.warn(`Sikertelen elfelejtett jelszó kérés! Exception: A felhasználó nem létezik! Email: ${email}`, {
                user: 'System',
                data: ''
            })
            return res.status(404).json({message: 'UserIsNotFound', data: {}})
        }
    } catch (error) {
        logger.error("[SERVER] Hiba történt az elfelejtett jelszó kérésnél!", {
            user: 'System',
            data: JSON.stringify(error)
        })
        return res.status(500).json({message: 'error', data: {error}})
    }
}

exports.newPassword = async (req, res) => {
    const {value, error} = newPasswordValidate(req.body)

    if (error) {
        logger.warn(`Sikertelen új jelszó létrehozás! Exception: ${error.details[0].message}`, {
            user: 'System',
            data: JSON.stringify(req.body)
        })
        return res.status(422).json({message: error.details[0].message, data: {}})
    }

    jwt.verify(value.token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            logger.warn(`Sikertelen új jelszó létrehozás! Exception: A token lejárt!`, {
                user: 'System',
                data: JSON.stringify(err)
            })
            return res.status(409).json({message: 'TokenIsExpired', data: {err}})
        }
        try {
            if (value.password === value.cpassword) {
                const updateUser = await Users.findOne({_id: decoded.userId, email: decoded.email})
                const salt = bcrypt.genSaltSync(10)
                const updatePsw = bcrypt.hashSync(value.password, salt)
                updateUser.password = updatePsw
                await updateUser.save()
                updateUser.password = ""
                logger.info(`Sikeres új jelszó létrehozás!`, {user: 'System', data: JSON.stringify(updateUser)})
                return res.status(201).json({message: 'success', data: {}})
            } else {
                logger.warn(`Sikertelen új jelszó létrehozás! Exception: A két jelszó nem egyezik!`, {
                    user: 'System',
                    data: ''
                })
                return res.status(422).json({message: 'PasswordIsNotEqual', data: {}})
            }
        } catch (error) {
            logger.error("[SERVER] Hiba történt a új jelszó létrehozásánál!", {
                user: 'System',
                data: JSON.stringify(error)
            })
            return res.status(500).json({message: 'error', data: {error}})
        }
    })
}