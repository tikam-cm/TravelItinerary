const { getPublicItinerary } = require('../sharable.controller'); // Update path
const Itinerary = require('../../models/itinerary.schema');
const { NotFound } = require('http-errors');

jest.mock('../../models/itinerary.schema'); // Mock the model

// Mock MongoDB functions
jest.mock('../../models/itinerary.schema', () => ({
    findById: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));
describe('getPublicItinerary Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
        req = { params: { shareableId: 'mockShareableId' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return itinerary successfully when found', async () => {
        // Mock database response
        Itinerary.findOne = jest.fn().mockImplementation(() => ({
            select: jest.fn().mockResolvedValue({
                _id: 'mockItineraryId',
                shareableId: 'mockShareableId',
                title: 'Paris Trip',
                destination: 'Paris',
            }),
        }));
        

        await getPublicItinerary(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            _id: 'mockItineraryId',
            shareableId: 'mockShareableId',
            title: 'Paris Trip',
            destination: 'Paris'
        }));
    });

    it('should return 404 error when itinerary is not found', async () => {
        Itinerary.findOne = jest.fn().mockImplementation(() => ({
            select: jest.fn().mockResolvedValue(null),
        }));
        ; // Simulate missing itinerary

        await expect(getPublicItinerary(req, res)).rejects.toThrow(NotFound);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should exclude userId from response', async () => {
        Itinerary.findOne = jest.fn().mockImplementation(() => ({
            select: jest.fn().mockResolvedValue({
                _id: 'mockItineraryId',
                shareableId: 'mockShareableId',
                title: 'Paris Trip',
                destination: 'Paris',
                // Do NOT include userId
            }),
        }));
        ;

        await getPublicItinerary(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).not.toHaveBeenCalledWith(expect.objectContaining({ userId: 'mockUserId' }));
    });
});
