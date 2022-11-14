const mongoose = require('mongoose')

const DriveTypeSchema = new mongoose.Schema({
    driveType: {
        type: mongoose.Types.String,
        required: true
    },
    isActive: {
        type: mongoose.Types.Boolean,
        default: true
    }

},
    {
        collection: 'DriveTypes'
    })

mongoose.model('DriveTypes', DriveTypeSchema)