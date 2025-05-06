var express = require('express');
const { createItinerary, getAllItineraries, getItinerary, updateItinerary, deleteItinerary } = require('../controllers/itineraries.controller');
const router = express.Router();

/* POST Create an itinerary*/
router.post('/', createItinerary);

/* Get all itineraries (supports filtering by destination) */
router.get('/', getAllItineraries);

/* Get a specific itinerary */
router.get('/:id', getItinerary);

/* Update an itinerary */
router.put('/:id', updateItinerary);

/* Delete an itinerary */
router.delete('/:id', deleteItinerary);

module.exports = router;