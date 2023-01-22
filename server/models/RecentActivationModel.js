const mongoose = require('mongoose')

const RecentActivationSchema = new mongoose.Schema({
    workshop: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    },
    vehicle: {
        type: String,
        required: false
    },
    vin: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'UserInfo'
    },
    vehicleId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Vehicles'
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    expireDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        collection: 'RecentActivations'
    })

mongoose.model('RecentActivations', RecentActivationSchema)