const request = require('supertest');
const express = require('express');
const sharableController = require('../controllers/sharable.controller');
const router = require('../routes/sharable');

jest.mock('../controllers/sharable.controller');

const app = express();
app.use(express.json());
app.use('/api/sharable', router);

describe('Sharable Itinerary Route Integration Tests (Mocked)', () => {
    
    /* Mocked GET sharable itinerary */
    test('GET /api/sharable/:shareableId - should return a public itinerary', async () => {
        sharableController.getPublicItinerary.mockImplementation((req, res) => {
            res.status(200).json({
                shareableId: req.params.shareableId,
                destination: 'Paris',
                startDate: '2025-06-15',
                endDate: '2025-06-20',
                activities: ['Visit Eiffel Tower', 'Explore Louvre Museum']
            });
        });

        const response = await request(app)
            .get('/api/sharable/some-valid-id');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('destination', 'Paris');
        expect(response.body).toHaveProperty('shareableId', 'some-valid-id');
    });

});
