const mongoose = require('mongoose')

const DesignTypeSchema = new mongoose.Schema({
    designType: {
        type: mongoose.Types.String,
        required: true
    },
    isActive: {
        type: mongoose.Types.Boolean,
        default: true
    }

},
    {
        collection: 'DesignTypes'
    })

mongoose.model('DesignTypes', DesignTypeSchema)