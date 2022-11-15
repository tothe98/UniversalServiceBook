const mongoose = require('mongoose')

const DesignTypeSchema = new mongoose.Schema({
    designType: {
        type: String,
        required: true
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