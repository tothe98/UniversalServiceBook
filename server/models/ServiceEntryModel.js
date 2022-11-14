const mongoose = require('mongoose')

const ServiceEntrySchema = new mongoose.Schema({
    _vehicle: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    _workshop: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    description: {
        type: mongoose.Types.String,
        required: true
    },
    mileage: {
        type: mongoose.Types.Number,
        required: true
    },
    pictures: {
        type: [mongoose.Types.ObjectId],
        required: false,
        default: [""]
    },
    createdAt: {
        type: mongoose.Types.Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: mongoose.Types.Date,
        required: false
    },
    isDelete: {
        type: mongoose.Types.Boolean,
        default: false
    },

},
    {
        collection: 'ServiceEntries'
    })

mongoose.model('ServiceEntries', ServiceEntrySchema)