const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');
const ROLES = require('../core/Role');
const moment = require('moment')
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Users } = require('../core/DatabaseInitialization');
const request = require('supertest');

let mongod;
let token;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    dbUrl = mongod.getUri();
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true
    });
    const user = await Users.create({
        fName: "Admin",
        lName: "User",
        email: "admin@user.com",
        password: "EgyErősJelszó123",
        phone: "+87732887772",
        roles: [ROLES.User, ROLES.Admin]
    });
    const payload = {
        userId: user._id,
        roles: user.roles
    };
    token = jwt.sign(payload, process.env.JWT_SECRET);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
});
let vehicleTypeId;
describe('POST /addCategory', () => {
    it('should create a new vehicle category', async () => {
        const data = {
            vehicleType: "Autó"
        }
        const res = await request(app).post('/api/v1/addCategory').set("x-access-token", token).send(data);

        expect(res.status).toBe(201);
        expect(res.body.data.response.vehicleType).toBe("Autó");
        vehicleTypeId = res.body.data.response._id;
    });
    it('should return 422', async () => {
        const data = {
            vehicleType: ""
        }
        const res = await request(app).post('/api/v1/addCategory').set("x-access-token", token).send(data);
        expect(res.status).toBe(422);
    });

    it('should return 409', async () => {
        const data = {
            vehicleType: "Autó"
        }
        const res = await request(app).post('/api/v1/addCategory').set("x-access-token", token).send(data);
        expect(res.status).toBe(409);
    });
});

describe('POST /getCategories', () => {
    it('should return categories', async () => {
        const res = await request(app).post('/api/v1/getCategories').set("x-access-token", token);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("categories");
    });
});

