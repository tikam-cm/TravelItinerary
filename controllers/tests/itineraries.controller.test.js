const request = require('supertest');
const express = require('express');
const NodeCache = require('node-cache');
const { NotFound, BadRequest } = require('http-errors');
const { createItinerary, getAllItineraries, getItinerary, updateItinerary, deleteItinerary } = require('../itineraries.controller'); // Update path
const Itinerary = require('../../models/itinerary.schema');

// Mock Express app
const app = express();
app.use(express.json());
app.post('/api/itineraries', createItinerary);
app.get('/api/itineraries', getAllItineraries);
app.get('/api/itineraries/:id', getItinerary);
app.put('/api/itineraries/:id', updateItinerary);
app.delete('/api/itineraries/:id', deleteItinerary);

// Mock NodeCache instance
jest.mock('node-cache', () => {
    return jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        keys: jest.fn().mockReturnValue([]),
    }));
});

// Mock MongoDB functions
jest.mock('../../models/itinerary.schema', () => ({
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

describe('Itinerary API Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // **Create Itinerary**
    it('should create an itinerary successfully', async () => {
        Itinerary.create.mockResolvedValue({
            _id: 'mockItineraryId',
            userId: 'mockUserId',
            title: 'Paris Trip',
            destination: 'Paris',
            startDate: '2025-05-10',
            endDate: '2025-05-20',
        });

        const req = { body: { title: 'Paris Trip', destination: 'Paris', startDate: '2025-05-10', endDate: '2025-05-20' }, user: { id: 'mockUserId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await createItinerary(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Itinerary created successfully',
            itinerary: expect.any(Object)
        });
    });

    // **Get All Itineraries**
    it('should return all itineraries for a user', async () => {
        Itinerary.find = jest.fn().mockImplementation(() => ({
            skip: jest.fn().mockImplementation(() => ({
                limit: jest.fn().mockImplementation(() => ({
                    sort: jest.fn().mockResolvedValue([{ _id: 'mockItineraryId', title: 'Paris Trip' }])
                }))
            }))
        }));

        const req = { user: { id: 'mockUserId' }, query: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getAllItineraries(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    });

    // **Get Single Itinerary**
    it('should return a single itinerary by ID', async () => {
        Itinerary.findById.mockResolvedValue({ _id: 'mockItineraryId', title: 'Paris Trip', destination: 'Paris' });

        const req = { params: { id: 'mockItineraryId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getItinerary(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    });

    // **Update Itinerary**
    it('should update an itinerary successfully', async () => {
        Itinerary.findByIdAndUpdate.mockResolvedValue({ _id: 'mockItineraryId', title: 'Updated Trip' });

        const req = { params: { id: 'mockItineraryId' }, body: { title: 'Updated Trip' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await updateItinerary(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalled();
    });

    // **Delete Itinerary**
    it('should delete an itinerary successfully', async () => {
        Itinerary.findByIdAndDelete.mockResolvedValue({ _id: 'mockItineraryId', title: 'Paris Trip' });

        const req = { params: { id: 'mockItineraryId' }, user: { id: 'mockUserId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await deleteItinerary(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalled();
    });

    // **Error Handling**
    it('should return error when trying to retrieve nonexistent itinerary', async () => {
        Itinerary.findById.mockResolvedValue(null);

        const req = { params: { id: 'invalidId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await expect(getItinerary(req, res)).rejects.toThrow(NotFound);
        expect(res.status).toHaveBeenCalledWith(404);
    });
});
