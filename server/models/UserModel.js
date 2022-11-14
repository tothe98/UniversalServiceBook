const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fName: {
        type: mongoose.Types.String,
        required: true
    },
    lName: {
        type: mongoose.Types.String,
        required: true
    },
    email: {
        type: mongoose.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.Types.String,
        required: true
    },
    _profilImg:{
        type: mongoose.Types.ObjectId
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
    isActive: {
        type: mongoose.Types.Boolean,
        default: false
    },
    isAdmin: {
        type: mongoose.Types.Boolean,
        default: false
    }

},
    {
        collection: 'UserInfo'
    })

mongoose.model('UserInfo', UserSchema)