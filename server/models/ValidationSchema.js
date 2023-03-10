const Joi = require("joi");
const { ref } = require("joi");

const authSignUpValidate = (data) => {
    const schema = Joi.object({
        fName: Joi.string().required().label("First Name"),
        lName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        phone: Joi.string().allow("").label("Phone Number"),
        password: Joi.string().min(8).required().label('Password')
    })
    return schema.validate(data)
}

const authSignInValidate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label('Password')
    })
    return schema.validate(data)
}

const newPasswordValidate = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required().label('UserId'),
        verificationCode: Joi.string().required().label('Verification Code'),
        password: Joi.string().required().label('Password'),
        cpassword: ref('password')
    })
    return schema.validate(data)
}

const addVehicleValidate = (data) => {
    const schema = Joi.object({
        manufacture: Joi.string().hex().length(24).required().label("Manufacture"),
        model: Joi.string().hex().length(24).required().label("Model"),
        fuel: Joi.string().hex().length(24).required().label("Fuel"),
        driveType: Joi.string().hex().length(24).required().label("DriveType"),
        designType: Joi.string().hex().length(24).required().label("DesignType"),
        transmission: Joi.string().hex().length(24).required().label("Transmission"),
        licenseNumber: Joi.string().allow("").label("LicenseNumber"),
        vin: Joi.string().min(3).max(18).required().label("VIN"), //^[A-HJ-NPR-Za-hj-npr-z\d]{8}[\dX][A-HJ-NPR-Za-hj-npr-z\d]{2}\d{6}$
        vintage: Joi.string().required().label("Vintage"),
        ownMass: Joi.required().label("Own Mass"),
        fullMass: Joi.required().label("Full Mass"),
        cylinderCapacity: Joi.required().label("Cylinder Capacity"),
        performance: Joi.required().label("Performance in PH"),
        mot: Joi.string().allow("").label("Document Validity"),
        nod: Joi.required().label("Nationaly Of Document"),
        mileage: Joi.required().label("Mileage"),
    })
    return schema.validate(data)
}

const addWorkshopValidate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label('Workshop Name'),
        country: Joi.string().required().label('Country'),
        city: Joi.string().required().label('City'),
        address: Joi.string().required().label('Address'),
        owner: Joi.string().email().required().label('Owner Email'),
        phone: Joi.string().allow("").label('Workshop Phone'),
        email: Joi.string().allow("").label('Workshop Email')
    })
    return schema.validate(data)
}

const addServiceEntryValidate = (data) => {
    const schema = Joi.object({
        vehicleID: Joi.string().hex().length(24).required().label('Vehicle ID'),
        date: Joi.string().required().label('Datetime'),
        mileage: Joi.string().required().label('Mileage'),
        description: Joi.string().required().label('Description')
    })
    return schema.validate(data)
}

module.exports = {
    authSignUpValidate,
    authSignInValidate,
    newPasswordValidate,
    addVehicleValidate,
    addWorkshopValidate,
    addServiceEntryValidate
}