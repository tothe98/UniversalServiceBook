const mongoose = require('mongoose')

const VehiclesSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    _manufacturer: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    _model: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    _fuel: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    _driveType: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    _designType: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    _transmission: {
        type: mongoose.Types.ObjectId,
        required: true
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
    pictures: {
        tpye: [mongoose.Types.ObjectId],
        required: false,
        default: [""]
    },
    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        collection: 'Vehicles'
    })

mongoose.model('Vehicles', VehiclesSchema)