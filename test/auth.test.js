const request = require('supertest');
const express = require('express');
const authController = require('../controllers/auth.controller');
const router = require('../routes/auth');

jest.mock('../controllers/auth.controller');

const app = express();
app.use(express.json());
app.use('/auth', router);

describe('Auth Routes Integration Tests (Mocked)', () => {
    
    /* Mocked Register User */
    test('POST /auth/register - should register a new user', async () => {
        authController.registerUser.mockImplementation((req, res) => {
            res.status(201).json({ message: 'User registered successfully' });
        });

        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    /* Mocked Login User */
    test('POST /auth/login - should authenticate and return JWT', async () => {
        authController.loginUser.mockImplementation((req, res) => {
            res.status(200).json({ token: 'mocked-jwt-token' });
        });

        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token', 'mocked-jwt-token');
    });

});
