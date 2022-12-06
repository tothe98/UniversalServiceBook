const mongoose = require('mongoose')

const TransmissionSchema = new mongoose.Schema({
    transmission: {
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
        collection: 'Transmissions'
    })

mongoose.model('Transmissions', TransmissionSchema)