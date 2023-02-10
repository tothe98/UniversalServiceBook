const mongoose = require('mongoose')
const moment = require('moment')

const EmailConfirmationSchema = new mongoose.Schema({
    verificationCode: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'UserInfo'
    },
    expireDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category:{
        type: String,
        required: true
    }
},
    {
        collection: 'EmailConfirmation'
    })

mongoose.model('EmailConfirmation', EmailConfirmationSchema)