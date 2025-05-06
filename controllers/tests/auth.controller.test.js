const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const { registerUser, loginUser } = require('../auth.controller'); // Update with correct path
const User = require('../../models/user.schema'); // Mocked model
const { BadRequest, Unauthorized } = require('http-errors');

// Mock Express app
const app = express();
app.use(express.json());
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);

// Mock NodeCache instance
jest.mock('node-cache', () => {
    return jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    }));
});

// Mock MongoDB functions
jest.mock('../../models/user.schema', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

describe('Auth API Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    // **Register Tests**
    it('should register a new user successfully', async () => {
        User.findOne.mockResolvedValue(null); // No existing user
        User.create.mockResolvedValue({
            _id: 'mockUserId',
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'hashedPassword'
        });

        const req = {
            body: { name: 'John Doe', email: 'johndoe@example.com', password: 'securepassword123' }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User created successfully',
            user: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                id: 'mockUserId'
            }
        });
    });

    it('should return error if user already exists', async () => {
        User.findOne.mockResolvedValue({ email: 'johndoe@example.com' });

        const req = {
            body: { name: 'John Doe', email: 'johndoe@example.com', password: 'securepassword123' }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await expect(registerUser(req, res)).rejects.toThrow(BadRequest);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    // **Login Tests**
    it('should log in an existing user with correct credentials', async () => {
        const hashedPassword = await bcrypt.hash('securepassword123', 10);
        User.findOne.mockResolvedValue({
            _id: 'mockUserId',
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: hashedPassword
        });

        const req = {
            body: { email: 'johndoe@example.com', password: 'securepassword123' }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    });

    it('should return error if user does not exist', async () => {
        User.findOne.mockResolvedValue(null);

        const req = {
            body: { email: 'unknown@example.com', password: 'securepassword123' }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await expect(loginUser(req, res)).rejects.toThrow(BadRequest);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return error for incorrect password', async () => {
        const hashedPassword = await bcrypt.hash('securepassword123', 10);
        User.findOne.mockResolvedValue({
            _id: 'mockUserId',
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: hashedPassword
        });

        const req = {
            body: { email: 'johndoe@example.com', password: 'wrongpassword' }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await expect(loginUser(req, res)).rejects.toThrow(Unauthorized);
        expect(res.status).toHaveBeenCalledWith(401);
    });
});
