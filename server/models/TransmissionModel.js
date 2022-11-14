const mongoose = require('mongoose')

const TransmissionSchema = new mongoose.Schema({
    transmission: {
        type: mongoose.Types.String,
        required: true
    },
    isActive: {
        type: mongoose.Types.Boolean,
        default: true
    }

},
    {
        collection: 'Transmissions'
    })

mongoose.model('Transmissions', TransmissionSchema)