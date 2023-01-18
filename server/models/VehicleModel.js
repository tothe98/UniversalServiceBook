const mongoose = require('mongoose')
const moment = require("moment");

const VehiclesSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'UserInfo'
    },
    _manufacture: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Manufactures',
    },
    _model: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Models'
    },
    _fuel: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Fuels'
    },
    _driveType: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'DriveTypes'
    },
    _designType: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'DesignTypes'
    },
    _transmission: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Transmissions'
    },
    licenseNumber: {
        type: String,
        required: false,
    },
    vin: {
        type: String,
        required: true,
        unique: true
    },
    vintage: {
        type: Date,
        required: true
    },
    ownMass: {
        type: Number,
        required: false
    },
    fullMass: {
        type: Number,
        required: false
    },
    cylinderCapacity: {
        type: Number,
        required: false
    },
    performance: {
        type: Number,
        required: false
    },
    nod: {//okmányok jellege
        type: String,
        required: false
    },
    mot: {
        type: Date,
        required: false
    },
    mileage: {
        type: Number,
        required: false
    },
    pictures: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Pictures'
    },
    preview: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Pictures'
    },
    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        collection: 'Vehicles',
    })

VehiclesSchema.virtual("getVehicleData").get(function () {
    return {
        "id": this._id.toString(),
        "manufacture": this._manufacture.manufacture,
        "model": this._model.model,
        "fuel": this._fuel.fuel,
        "driveType": this._driveType.driveType,
        "designType": this._designType.designType,
        "transmission": this._transmission.transmission,
        "licenseNumber": (this.licenseNumber ? this.licenseNumber : undefined),
        "vin": this.vin,
        "vintage": moment(this.vintage).format('YYYY'),
        "ownMass": this.ownMass,
        "fullMass": this.fullMass,
        "cylinderCapacity": this.cylinderCapacity,
        "performanceLE": this.performance,
        "performanceKW": Math.round(this.performance / 1.36),
        "nod": this.nod,
        "mot": (this.mot ? moment(this.mot).format('YYYY-MM-DD') : undefined),
        "mileage": this.mileage,
        "pictures": picturesToArray(this.pictures.picture),
        "preview": this.preview.picture
    }
})
VehiclesSchema.virtual("getVehicleDataById").get(function () {
    return {
        "id": this._id.toString(),
        "manufacture": this._manufacture.manufacture,
        "model": this._model.model,
        "fuel": this._fuel.fuel,
        "driveType": this._driveType.driveType,
        "designType": this._designType.designType,
        "transmission": this._transmission.transmission,
        "licenseNumber": (this.licenseNumber ? this.licenseNumber : undefined),
        "vin": this.vin,
        "vintage": moment(this.vintage).format('YYYY'),
        "ownMass": this.ownMass,
        "fullMass": this.fullMass,
        "cylinderCapacity": this.cylinderCapacity,
        "performanceLE": this.performance,
        "performanceKW": Math.round(this.performance / 1.36),
        "nod": this.nod,
        "mot": (this.mot ? moment(this.mot).format('YYYY-MM-DD') : undefined),
        "mileage": this.mileage,
        "pictures": picturesToArray(this.pictures.picture, this.preview.picture),
    }
})
VehiclesSchema.virtual("getVehicleByVin").get(function () {
    return {
        "id": this._id.toString(),
        "manufacture": this._manufacture.manufacture,
        "model": this._model.model,
        "fullName": this._userId.lName + " " + this._userId.fName,
        "licenseNumber": (this.licenseNumber ? this.licenseNumber : undefined),
        "vin": this.vin,
        "vintage": moment(this.vintage).format('YYYY'),
        "cylinderCapacity": this.cylinderCapacity,
        "performanceLE": this.performance,
        "performanceKW": Math.round(this.performance / 1.36),
        "mot": (this.mot ? moment(this.mot).format('YYYY-MM-DD') : undefined),
        "mileage": this.mileage,
        "preview": this.preview.picture,
    }
})
function picturesToArray(pictures, prev = null) {
    if (prev === null) {
        return pictures.split("@")
    }
    returnPictureArray = []
    returnPictureArray[0] = prev
    pictures.split("@").map((s) => { returnPictureArray.push(s) })
    return returnPictureArray
}

mongoose.model('Vehicles', VehiclesSchema)