const fs = require("fs")
const multer = require('multer')
const mongoose = require("mongoose");
const moment = require("moment/moment");
require('../models/WorkShopModel')
require('../models/PictureModel')

const rmDir = async (dirPath, removeSelf) => {
    const Pictures = mongoose.model('Pictures')
    if (removeSelf === undefined)
        removeSelf = true;
    try {
        var files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {
                const pictureOnDB = await Pictures.findOneAndUpdate({picture: filePath.replaceAll('//', '/').replaceAll('\\', '/')}, {isDelete: true});
                fs.unlinkSync(filePath);
            } else
                rmDir(filePath);
        }
    if (removeSelf)
        fs.rmdirSync(dirPath);
};

const deleteFiles = (files) => {
    if (files != undefined) {
        if (Array.isArray(files)) {
            files.forEach(file => {
                try {
                    fs.unlinkSync((file.path.replaceAll('\\', '/')))
                } catch (err) {
                    return;
                }
            })
        } else {
            try {
                fs.unlinkSync((files.path.replaceAll('\\', '/')))
            } catch (err) {
                return;
            }
        }
    }
}

const mkDir = (path) => {
    fs.mkdirSync(path, {recursive: true})
}

const isExistsAndMake = (path) => {
    if (!fs.existsSync(path)) {
        mkDir(path)
    }
}

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const fileName = (req, file, cb) => {
    cb(null, require('crypto').createHash('md5').update(new Date().toISOString() + file.originalname).digest("hex") + "." + file.mimetype.split("/")[1]);
}

const errorHandle = (err, next) => {
    console.log('error', err);
    next(err);
}

const storageServiceEntry = multer.diskStorage({
    destination: async function (req, file, cb) {
        const Workshops = mongoose.model('WorkShops')
        const workshop = await Workshops.findOne({$or: [{employees: req.userId}, {_owner: req.userId}]})
        const path = 'uploads/serviceEntries/' + workshop._id + '/' + moment().format('YYYYMMDD') + '/'
        isExistsAndMake(path)
        cb(null, path)
    },
    filename: fileName,
    onError: errorHandle
})

const storageVehicle = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = 'uploads/' + req.userId + '/cars/'
        isExistsAndMake(path)
        cb(null, path)
    }, filename: fileName
    , onError: errorHandle
})

const storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = 'uploads/' + req.userId + '/avatar/'
        isExistsAndMake(path)
        cb(null, path)
        rmDir('uploads/' + req.userId + '/avatar/', false)
    },
    filename: fileName,
    onError: errorHandle,
})
const uploadUser = multer({
    storage: storageUser,
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

const uploadVehicle = multer({
    storage: storageVehicle,
    limits: {
        fileSize: 1024 * 1024 * 5
    }, fileFilter: fileFilter
}).fields([{
    name: "picture", maxCount: 10
}, {
    name: "preview", maxCount: 1
}])


const uploadServiceEntry = multer({
    storage: storageServiceEntry,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).fields([
    {
        name: "pictures",
        maxCount: 10
    },
])

module.exports = {
    deleteFiles,
    rmDir,
    mkDir,
    uploadVehicle,
    uploadUser,
    uploadServiceEntry
}