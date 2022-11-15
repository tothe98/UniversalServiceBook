const mongoose = require('mongoose')

const VehicleTypeSchema = new mongoose.Schema({
    vehicleType: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        collection: 'VehicleTypes'
    })

mongoose.model('VehicleTypes', VehicleTypeSchema)