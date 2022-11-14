const mongoose = require('mongoose')

const VehicleTypeSchema = new mongoose.Schema({
    vehicleType: {
        type: mongoose.Types.String,
        required: true
    },
    isActive: {
        type: mongoose.Types.Boolean,
        default: true
    }

},
    {
        collection: 'VehicleTypes'
    })

mongoose.model('VehicleTypes', VehicleTypeSchema)