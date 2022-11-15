const mongoose = require('mongoose')

const FuelSchema = new mongoose.Schema({
    fuel: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        collection: 'Fuels'
    })

mongoose.model('Fuels', FuelSchema)