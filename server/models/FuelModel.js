const mongoose = require('mongoose')

const FuelSchema = new mongoose.Schema({
    fuel: {
        type: mongoose.Types.String,
        required: true
    },
    isActive: {
        type: mongoose.Types.Boolean,
        default: true
    }
},
    {
        collection: 'Fuels'
    })

mongoose.model('Fuels', FuelSchema)