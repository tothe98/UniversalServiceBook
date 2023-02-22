const app = require('../server');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const ROLES = require('../core/Role');

describe('GET /isLoggedIn', () => {
    it('should return 200', async () => {
        const token = jwt.sign({ userId: "6zwiezzzt675z", roles: [ROLES.User] }, process.env.JWT_SECRET);
        const res = await request(app).get('/api/v1/isLoggedIn').set("x-access-token", token);
        expect(res.status).toBe(200);
    });
    it('should return 401', async () => {
        const token = "";
        const res = await request(app).get('/api/v1/isLoggedIn').set("x-access-token", token);
        expect(res.status).toBe(401);
    });
});

describe('GET *', () => {
    it('should return 404', async () => {
        const res = await request(app).get('/api/v1/teszt');
        expect(res.status).toBe(404);
    });
});