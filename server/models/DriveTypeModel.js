const mongoose = require('mongoose')

const DriveTypeSchema = new mongoose.Schema({
    driveType: {
        type: String,
        required: true
    },
    _vehicleType: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'VehicleTypes'
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