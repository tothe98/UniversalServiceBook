const mongoose = require('mongoose')

const DesignTypeSchema = new mongoose.Schema({
    designType: {
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
        collection: 'DesignTypes'
    })

mongoose.model('DesignTypes', DesignTypeSchema)