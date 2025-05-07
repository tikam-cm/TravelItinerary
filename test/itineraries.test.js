const request = require('supertest');
const express = require('express');
const itineraryController = require('../controllers/itineraries.controller');
const router = require('../routes/itineraries');

jest.mock('../controllers/itineraries.controller');

const app = express();
app.use(express.json());
app.use('/api/itineraries', router);

describe('Itinerary Routes Integration Tests (Mocked)', () => {
    
    /* Mocked Create Itinerary */
    test('POST /api/itineraries - should create a new itinerary', async () => {
        itineraryController.createItinerary.mockImplementation((req, res) => {
            res.status(201).json({ message: 'Itinerary created successfully' });
        });

        const response = await request(app)
            .post('/api/itineraries')
            .send({
                destination: 'Paris',
                startDate: '2025-06-15',
                endDate: '2025-06-20',
                activities: ['Visit Eiffel Tower', 'Explore Louvre Museum']
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Itinerary created successfully');
    });

    /* Mocked Get All Itineraries */
    test('GET /api/itineraries - should return all itineraries', async () => {
        itineraryController.getAllItineraries.mockImplementation((req, res) => {
            res.status(200).json([{ destination: 'Paris' }, { destination: 'New York' }]);
        });

        const response = await request(app)
            .get('/api/itineraries');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    /* Mocked Get Specific Itinerary */
    test('GET /api/itineraries/:id - should return an itinerary by ID', async () => {
        itineraryController.getItinerary.mockImplementation((req, res) => {
            res.status(200).json({ id: req.params.id, destination: 'Paris' });
        });

        const response = await request(app)
            .get('/api/itineraries/some-valid-id');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('destination', 'Paris');
    });

    /* Mocked Update Itinerary */
    test('PUT /api/itineraries/:id - should update an itinerary', async () => {
        itineraryController.updateItinerary.mockImplementation((req, res) => {
            res.status(200).json({ id: req.params.id, destination: req.body.destination });
        });

        const response = await request(app)
            .put('/api/itineraries/some-valid-id')
            .send({ destination: 'London' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('destination', 'London');
    });

    /* Mocked Delete Itinerary */
    test('DELETE /api/itineraries/:id - should delete an itinerary', async () => {
        itineraryController.deleteItinerary.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Itinerary deleted successfully' });
        });

        const response = await request(app)
            .delete('/api/itineraries/some-valid-id');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Itinerary deleted successfully');
    });

});
