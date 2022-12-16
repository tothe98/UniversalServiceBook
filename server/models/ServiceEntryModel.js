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
    _mechanicer: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'UserInfo'
    },
    description: {
        type: String,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    pictures: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Pictures'

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
    isDelete: {
        type: Boolean,
        default: false
    },

},
    {
        collection: 'ServiceEntries'
    })


ServiceEntrySchema.virtual("getServices").get(function () {
    return {
        "id": this._id.toString(),
        "description": this.description,
        "mileage": this.mileage,
        "pictures": picturesToArray(this.pictures.picture),
        "mechanicer": (this.mechanicer.fName + " " + this.mechanicer.lName),
        "workshop": this._workshop.name
    }
})

ServiceEntrySchema.pre('save', function (next) {
    this.updatedAt = Date.now()
    next()
})

function picturesToArray(pictures) {
    return pictures.split("@")
}

mongoose.model('ServiceEntries', ServiceEntrySchema)