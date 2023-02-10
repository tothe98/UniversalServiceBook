const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');
const ROLES = require('../core/Role');
const moment = require('moment')
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Users } = require('../core/DatabaseInitialization');
const request = require('supertest');

let mongod;

// Connect to a mock MongoDB server before running tests
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    dbUrl = mongod.getUri();
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true
    });
});

// Close the mock MongoDB server after running tests
afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
});

describe('GET /serviceInformation', () => {
    it('should return service informations', async () => {
        // Create a test user
        const testUser = new Users({
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
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        // Make a GET request to the /users endpoint
        const res = await request(app).get('/api/v1/serviceInformation').set("x-access-token", token);

        // Assert that the response has a status of 200 OK and the returned users include the test user
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
    it('should return last view vehicles', async () => {
        // Create a test user
        const testUser = new Users({
            fName: 'Test',
            lName: 'User',
            email: 'test2@user.com',
            password: 'tesztjelszo123',
            roles: [ROLES.User],
            phone: "+36778885333"
        });
        await testUser.save();
        const payload = {
            userId: testUser._id,
            roles: testUser.roles
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        // Make a GET request to the /users endpoint
        const res = await request(app).get('/api/v1/lastViewed').set("x-access-token", token);

        // Assert that the response has a status of 200 OK and the returned users include the test user
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