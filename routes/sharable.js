const express = require('express');
const router = express.Router();
const { getPublicItinerary } = require('../controllers/sharable.controller');

/* GET a sharable itinerary link */
router.get('/:shareableId',getPublicItinerary);

module.exports = router;