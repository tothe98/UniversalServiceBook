const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');
const ROLES = require('../core/Role');
const { MongoMemoryServer } = require('mongodb-memory-server');
const moment = require("moment");
const { Users, VehicleTypes, Manufactures, Models, Fuels, DesignTypes, DriveTypes, Transmissions, Vehicles, Pictures, RecentActivations, ServiceEntries } = require('../core/DatabaseInitialization');
const request = require('supertest');

let mongod;
let token;
let testUser;
let vehicle;
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    dbUrl = mongod.getUri();
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true
    });
    testUser = new Users({
        fName: 'Test',
        lName: 'User',
        email: 'test@user.com',
        password: 'tesztjelszo123',
        roles: [ROLES.User],
        phone: "+36778885333"
    });
    await testUser.save();
    const payload = {
        userId: testUser._id,
        roles: testUser.roles
    };
    token = jwt.sign(payload, process.env.JWT_SECRET);

    const vehicleType = await VehicleTypes.create({ vehicleType: "Autó" });
    const manufacture = await Manufactures.create({ _vehicleType: vehicleType._id, manufacture: "Audi" });
    const model = await Models.create({ _manufacture: manufacture._id, model: "A4" });
    const fuel = await Fuels.create({ fuel: "Dízel" });
    const designType = await DesignTypes.create({ _vehicleType: vehicleType._id, designType: "Kombi" });
    const driveType = await DriveTypes.create({ _vehicleType: vehicleType._id, driveType: "Összkerék" });
    const transmission = await Transmissions.create({ _vehicleType: vehicleType._id, transmission: "Manuális" });
    const picture = await Pictures.create({ picture: "image.png", _uploadFrom: testUser._id });
    vehicle = await Vehicles.create({
        _manufacture: manufacture._id,
        _model: model._id,
        _fuel: fuel._id,
        _designType: designType._id,
        _driveType: driveType._id,
        _transmission: transmission._id,
        _userId: testUser._id,
        licenseNumber: "AABB123",
        vin: "ABCZIJJDTUJE8272H",
        vintage: "2016-10-10",
        ownMass: 1300,
        fullMass: 2000,
        cylinderCapacity: 1996,
        performance: 190,
        nod: "HU",
        mot: "2024-10-01",
        mileage: 200000,
        pictures: picture._id,
        preview: picture._id,
    });
    const lastView = await RecentActivations.create({
        userId: testUser._id,
        vehicleId: vehicle._id,
        category: "vehicle",
        expireDate: moment().add(1, "days").format()
    });
    const servceInformation = await RecentActivations.create({
        workshop: "Autó szerviz",
        text: "Új szervit lett hozzáadva",
        userId: testUser._id,
        vehicleId: vehicle._id,
        category: "service",
        expireDate: moment().add(1, "days").format()
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
});

describe('GET /serviceInformation', () => {
    it('should return service informations', async () => {
        const res = await request(app).get('/api/v1/serviceInformation').set("x-access-token", token);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("servceInformation");
    });
    it('should return 500', async () => {
        const payload = {
            userId: "28kkksogbw945",
            roles: [ROLES.User]
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        const res = await request(app).get('/api/v1/serviceInformation').set("x-access-token", token);

        expect(res.status).toBe(500);
    });
});

describe('GET /lastViewed', () => {
    it('should return last view vehicles without services', async () => {

        const res = await request(app).get('/api/v1/lastViewed').set("x-access-token", token);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("lastViewed");
    });
    it('should return last view vehicles with services', async () => {
        const service = await ServiceEntries.create({
            _vehicle: vehicle._id,
            _workshop: "6ziswopi89dz",
            _mechanicer: testUser._id,
            description: "<p>Teszt</p>",
            mileage: 210000,

        });
        const res = await request(app).get('/api/v1/lastViewed').set("x-access-token", token);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("lastViewed");
    });
    it('should return 500', async () => {
        const payload = {
            userId: "28kkksogbw945",
            roles: [ROLES.User]
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        const res = await request(app).get('/api/v1/lastViewed').set("x-access-token", token);

        expect(res.status).toBe(500);
    });
});