let manufactureId;
describe('POST /addManufacture', () => {
    it('should return categories', async () => {
        const data = {
            vehicleType: vehicleTypeId,
            manufacture: "Audi"
        }
        const res = await request(app).post('/api/v1/addManufacture').set("x-access-token", token).send(data);

        expect(res.status).toBe(201);
        expect(res.body.data.response.manufacture).toBe("Audi");
        manufactureId = res.body.data.response._id;
    });
    it('should return 422', async () => {
        const data = {
            vehicleType: "",
            manufacture: "Audi"
        }
        const res = await request(app).post('/api/v1/addManufacture').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
    it('should return 409', async () => {
        const data = {
            vehicleType: vehicleTypeId,
            manufacture: "Audi"
        }
        const res = await request(app).post('/api/v1/addManufacture').set("x-access-token", token).send(data);

        expect(res.status).toBe(409);
    });
    it('should return 404', async () => {
        const data = {
            vehicleType: "6zihz897sd67",
            manufacture: "Audi"
        }
        const res = await request(app).post('/api/v1/addManufacture').set("x-access-token", token).send(data);

        expect(res.status).toBe(404);
    });
    it('should return 500', async () => {
        const data = {
            vehicleType: "6zihz897sd67dw",
            manufacture: "Audi"
        }
        const res = await request(app).post('/api/v1/addManufacture').set("x-access-token", token).send(data);

        expect(res.status).toBe(500);
    });
});

describe('POST /getManufactures', () => {
    it('should return manufactures', async () => {
        const data = {
            category: vehicleTypeId,
        }
        const res = await request(app).post('/api/v1/getManufactures').set("x-access-token", token).send(data);

        expect(res.status).toBe(200);
    });
    it('should return 404', async () => {
        const data = {
            category: "6zihz897sd67s",
        }
        const res = await request(app).post('/api/v1/getManufactures').set("x-access-token", token).send(data);

        expect(res.status).toBe(404);
    });
    it('should return 422', async () => {
        const data = {
            category: "",
        }
        const res = await request(app).post('/api/v1/getManufactures').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
});

describe('POST /addModel', () => {
    it('should create a new model', async () => {
        const data = {
            manufacture: manufactureId,
            model: "A4"
        }
        const res = await request(app).post('/api/v1/addModel').set("x-access-token", token).send(data);

        expect(res.status).toBe(201);
        expect(res.body.data.response.model).toBe("A4");
    });
    it('should return 409', async () => {
        const data = {
            manufacture: manufactureId,
            model: "A4"
        }
        const res = await request(app).post('/api/v1/addModel').set("x-access-token", token).send(data);

        expect(res.status).toBe(409);
    });
    it('should return 404', async () => {
        const data = {
            manufacture: vehicleTypeId,
            model: "A4"
        }
        const res = await request(app).post('/api/v1/addModel').set("x-access-token", token).send(data);

        expect(res.status).toBe(404);
    });
    it('should return 422', async () => {
        const data = {
            manufacture: "",
            model: "A4"
        }
        const res = await request(app).post('/api/v1/addModel').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
    it('should return 500', async () => {
        const data = {
            manufacture: "7dsjkkjsd9sdsj",
            model: "A4"
        }
        const res = await request(app).post('/api/v1/addModel').set("x-access-token", token).send(data);
        expect(res.status).toBe(500);
    });
});

describe('POST /getModels', () => {
    it('should return models', async () => {
        const data = {
            manufacture: manufactureId,
        }
        const res = await request(app).post('/api/v1/getModels').set("x-access-token", token).send(data);

        expect(res.status).toBe(200);
    });
    it('should return 422', async () => {
        const data = {
            manufacture: "",
        }
        const res = await request(app).post('/api/v1/getModels').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
    it('should return 404', async () => {
        const data = {
            manufacture: "6asjdhjkho9766",
        }
        const res = await request(app).post('/api/v1/getModels').set("x-access-token", token).send(data);

        expect(res.status).toBe(404);
    });
});

describe('POST /addFuel', () => {
    it('should create new fuel type', async () => {
        const data = {
            fuel: "Benzin",
        }
        const res = await request(app).post('/api/v1/addFuel').set("x-access-token", token).send(data);

        expect(res.status).toBe(201);
        expect(res.body.data.response.fuel).toBe("Benzin");
    });
    it('should return 409', async () => {
        const data = {
            fuel: "Benzin",
        }
        const res = await request(app).post('/api/v1/addFuel').set("x-access-token", token).send(data);

        expect(res.status).toBe(409);
    });
    it('should return 422', async () => {
        const data = {
            fuel: "",
        }
        const res = await request(app).post('/api/v1/addFuel').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
});

describe('POST /getFuels', () => {
    it('should return fuels', async () => {
        const res = await request(app).post('/api/v1/getFuels').set("x-access-token", token)

        expect(res.status).toBe(200);
    });
});

describe('POST /addDesignType', () => {
    it('should create new DesignType', async () => {
        const data = {
            vehicleType: vehicleTypeId,
            designType: "Sedan"
        }
        const res = await request(app).post('/api/v1/addDesignType').set("x-access-token", token).send(data);

        expect(res.status).toBe(201);
        expect(res.body.data.response.designType).toBe("Sedan");
    });
    it('should return 422', async () => {
        const data = {
            vehicleType: "",
            designType: "Sedan"
        }
        const res = await request(app).post('/api/v1/addDesignType').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
    it('should return 409', async () => {
        const data = {
            vehicleType: vehicleTypeId,
            designType: "Sedan"
        }
        const res = await request(app).post('/api/v1/addDesignType').set("x-access-token", token).send(data);

        expect(res.status).toBe(409);
    });
    it('should return 500', async () => {
        const data = {
            vehicleType: "6sfddeeet788r",
            designType: "Sedan"
        }
        const res = await request(app).post('/api/v1/addDesignType').set("x-access-token", token).send(data);

        expect(res.status).toBe(500);
    });
});

describe('POST /getDesignTypes', () => {
    it('should return designTypes', async () => {
        const data = {
            vehicleType: vehicleTypeId,
        }
        const res = await request(app).post('/api/v1/getDesignTypes').set("x-access-token", token).send(data);

        expect(res.status).toBe(200); 
    });
    it('should return 422', async () => {
        const data = {
            vehicleType: "",
        }
        const res = await request(app).post('/api/v1/getDesignTypes').set("x-access-token", token).send(data);

        expect(res.status).toBe(422); 
    });
    it('should return 404', async () => {
        const data = {
            vehicleType: "67uuzzhrrh975",
        }
        const res = await request(app).post('/api/v1/getDesignTypes').set("x-access-token", token).send(data);

        expect(res.status).toBe(404); 
    });
});

describe('POST /addDriveType', () => {
    it('should create new DriveType', async () => {
        const data = {
            vehicleType: vehicleTypeId,
            driveType: "Első kerék"
        }
        const res = await request(app).post('/api/v1/addDriveType').set("x-access-token", token).send(data);

        expect(res.status).toBe(201);
        expect(res.body.data.response.driveType).toBe("Első kerék");
    });
    it('should return 422', async () => {
        const data = {
            vehicleType: "",
            driveType: "Első kerék"
        }
        const res = await request(app).post('/api/v1/addDriveType').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
    it('should return 409', async () => {
        const data = {
            vehicleType: vehicleTypeId,
            driveType: "Első kerék"
        }
        const res = await request(app).post('/api/v1/addDriveType').set("x-access-token", token).send(data);

        expect(res.status).toBe(409);
    });
    it('should return 500', async () => {
        const data = {
            vehicleType: "6sfddeeet788r",
            driveType: "Első kerék"
        }
        const res = await request(app).post('/api/v1/addDriveType').set("x-access-token", token).send(data);

        expect(res.status).toBe(500);
    });
});

describe('POST /getDriveTypes', () => {
    it('should return driveTypes', async () => {
        const data = {
            vehicleType: vehicleTypeId,
        }
        const res = await request(app).post('/api/v1/getDriveTypes').set("x-access-token", token).send(data);

        expect(res.status).toBe(200); 
    });
    it('should return 422', async () => {
        const data = {
            vehicleType: "",
        }
        const res = await request(app).post('/api/v1/getDriveTypes').set("x-access-token", token).send(data);

        expect(res.status).toBe(422); 
    });
    it('should return 404', async () => {
        const data = {
            vehicleType: "67uuzzhrrh975",
        }
        const res = await request(app).post('/api/v1/getDriveTypes').set("x-access-token", token).send(data);

        expect(res.status).toBe(404); 
    });
});

describe('POST /addTransmission', () => {
    it('should create new Transmission', async () => {
        const data = {
            vehicleType: vehicleTypeId,
            transmission: "Manuális"
        }
        const res = await request(app).post('/api/v1/addTransmission').set("x-access-token", token).send(data);

        expect(res.status).toBe(201);
        expect(res.body.data.response.transmission).toBe("Manuális");
    });
    it('should return 422', async () => {
        const data = {
            vehicleType: "",
            transmission: "Manuális"
        }
        const res = await request(app).post('/api/v1/addTransmission').set("x-access-token", token).send(data);

        expect(res.status).toBe(422);
    });
    it('should return 409', async () => {
        const data = {
            vehicleType: vehicleTypeId,
            transmission: "Manuális"
        }
        const res = await request(app).post('/api/v1/addTransmission').set("x-access-token", token).send(data);

        expect(res.status).toBe(409);
    });
    it('should return 500', async () => {
        const data = {
            vehicleType: "6sfddeeet788r",
            transmission: "Manuális"
        }
        const res = await request(app).post('/api/v1/addTransmission').set("x-access-token", token).send(data);

        expect(res.status).toBe(500);
    });
});

describe('POST /getTransmissions', () => {
    it('should return transmission', async () => {
        const data = {
            vehicleType: vehicleTypeId,
        }
        const res = await request(app).post('/api/v1/getTransmissions').set("x-access-token", token).send(data);

        expect(res.status).toBe(200); 
    });
    it('should return 422', async () => {
        const data = {
            vehicleType: "",
        }
        const res = await request(app).post('/api/v1/getTransmissions').set("x-access-token", token).send(data);

        expect(res.status).toBe(422); 
    });
    it('should return 404', async () => {
        const data = {
            vehicleType: "67uuzzhrrh975",
        }
        const res = await request(app).post('/api/v1/getTransmissions').set("x-access-token", token).send(data);

        expect(res.status).toBe(404); 
    });
});
