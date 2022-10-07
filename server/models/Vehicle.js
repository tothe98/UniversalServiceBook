const mongoose = require('mongoose')

const VehiclesSchema = new mongoose.Schema({
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
        type: String,
        default:""
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
    color: {
        type: String,
        default: ""
    },
    picture: {
        type: String,
        default: ""
    },
    isDelete: {
        type: Boolean,
        default: false
    }

},
    {
        collection: 'VehiclesInfo'
    })

mongoose.model('VehiclesInfo', VehiclesSchema)