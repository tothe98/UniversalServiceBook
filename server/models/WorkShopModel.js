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
    city: {
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
    employees: [{
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'UserInfo'
    }],
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

WorkShopSchema.virtual("getWorkshop").get(function () {
    return {
        "_id": this._id,
        "name": this.name,
        "country": this.country,
        "city": this.city,
        "address": this.address,
        "owner": this._owner.lName + " " + this._owner.fName,
    }
})

WorkShopSchema.virtual("getEmployees").get(function () {
    return {
        "employees": this.employees.map((employee) => employee.lName + " " + employee.fName)
    }
})

mongoose.model('WorkShops', WorkShopSchema)