const mongoose = require('mongoose')

const WorkShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    _owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'UserInfo'
    },
    employees: {
        type: [mongoose.Types.ObjectId],
        required: false,
        default: [""]
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }

},
    {
        collection: 'WorkShops'
    })

mongoose.model('WorkShops', WorkShopSchema)