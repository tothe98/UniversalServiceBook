const mongoose = require('mongoose')
const ROLES = require('../core/Role')

const UserSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
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
    _profilImg: {
        type: mongoose.Types.ObjectId,
        ref: 'Pictures'
    },
    roles: [{
        type: Number,
        default: ROLES.User,
        required: true
    }],
    phone: {
        type: String,
        required: false
    },
    home: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        required: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
},
    {
        collection: 'UserInfo'
    })

UserSchema.virtual("getUserData").get(function () {
    return {
        "fName": this.fName, "lName": this.lName, "email": this.email,
        "phone": this.phone, "home": this.home,
        "roles": this.roles,
        "picture": (this._profilImg ? this._profilImg.picture : undefined)
    }
})

UserSchema.pre('save', function (next) {
    this.updatedAt = Date.now()
    next()
})

mongoose.model('UserInfo', UserSchema)