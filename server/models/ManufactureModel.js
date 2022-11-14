const mongoose = require('mongoose')

const ManufactureSchema = new mongoose.Schema({
    manufacture: {
        type: mongoose.Types.String,
        required: true
    },
    _vehicleType: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isActive: {
        type: mongoose.Types.Boolean,
        default: true
    }

},
    {
        collection: 'Manufactures'
    })

mongoose.model('Manufactures', ManufactureSchema)