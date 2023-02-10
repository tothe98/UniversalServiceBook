const mongoose = require('mongoose')

const ManufactureSchema = new mongoose.Schema({
    manufacture: {
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
        collection: 'Manufactures'
    })

mongoose.model('Manufactures', ManufactureSchema)