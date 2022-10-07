const mongoose = require('mongoose')

const VeichelsSchema = new mongoose.Schema({
    UId: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    licenseNum: {
        type: String,
        required: true,
        unique: true
    },
    vin: {
        type: String,
        required: true,
        unique: true
    },
    engine: {
        type: String
    },
    fuel: {
        type: String,
        enum: ['', 'Petrol', 'Diesel', 'Biodiesel', 'Gas', 'Electric'],
        default: ''
    },
    gearbox: {
        type: String,
        enum: ['', 'Manual', 'Automatic', 'Sequential'],
        default: ''
    },
    picture: {
        type: Binary
    },
    isDelete: {
        type: Boolean,
        default: false
    }

},
    {
        collection: 'VeichelsInfo'
    })

mongoose.model('VeichelsInfo', VeichelsSchema)