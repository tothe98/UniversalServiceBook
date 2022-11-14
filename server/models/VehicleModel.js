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
        type: mongoose.Types.String,
        required: false,
        unique: true
    },
    vin: {
        type: mongoose.Types.String,
        required: true,
        unique: true
    },
    vintage: {
        type: mongoose.Types.Date,
        required: true
    },
    ownMass: {
        type: mongoose.Types.Number,
        required: false
    },
    fullMass: {
        type: mongoose.Types.Number,
        required: false
    },
    cylinderCapacity: {
        type: mongoose.Types.Number,
        required: false
    },
    performance: {
        type: mongoose.Types.Number,
        required: false
    },
    nod: {
        type: mongoose.Types.String,
        required: false
    },
    validityTechnicalExam: {
        type: mongoose.Types.Date,
        required: true
    },
    mileage: {
        type: mongoose.Types.Number,
        required: false
    },
    pictures: {
        tpye: [mongoose.Types.ObjectId],
        required: false,
        default: [""]
    },
    isActive: {
        type: mongoose.Types.Boolean,
        default: true
    }

},
    {
        collection: 'Vehicles'
    })

mongoose.model('Vehicles', VehiclesSchema)