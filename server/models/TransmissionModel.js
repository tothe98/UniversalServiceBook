const mongoose = require('mongoose')

const TransmissionSchema = new mongoose.Schema({
    transmission: {
        type: String,
        required: true
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