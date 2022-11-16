const mongoose = require('mongoose')

const ServiceEntrySchema = new mongoose.Schema({
    _vehicle: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Vehicles'
    },
    _workshop: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Workshops'
    },
    description: {
        type: String,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    pictures: [{
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Pictures'

    }],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        required: false
    },
    isDelete: {
        type: Boolean,
        default: false
    },

},
    {
        collection: 'ServiceEntries'
    })

mongoose.model('ServiceEntries', ServiceEntrySchema)