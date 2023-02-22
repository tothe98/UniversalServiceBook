const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');
const ROLES = require('../core/Role');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Users, EmailConfirmation, VehicleTypes, Manufactures, Models, Fuels, DesignTypes, DriveTypes, Transmissions, Pictures, Vehicles, ServiceEntries } = require('../core/DatabaseInitialization');
const request = require('supertest');

let mongod;
let token;
let tokenOwner;
let adminUser;
let ownerUser;
let employeeUser;
let vehicle;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    dbUrl = mongod.getUri();
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true
    });

    adminUser = new Users({
        fName: 'Admin',
        lName: 'User',
        email: 'admin@user.com',
        password: 'tesztjelszo123',
        roles: [ROLES.User, ROLES.Admin],
        phone: "+36778885333"
    });
    await adminUser.save();
    ownerUser = new Users({
        fName: 'Owner',
        lName: 'User',
        email: 'owner@user.com',
        password: 'tesztjelszo123',
        roles: [ROLES.User],
        phone: "+36778885333"
    });
    await ownerUser.save();
    employeeUser = new Users({
        fName: 'Employee',
        lName: 'User',
        email: 'employee@user.com',
        password: 'tesztjelszo123',
        roles: [ROLES.User],
        phone: "+36778885333"
    });
    await employeeUser.save();

    const payload = {
        userId: adminUser._id,
        roles: adminUser.roles
    };
    token = jwt.sign(payload, process.env.JWT_SECRET);

    const vehicleType = await VehicleTypes.create({ vehicleType: "Autó" });
    const manufacture = await Manufactures.create({ _vehicleType: vehicleType._id, manufacture: "Audi" });
    const model = await Models.create({ _manufacture: manufacture._id, model: "A4" });
    const fuel = await Fuels.create({ fuel: "Dízel" });
    const designType = await DesignTypes.create({ _vehicleType: vehicleType._id, designType: "Kombi" });
    const driveType = await DriveTypes.create({ _vehicleType: vehicleType._id, driveType: "Összkerék" });
    const transmission = await Transmissions.create({ _vehicleType: vehicleType._id, transmission: "Manuális" });
    const picture = await Pictures.create({ picture: "image.png", _uploadFrom: ownerUser._id });
    vehicle = await Vehicles.create({
        _manufacture: manufacture._id,
        _model: model._id,
        _fuel: fuel._id,
        _designType: designType._id,
        _driveType: driveType._id,
        _transmission: transmission._id,
        _userId: ownerUser._id,
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

});

afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
});
let workshop;
describe('POST /addNewWorkshop', () => {
    it('should create new workshop', async () => {
        const data = {
            name: "Teszt Szerelő KFT.",
            country: "Magyarország",
            city: "Budapest",
            address: "Üllői út 7",
            owner: "owner@user.com",
            phone: "+3670897654",
            email: ""
        }
        const res = await request(app).post('/api/v1/addNewWorkshop').set("x-access-token", token).send(data);

        expect(res.status).toBe(201);
        tokenOwner = jwt.sign({
            userId: ownerUser._id,
            roles: [ROLES.User, ROLES.Owner]
        }, process.env.JWT_SECRET);
        workshop = res.body.data.workshop;
    });
    it('should return 422', async () => {
        const data = {
            name: "",
            country: "Magyarország",
            city: "Budapest",
            address: "Üllői út 7",
            owner: "owner@user.com",
            phone: "+3670897654",
            email: ""
        }
        const res = await request(app).post('/api/v1/addNewWorkshop').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
    it('should return 404', async () => {
        const data = {
            name: "Teszt Szerelő KFT.",
            country: "Magyarország",
            city: "Budapest",
            address: "Üllői út 7",
            owner: "hiba@user.com",
            phone: "+3670897654",
            email: ""
        }
        const res = await request(app).post('/api/v1/addNewWorkshop').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
    it('should return 409', async () => {
        const data = {
            name: "Teszt Szerelő KFT.",
            country: "Magyarország",
            city: "Budapest",
            address: "Üllői út 7",
            owner: "owner@user.com",
            phone: "+3670897654",
            email: ""
        }
        const res = await request(app).post('/api/v1/addNewWorkshop').set("x-access-token", token).send(data);

        expect(res.status).toBe(409);
    });
});

describe('GET /getWorkshops', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/api/v1/getWorkshops').set("x-access-token", token);

        expect(res.status).toBe(200);
    });
});
describe('GET /getMyWorkshop', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/api/v1/getMyWorkshop').set("x-access-token", tokenOwner);

        expect(res.status).toBe(200);
    });
    it('should return 404', async () => {
        const tmpToken = jwt.sign({ userId: "67uuiiuww86z", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).get('/api/v1/getMyWorkshop').set("x-access-token", tmpToken);

        expect(res.status).toBe(404);
    });
    it('should return 500', async () => {
        const tmpToken = jwt.sign({ userId: "67uuiiuww86zwe", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).get('/api/v1/getMyWorkshop').set("x-access-token", tmpToken);

        expect(res.status).toBe(500);
    });
});
describe('PUT /editWorkshop', () => {
    it('should return 202', async () => {
        const data = {
            name: "Teszt Szerelő KFT.",
            country: "Magyarország",
            city: "Szombathely",
            address: "Széll Kálmán utca 7",
            owner: "owner@user.com",
            phone: "+3670897654",
            email: "szerelo@teszt.hu"
        }
        const res = await request(app).put('/api/v1/editWorkshop').set("x-access-token", tokenOwner).send(data);

        expect(res.status).toBe(202);
    });
    it('should return 202', async () => {
        const data = {
            name: "",
            country: "",
            city: "",
            address: "",
            owner: "",
            phone: "",
            email: ""
        }
        const res = await request(app).put('/api/v1/editWorkshop').set("x-access-token", tokenOwner).send(data);

        expect(res.status).toBe(202);
    });
    it('should return 404', async () => {
        const data = {
            name: "Teszt Szerelő KFT.",
            country: "Magyarország",
            city: "Szombathely",
            address: "Széll Kálmán utca 7",
            owner: "owner@user.com",
            phone: "+3670897654",
            email: "szerelo@teszt.hu"
        }
        const tmpToken = jwt.sign({ userId: "67uuiiuww86z", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).put('/api/v1/editWorkshop').set("x-access-token", tmpToken).send(data);

        expect(res.status).toBe(404);
    });
    it('should return 500', async () => {
        const data = {
            name: "Teszt Szerelő KFT.",
            country: "Magyarország",
            city: "Szombathely",
            address: "Széll Kálmán utca 7",
            owner: "owner@user.com",
            phone: "+3670897654",
            email: "szerelo@teszt.hu"
        }
        const tmpToken = jwt.sign({ userId: "67uuiiuww86zwe", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).put('/api/v1/editWorkshop').set("x-access-token", tmpToken).send(data);

        expect(res.status).toBe(500);
    });
});

describe('POST /addEmployee', () => {
    it('should return 202', async () => {
        const data = {
            email: "employee@user.com"
        }
        const res = await request(app).post('/api/v1/addEmployee').set("x-access-token", tokenOwner).send(data);

        expect(res.status).toBe(202);
    });
    it('should return 422', async () => {
        const data = {
            email: ""
        }
        const res = await request(app).post('/api/v1/addEmployee').set("x-access-token", tokenOwner).send(data);

        expect(res.status).toBe(422);
    });
    it('should return 404', async () => {
        const data = {
            email: "tesztEmail@teszt.hu"
        }
        const res = await request(app).post('/api/v1/addEmployee').set("x-access-token", tokenOwner).send(data);

        expect(res.status).toBe(404);
    });
    it('should return 409', async () => {
        const data = {
            email: "employee@user.com"
        }
        const res = await request(app).post('/api/v1/addEmployee').set("x-access-token", tokenOwner).send(data);

        expect(res.status).toBe(409);
    });
    it('should return 404', async () => {
        const data = {
            email: "admin@user.com"
        }
        const tmpToken = jwt.sign({ userId: "67uuiiuww86z", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).post('/api/v1/addEmployee').set("x-access-token", tmpToken).send(data);

        expect(res.status).toBe(404);
    });
    it('should return 500', async () => {
        const data = {
            email: "admin@user.com"
        }
        const tmpToken = jwt.sign({ userId: "67uuiiuww86zwe", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).post('/api/v1/addEmployee').set("x-access-token", tmpToken).send(data);

        expect(res.status).toBe(500);
    });
});

describe('GET /getEmployees', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/api/v1/getEmployees').set("x-access-token", tokenOwner);

        expect(res.status).toBe(200);
    });
    it('should return 404', async () => {
        const tmpToken = jwt.sign({ userId: "67uuiiuww86z", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).get('/api/v1/getEmployees').set("x-access-token", tmpToken);

        expect(res.status).toBe(404);
    });
    it('should return 500', async () => {
        const tmpToken = jwt.sign({ userId: "67uuiiuww86zwe", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).get('/api/v1/getEmployees').set("x-access-token", tmpToken);

        expect(res.status).toBe(500);
    });
});

describe('DELETE /deleteEmployee', () => {
    it('should return 404', async () => {
        const tmpToken = jwt.sign({ userId: "67uuiiuww86z", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).delete(`/api/v1/deleteEmployee/${employeeUser._id}`).set("x-access-token", tmpToken);

        expect(res.status).toBe(404);
    });
    it('should return 500', async () => {
        const tmpToken = jwt.sign({ userId: "67uuiiuww86zew", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).delete(`/api/v1/deleteEmployee/${employeeUser._id}`).set("x-access-token", tmpToken);

        expect(res.status).toBe(500);
    });
    it('should return 204', async () => {
        const res = await request(app).delete(`/api/v1/deleteEmployee/${employeeUser._id}`).set("x-access-token", tokenOwner);

        expect(res.status).toBe(204);
    });
    it('should return 404', async () => {
        const res = await request(app).delete(`/api/v1/deleteEmployee/6ztww7oiq66z`).set("x-access-token", tokenOwner);

        expect(res.status).toBe(404);
    });
});

describe('GET /getVehicleByVin', () => {
    it('should return 200', async () => {
        const vin = vehicle.vin;
        await ServiceEntries.create({
            _vehicle: vehicle._id,
            _workshop: workshop._id,
            _mechanicer: ownerUser._id,
            description: "<p>Kuplungcsere</p>",
            mileage: 200100
        });
        const res = await request(app).get(`/api/v1/getVehicleByVin/${vin}`).set("x-access-token", tokenOwner);

        expect(res.status).toBe(200);
    });
    it('should return 404', async () => {
        const res = await request(app).get(`/api/v1/getVehicleByVin/WAUZZJWE786`).set("x-access-token", tokenOwner);

        expect(res.status).toBe(404);
    });
});

describe('POST /addServiceEntry', () => {
    it('should return 201', async () => {
        const res = await request(app).post(`/api/v1/addServiceEntry`).set("x-access-token", tokenOwner)
            .field("vehicleID", String(vehicle._id))
            .field("description", "<p>Olajcsere</p>")
            .field("mileage", 200110)
            .field("date", moment("2023-02-21 22:51").format())
            .attach("pictures", __dirname + "/assets/img1.jpeg");

        expect(res.status).toBe(201);
    });
    it('should return 422', async () => {
        const res = await request(app).post(`/api/v1/addServiceEntry`).set("x-access-token", tokenOwner)
            .field("vehicleID", String(vehicle._id))
            .field("mileage", 200110)
            .field("date", moment("2023-02-21 22:51").format())
            .attach("pictures", __dirname + "/assets/img1.jpeg");

        expect(res.status).toBe(422);
    });
    it('should return 404', async () => {
        const res = await request(app).post(`/api/v1/addServiceEntry`).set("x-access-token", tokenOwner)
            .field("vehicleID", "63f54098cd1974feed4e0054")
            .field("description", "<p>Olajcsere</p>")
            .field("mileage", 200110)
            .field("date", moment("2023-02-21 22:51").format())
            .attach("pictures", __dirname + "/assets/img1.jpeg");

        expect(res.status).toBe(404);
    });
    it('should return 409', async () => {
        const res = await request(app).post(`/api/v1/addServiceEntry`).set("x-access-token", tokenOwner)
            .field("vehicleID", String(vehicle._id))
            .field("description", "<p>Olajcsere</p>")
            .field("mileage", 190000)
            .field("date", moment("2023-02-21 22:51").format())
            .attach("pictures", __dirname + "/assets/img1.jpeg");

        expect(res.status).toBe(409);
    });
    it('should return 400', async () => {
        const res = await request(app).post(`/api/v1/addServiceEntry`).set("x-access-token", tokenOwner)
            .field("vehicleID", String(vehicle._id))
            .field("description", "<p>Olajcsere</p>")
            .field("mileage", 190000)
            .field("date", moment("2023-02-21 22:51").format())
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")
            .attach("pictures", __dirname + "/assets/img1.jpeg")

        expect(res.status).toBe(400);
    });
    it('should return 500', async () => {
        const tmpToken = jwt.sign({ userId: "67uuiiuww86zew", roles: [ROLES.User, ROLES.Owner] }, process.env.JWT_SECRET);
        const res = await request(app).post(`/api/v1/addServiceEntry`).set("x-access-token", tmpToken)
            .field("vehicleID", String(vehicle._id))
            .field("description", "<p>Olajcsere</p>")
            .field("mileage", 211000)
            .field("date", moment("2023-02-21 22:51").format())

        expect(res.status).toBe(500);
    });
});

describe('DELETE /deleteWorkshop', () => {
    it('should return 422', async () => {
        const res = await request(app).delete(`/api/v1/deleteWorkshop/6tzuiz6tz76z`).set("x-access-token", token);

        expect(res.status).toBe(422);
    });
    it('should return 500', async () => {
        const res = await request(app).delete(`/api/v1/deleteWorkshop/6tzuiz6tz76zwd`).set("x-access-token", token);

        expect(res.status).toBe(500);
    });
    it('should return 204', async () => {
        const data = {
            email: "employee@user.com"
        };
        const addEmployee = await request(app).post('/api/v1/addEmployee').set("x-access-token", tokenOwner).send(data);

        const res = await request(app).delete(`/api/v1/deleteWorkshop/${workshop._id}`).set("x-access-token", token);
        expect(addEmployee.status).toBe(202);
        expect(res.status).toBe(204);
    });
    it('should return 202', async () => {
        const res = await request(app).delete(`/api/v1/deleteWorkshop/${workshop._id}`).set("x-access-token", token);

        expect(res.status).toBe(202);
    });
});