const mongoose = require('mongoose')

const WorkShopSchema = new mongoose.Schema({
    name: {
        type: mongoose.Types.String,
        required: true
    },
    country: {
        type: mongoose.Types.String,
        required: true
    },
    town: {
        type: mongoose.Types.String,
        required: true
    },
    address: {
        type: mongoose.Types.String,
        required: true
    },
    _owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    employees: {
        type: [mongoose.Types.ObjectId],
        required: false,
        default: [""]
    },
    isActive: {
        type: mongoose.Types.Boolean,
        default: false
    },
    createdAt: {
        type: mongoose.Types.Date,
        default: Date.now,
        required: true
    }

},
    {
        collection: 'WorkShops'
    })

mongoose.model('WorkShops', WorkShopSchema)