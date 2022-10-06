const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    WId: {
        type: String,
        required: false,
        default: ""
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now

    },
    isActive: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

},
    {
        collection: 'UserInfo'
    })

mongoose.model('UserInfo', UserSchema)