const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    WId: {
        type: String,
        required: false
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
        required: true
    },
    email: {
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
    }

},
    {
        collection: 'UserInfo'
    })

mongoose.model('UserInfo', UserSchema)