const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');
const ROLES = require('../core/Role');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Users, VehicleTypes, Manufactures, Models, Fuels, DesignTypes, DriveTypes, Transmissions, Workshops, ServiceEntries, Pictures, Vehicles, RecentActivations } = require('../core/DatabaseInitialization');
const request = require('supertest');

let mongod;
let token;
let user;
let vehicleType;
let manufacture;
let model;
let fuel;
let designType;
let driveType;
let transmission;
let workshop;
let pictures;
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    dbUrl = mongod.getUri();
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true
    });
    user = await Users.create({
        fName: "Normal",
        lName: "User",
        email: "normal@user.com",
        password: "EgyErősJelszó123",
        phone: "+87732887772",
        roles: [ROLES.User]
    });
    await Users.create({
        fName: "Uj",
        lName: "Tulaj",
        email: "ujtulaj@email.hu",
        password: "EgyErősJelszó123",
        phone: "+87732887772",
        roles: [ROLES.User]
    })
    const payload = {
        userId: user._id,
        roles: user.roles
    };

    token = await jwt.sign(payload, process.env.JWT_SECRET);
    vehicleType = await VehicleTypes.create({ vehicleType: "Autó" });
    manufacture = await Manufactures.create({ _vehicleType: vehicleType._id, manufacture: "Audi" });
    model = await Models.create({ _manufacture: manufacture._id, model: "A4" });
    fuel = await Fuels.create({ fuel: "Dízel" });
    designType = await DesignTypes.create({ _vehicleType: vehicleType._id, designType: "Kombi" });
    driveType = await DriveTypes.create({ _vehicleType: vehicleType._id, driveType: "Összkerék" });
    transmission = await Transmissions.create({ _vehicleType: vehicleType._id, transmission: "Manuális" });
    workshop = await Workshops.create({
        name: "Teszt Szerviz KFT.",
        country: "Magyarország",
        city: "Budapest",
        address: "Üllői út 30.",
        phone: "+3670808021",
        email: "info@teszt-szerviz.hu",
        _owner: user._id,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
});
let vehicle;
describe('POST /addVehicle', () => {
    it('should create a new vehicle', async () => {
        const data = {
            _userId: user._id,
            _manufacture: manufacture._id,
            _model: model._id,
            _fuel: fuel._id,
            _driveType: driveType._id,
            _designType: designType._id,
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822894",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            performance: 190,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set({ "x-access-token": token, 'Content-Type': 'application/json', })
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('performance', data.performance)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("picture", __dirname + "/assets/img1.jpeg")
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .set('Accept', 'application/json');

        expect(res.status).toBe(201);
        vehicle = res.body.data.vehicle;
        pictures = await Pictures.find();
    });
    it('should return 400', async () => {
        const data = {
            _userId: user._id,
            _manufacture: manufacture._id,
            _model: model._id,
            _fuel: fuel._id,
            _driveType: driveType._id,
            _designType: designType._id,
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822894",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set("x-access-token", token)
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .attach('preview', __dirname + "/assets/img1.jpeg")
            .attach('preview', __dirname + "/assets/img2.jpeg")

        expect(res.status).toBe(400);
    });
    it('should return 422', async () => {
        const data = {
            _userId: user._id,
            _manufacture: manufacture._id,
            _model: model._id,
            _fuel: fuel._id,
            _driveType: driveType._id,
            _designType: designType._id,
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822894",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set("x-access-token", token)
            .field('userId', String(data._userId))
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach('picture', __dirname + "/assets/img3.jpeg")

        expect(res.status).toBe(422);
    });
    it('should return 422', async () => {
        const data = {};
        const res = await request(app).post('/api/v1/addVehicle').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });

    it('should return 422', async () => {
        const data = {
            _userId: user._id,
            _manufacture: manufacture._id,
            _model: model._id,
            _fuel: fuel._id,
            _driveType: driveType._id,
            _designType: designType._id,
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822894",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            performance: 190,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set({ "x-access-token": token, 'Content-Type': 'application/json', })
            .field('manufacture', String(data._manufacture))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('performance', data.performance)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("picture", __dirname + "/assets/img1.jpeg")
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .set('Accept', 'application/json');

        expect(res.status).toBe(422);
    });
    it('should return 409', async () => {
        const data = {
            _userId: user._id,
            _manufacture: manufacture._id,
            _model: model._id,
            _fuel: fuel._id,
            _driveType: driveType._id,
            _designType: designType._id,
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822894",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            performance: 190,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set({ "x-access-token": token, 'Content-Type': 'application/json', })
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('performance', data.performance)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("picture", __dirname + "/assets/img1.jpeg")
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .set('Accept', 'application/json');

        expect(res.status).toBe(409);
    });
    it('should return 409', async () => {
        const data = {
            _manufacture: "63f3e1fc5b63bee92c9e05cb",
            _model: model._id,
            _fuel: fuel._id,
            _driveType: driveType._id,
            _designType: designType._id,
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822891",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            performance: 190,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set({ "x-access-token": token, 'Content-Type': 'application/json', })
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('performance', data.performance)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("picture", __dirname + "/assets/img1.jpeg")
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .set('Accept', 'application/json');

        expect(res.status).toBe(409);
    });
    it('should return 409', async () => {
        const data = {
            _manufacture: manufacture._id,
            _model: "63f3e1fc5b63bee92c9e05ca",
            _fuel: fuel._id,
            _driveType: driveType._id,
            _designType: designType._id,
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822892",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            performance: 190,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set({ "x-access-token": token, 'Content-Type': 'application/json', })
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('performance', data.performance)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("picture", __dirname + "/assets/img1.jpeg")
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .set('Accept', 'application/json');

        expect(res.status).toBe(409);
    });
    it('should return 409', async () => {
        const data = {
            _manufacture: manufacture._id,
            _model: model._id,
            _fuel: "63f3e1fc5b63bee92c9e05ca",
            _driveType: driveType._id,
            _designType: designType._id,
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822892",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            performance: 190,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set({ "x-access-token": token, 'Content-Type': 'application/json', })
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('performance', data.performance)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("picture", __dirname + "/assets/img1.jpeg")
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .set('Accept', 'application/json');

        expect(res.status).toBe(409);
    });
    it('should return 409', async () => {
        const data = {
            _manufacture: manufacture._id,
            _model: model._id,
            _fuel: fuel._id,
            _driveType: "63f3e1fc5b63bee92c9e05ca",
            _designType: designType._id,
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822892",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            performance: 190,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set({ "x-access-token": token, 'Content-Type': 'application/json', })
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('performance', data.performance)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("picture", __dirname + "/assets/img1.jpeg")
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .set('Accept', 'application/json');

        expect(res.status).toBe(409);
    });
    it('should return 409', async () => {
        const data = {
            _manufacture: manufacture._id,
            _model: model._id,
            _fuel: fuel._id,
            _driveType: driveType._id,
            _designType: "63f3e1fc5b63bee92c9e05ca",
            _transmission: transmission._id,
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822892",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            performance: 190,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set({ "x-access-token": token, 'Content-Type': 'application/json', })
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('performance', data.performance)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("picture", __dirname + "/assets/img1.jpeg")
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .set('Accept', 'application/json');

        expect(res.status).toBe(409);
    });
    it('should return 409', async () => {
        const data = {
            _manufacture: manufacture._id,
            _model: model._id,
            _fuel: fuel._id,
            _driveType: driveType._id,
            _designType: designType._id,
            _transmission: "63f3e1fc5b63bee92c9e05ca",
            licenseNumber: "AA BB 123",
            vin: "WAUZZJUZAV7822892",
            vintage: "2016-01-01",
            ownMass: 1500,
            fullMass: 2000,
            cylinderCapacity: 1996,
            performance: 190,
            nod: "HU",
            mot: "2024-10-01",
            mileage: 200000
        };
        const res = await request(app).post('/api/v1/addVehicle').set({ "x-access-token": token, 'Content-Type': 'application/json', })
            .field('manufacture', String(data._manufacture))
            .field('model', String(data._model))
            .field('fuel', String(data._fuel))
            .field('driveType', String(data._driveType))
            .field('designType', String(data._designType))
            .field('transmission', String(data._transmission))
            .field('licenseNumber', data.licenseNumber)
            .field('vin', data.vin)
            .field('vintage', data.vintage)
            .field('ownMass', data.ownMass)
            .field('fullMass', data.fullMass)
            .field('cylinderCapacity', data.cylinderCapacity)
            .field('performance', data.performance)
            .field('nod', data.nod)
            .field('mot', data.mot)
            .field('mileage', data.mileage)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("picture", __dirname + "/assets/img1.jpeg")
            .attach('picture', __dirname + "/assets/img2.jpeg")
            .set('Accept', 'application/json');

        expect(res.status).toBe(409);
    });
});

describe('GET /getVehicles', () => {
    it('should return vehicles without service entry', async () => {
        const res = await request(app).get('/api/v1/getVehicles').set("x-access-token", token);

        expect(res.status).toBe(200);
    });
    it('should return vehicles with service entry', async () => {
        await ServiceEntries.create({
            _vehicle: vehicle._id,
            _workshop: workshop._id,
            _mechanicer: user._id,
            description: "<p>Kuplungcsere</p>",
            mileage: 200100
        });
        const res = await request(app).get('/api/v1/getVehicles').set("x-access-token", token);

        expect(res.status).toBe(200);
    });
    it('should return 500', async () => {

        const payload = {
            userId: "6zz779uzzzhji8",
            roles: [ROLES.User]
        };

        ctoken = await jwt.sign(payload, process.env.JWT_SECRET);
        const res = await request(app).get('/api/v1/getVehicles').set("x-access-token", ctoken);

        expect(res.status).toBe(500);
    });
});

describe('GET /getVehicle', () => {
    it('should return a vehicle', async () => {
        const res = await request(app).get(`/api/v1/getVehicle/${vehicle._id}`).set("x-access-token", token);

        expect(res.status).toBe(200);
    });
    it('should return a vehicle - already exists in recentactivision', async () => {
        const res = await request(app).get(`/api/v1/getVehicle/${vehicle._id}`).set("x-access-token", token);

        expect(res.status).toBe(200);
    });
    it('should return a vehicle', async () => {
        const res = await request(app).get(`/api/v1/getVehicle/6ziowwuha67z`).set("x-access-token", token);

        expect(res.status).toBe(404);
    });
    it('should return a vehicle', async () => {
        const res = await request(app).get(`/api/v1/getVehicle/6ziowwuha67zw`).set("x-access-token", token);

        expect(res.status).toBe(500);
    });
});

describe('PUT /updateVehicle', () => {
    it('should update vehicle with new datas', async () => {

        const data = {
            cylinderCapacity: 2000,
            ownMass: 2000,
            fullMass: 2500,
            performance: 272,
            nod: "AU",
            licenseNumber: "SPR 453",
            mot: "2026-10-10",
            deletedPictures: pictures[1]?.picture + "@" + pictures[0].picture
        }
        const res = await request(app).put(`/api/v1/updateVehicle/${vehicle._id}`).set("x-access-token", token)
            .field("cylinderCapacity", data.cylinderCapacity)
            .field("ownMass", data.ownMass)
            .field("fullMass", data.fullMass)
            .field("performance", data.performance)
            .field("nod", data.nod)
            .field("licenseNumber", data.licenseNumber)
            .field("mot", data.mot)
            .field("deletedPictures", data.deletedPictures)
            .attach("preview", __dirname + "/assets/img3.jpeg")
            .attach("picture", __dirname + "/assets/img2.jpeg");

        expect(res.status).toBe(202);
    });
    it('should update vehicle without new datas', async () => {
        const res = await request(app).put(`/api/v1/updateVehicle/${vehicle._id}`).set("x-access-token", token).send();

        expect(res.status).toBe(202);
    });
    it('should return 404', async () => {
        const res = await request(app).put(`/api/v1/updateVehicle/6zuz7t79eh8z`).set("x-access-token", token).send();

        expect(res.status).toBe(404);
    });
    it('should return 400', async () => {
        const data = {
            cylinderCapacity: 2000,
            ownMass: 2000,
            fullMass: 2500,
            performance: 272,
            nod: "AU",
            licenseNumber: "SPR 453",
            mot: "2026-10-10",
            deletedPictures: ""
        }
        const res = await request(app).put(`/api/v1/updateVehicle/${vehicle._id}`).set("x-access-token", token)
            .attach("preview", __dirname + "/assets/img1.jpeg")
            .attach("preview", __dirname + "/assets/img2.jpeg");

        expect(res.status).toBe(400);
    });
    it('should return 500', async () => {
        const res = await request(app).put(`/api/v1/updateVehicle/6ziiizz7667ze`).set("x-access-token", token).send();

        expect(res.status).toBe(500);
    });
});

describe('POST /shareVehicle', () => {
    it('should shared vehicle -true', async () => {
        const res = await request(app).post(`/api/v1/shareVehicle/${vehicle._id}`).set("x-access-token", token);

        expect(res.status).toBe(202);
    });
    it('should shared vehicle -false', async () => {
        const res = await request(app).post(`/api/v1/shareVehicle/${vehicle._id}`).set("x-access-token", token);

        expect(res.status).toBe(202);
    });
    it('should return 404', async () => {
        const res = await request(app).post(`/api/v1/shareVehicle/6uszzuwo875z`).set("x-access-token", token);

        expect(res.status).toBe(404);
    });
    it('should return 500', async () => {
        const res = await request(app).post(`/api/v1/shareVehicle/6uszzuwo875zs`).set("x-access-token", token);

        expect(res.status).toBe(500);
    });
});

describe('GET /getPublicVehicle', () => {
    it('should return 404', async () => {
        const res = await request(app).get(`/api/v1/getPublicVehicle/${vehicle._id}`).set("x-access-token", token);

        expect(res.status).toBe(404);
    });
    it('should return an vehicle', async () => {
        await Vehicles.findOneAndUpdate({ _id: vehicle._id }, { shared: true });
        const res = await request(app).get(`/api/v1/getPublicVehicle/${vehicle._id}`).set("x-access-token", token);

        expect(res.status).toBe(200);
    });
    it('should return an vehicle', async () => {
        await Vehicles.findOneAndUpdate({ _id: vehicle._id }, { shared: true });
        await ServiceEntries.findOneAndDelete({ _vehicle: vehicle._id });
        const res = await request(app).get(`/api/v1/getPublicVehicle/${vehicle._id}`).set("x-access-token", token);

        expect(res.status).toBe(200);
    });
    it('should return 500', async () => {
        await Vehicles.findOneAndUpdate({ _id: vehicle._id }, { shared: true });
        const res = await request(app).get(`/api/v1/getPublicVehicle/6wueeww8897z8`).set("x-access-token", token);

        expect(res.status).toBe(500);
    });
});

describe('GET /changeOwner', () => {
    it('should return 404', async () => {
        const data = {
            email: "ujtulaj@email.com"
        };
        const res = await request(app).post(`/api/v1/changeOwner/${vehicle._id}`).set("x-access-token", token).send(data)

        expect(res.status).toBe(404);
    });
    it('should return 422', async () => {
        const data = {
            email: ""
        };
        const res = await request(app).post(`/api/v1/changeOwner/${vehicle._id}`).set("x-access-token", token).send(data)

        expect(res.status).toBe(422);
    });
    it('should return 500', async () => {
        const data = {
            email: "ujtulaj@email.hu"
        };
        const res = await request(app).post(`/api/v1/changeOwner/6uuuizz767z7zt`).set("x-access-token", token).send(data)

        expect(res.status).toBe(500);
    });
    it('should return 200', async () => {
        await RecentActivations.create({
            userId: user._id,
            vehicleId: vehicle._id,
            expireDate: "2024-10-10",
            category: "vehicle"
        });
        const data1 = {
            email: "ujtulaj@email.hu"
        };
        const data2 = {
            email: "normal@user.com"
        };
        const res1 = await request(app).post(`/api/v1/changeOwner/${vehicle._id}`).set("x-access-token", token).send(data1)
        const res2 = await request(app).post(`/api/v1/changeOwner/${vehicle._id}`).set("x-access-token", token).send(data2)
        expect(res1.status).toBe(200);
        expect(res2.status).toBe(200);
    });
});

describe('DELETE /deleteVehicle', () => {
    it('should return 404', async () => {
        const res = await request(app).delete(`/api/v1/deleteVehicle/6zuite75g86z`).set("x-access-token", token)

        expect(res.status).toBe(404);
    });
    it('should return 500', async () => {
        const res = await request(app).delete(`/api/v1/deleteVehicle/6zuite75g86zsd`).set("x-access-token", token)

        expect(res.status).toBe(500);
    });
    it('should return 204', async () => {
        const res = await request(app).delete(`/api/v1/deleteVehicle/${vehicle._id}`).set("x-access-token", token)

        expect(res.status).toBe(204);
    });
});