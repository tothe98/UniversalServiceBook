const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');
const ROLES = require('../core/Role');
const moment = require('moment')
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Users, EmailConfirmation } = require('../core/DatabaseInitialization');
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

describe('GET /getUserData', () => {
    it('should return an user', async () => {
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
        const res = await request(app).get('/api/v1/getUserData').set("x-access-token", token);

        // Assert that the response has a status of 200 OK and the returned users include the test user
        expect(res.status).toBe(200);
        expect(res.body.data.user.email).toBe("test@user.com");
    });

    it("should return unauthorized", async () => {
        const res = await request(app).get('/api/v1/getUserData');

        expect(res.status).toBe(401);
    });
});

describe('PUT /updateUser', () => {
    it("should return updated user", async () => {
        const testUser = new Users({
            fName: 'Test',
            lName: 'User',
            email: 'test1@user.com',
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

        const data = {
            home: "Szombathely",
            fName: "Váradi"
        };

        const res = await request(app).put('/api/v1/updateUser').set("x-access-token", token).send(data);

        expect(res.status).toBe(202);
        expect(res.body.data.user.home).toBe("Szombathely");
        expect(res.body.data.user.fName).toBe("Váradi");
    });
});

describe('POST /forgotPassword', () => {
    it("should send email and create a request code", async () => {
        const testUser = new Users({
            fName: 'Test',
            lName: 'User',
            email: 'test2@user.com',
            password: 'tesztjelszo123',
            roles: [ROLES.User],
            phone: "+36778885333"
        });
        await testUser.save();
        const data = {
            email: testUser.email
        };

        const res = await request(app).post('/api/v1/forgotPassword').send(data);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("EmailIsSent");
    });
    it("should return 422", async () => {
        const data = {
            email: ""
        };

        const res = await request(app).post('/api/v1/forgotPassword').send(data);
        expect(res.status).toBe(422);
    });
});

describe('POST /newPassword', () => {
    it("should update an user password", async () => {
        const testUser = new Users({
            fName: 'Test',
            lName: 'User',
            email: 'test3@user.com',
            password: 'tesztjelszo123',
            roles: [ROLES.User],
            phone: "+36778885333"
        });
        await testUser.save();
        const veriCodeData = {
            email: testUser.email
        };

        await request(app).post('/api/v1/forgotPassword').send(veriCodeData);
        const code = await EmailConfirmation.findOne({ userId: testUser._id });

        const data = {
            userId: testUser._id,
            verificationCode: code.verificationCode,
            password: "ezEgyMasikJelszo123",
            cpassword: "ezEgyMasikJelszo123"
        };

        const res = await request(app).post('/api/v1/newPassword').send(data);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("success");
    });
    it("should return 422", async () => {
        const data = {
            userId: "",
            verificationCode: "",
            password: "ezEgyMasikJelszo123",
            cpassword: "ezEgyMasikJelszo123"
        };

        const res = await request(app).post('/api/v1/newPassword').send(data);

        expect(res.status).toBe(422);
    });
    it("should return 404", async () => {
        const data = {
            userId: "6erpoauz7398",
            verificationCode: "2112kndskkkkie",
            password: "ezEgyMasikJelszo123",
            cpassword: "ezEgyMasikJelszo123"
        };

        const res = await request(app).post('/api/v1/newPassword').send(data);
        expect(res.status).toBe(404);
    });
    it("should return 409", async () => {
        const testUser = new Users({
            fName: 'Test',
            lName: 'User',
            email: 'test5@user.com',
            password: 'tesztjelszo123',
            roles: [ROLES.User],
            phone: "+36778885333"
        });
        await testUser.save();
        const id = testUser._id;
        const code = new EmailConfirmation({
            verificationCode: "2112kndskkkkie9",
            userId: id,
            expireDate: moment(),
            category: "password"
        });
        await code.save();
        const data = {
            userId: id,
            verificationCode: "2112kndskkkkie9",
            password: "ezEgyMasikJelszo123",
            cpassword: "ezEgyMasikJelszo123"
        };

        const res = await request(app).post('/api/v1/newPassword').send(data);
        expect(res.status).toBe(409);
    })
    it("should return 500", async () => {
        const data = {
            userId: "6erpoauz7398err",
            verificationCode: "2112kndskkkkie",
            password: "ezEgyMasikJelszo123",
            cpassword: "ezEgyMasikJelszo123"
        };

        const res = await request(app).post('/api/v1/newPassword').send(data);
        expect(res.status).toBe(500);
    })
});
