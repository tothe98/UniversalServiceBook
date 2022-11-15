const mongoose = require('mongoose')

const DriveTypeSchema = new mongoose.Schema({
    driveType: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        collection: 'DriveTypes'
    })

mongoose.model('DriveTypes', DriveTypeSchema)