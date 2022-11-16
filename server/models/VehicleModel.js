const mongoose = require('mongoose')

const VehiclesSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'UserInfo'
    },
    _manufacturer: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Manufactures',
    },
    _model: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Models'
    },
    _fuel: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Fuels'
    },
    _driveType: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'DriveTypes'
    },
    _designType: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'DesignTypes'
    },
    _transmission: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Transmissions'
    },
    licenseNumber: {
        type: String,
        required: false,
        unique: true
    },
    vin: {
        type: String,
        required: true,
        unique: true
    },
    vintage: {
        type: Date,
        required: true
    },
    ownMass: {
        type: Number,
        required: false
    },
    fullMass: {
        type: Number,
        required: false
    },
    cylinderCapacity: {
        type: Number,
        required: false
    },
    performance: {
        type: Number,
        required: false
    },
    nod: {
        type: String,
        required: false
    },
    validityTechnicalExam: {
        type: Date,
        required: true
    },
    mileage: {
        type: Number,
        required: false
    },
    pictures: [{
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Pictures'
    }],
    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        collection: 'Vehicles'
    })

mongoose.model('Vehicles', VehiclesSchema)