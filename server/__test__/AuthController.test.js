const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ROLES = require('../core/Role');
const app = require('../server');
const { Users, EmailConfirmation } = require('../core/DatabaseInitialization');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

let mongod;

// Connect to a mock MongoDB server before running tests
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    dbUrl = mongod.getUri();
    mongoose.connect(dbUrl, {
        useNewUrlParser: true
    });
});

// Close the mock MongoDB server after running tests
afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
});

describe('POST /signup', () => {
    it('should register an account', async () => {
        const data = {
            fName: "Test",
            lName: "User",
            email: "test@user.com",
            password: "EgyBiztonságosJelszó123"
        };

        const res = await request(app).post('/api/v1/signup').send(data);
        expect(res.status).toBe(201);
    });
});

describe('POST /emailConfirmation', () => {
    it('should set active an account', async () => {
        const user = await Users.findOne({ email: "test@user.com" });
        const code = await EmailConfirmation.findOne({ userId: user._id });
        const data = {
            userId: user._id,
            verificationCode: code.verificationCode
        };

        const res = await request(app).post('/api/v1/emailConfirmation').send(data);
        expect(res.status).toBe(202);
    });
});

describe('POST /signin', () => {
    it('should return 200, sucessful login', async () => {
        const data = {
            email: "test@user.com",
            password: "EgyBiztonságosJelszó123"
        };

        const res = await request(app).post('/api/v1/signin').send(data);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("token");
    });
    it('should return 422', async () => {
        const data = {
            email: "test@user.com",
            password: ""
        };

        const res = await request(app).post('/api/v1/signin').send(data);
        expect(res.status).toBe(422);
    });
    it('should return 403', async () => {
        await Users.findOneAndUpdate({ email: "test@user.com" }, { isActive: false });
        const data = {
            email: "test@user.com",
            password: "EgyBiztonságosJelszó123"
        };

        const res = await request(app).post('/api/v1/signin').send(data);
        expect(res.status).toBe(403);
    });
});

describe('POST /isValidToken', () => {
    it('should return 200, the token is valid', async () => {
        const user = await Users.findOne({ email: "test@user.com" });
        const payload = {
            userId: user._id,
            roles: user.roles
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        const data = {
            token: token,
        };

        const res = await request(app).post('/api/v1/isValidToken').send(data);
        expect(res.status).toBe(200);
    });
    it('should return 409, the token is expired', async () => {
        const user = await Users.findOne({ email: "test@user.com" });
        const payload = {
            userId: user._id,
            roles: user.roles
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "-1s" });

        const data = {
            token: token,
        };

        const res = await request(app).post('/api/v1/isValidToken').send(data);
        expect(res.status).toBe(409);
    });
    it('should return 404, the token is not found', async () => {
        const data = {
            token: ""
        };

        const res = await request(app).post('/api/v1/isValidToken').send(data);
        expect(res.status).toBe(404);
    });
});