var express = require('express');
var router = express.Router();

/* POST Create an itinerary*/
router.post('/itineraries', function(req, res, next) {
    res.send('Create itineraries');
});

/* Get all itineraries (supports filtering by destination) */
router.get('/', function(req, res, next){
    res.send('Get all itineraries');
});

/* Get a specific itinerary */
router.get('/:id', function(req, res, next){
    res.send(`Get itinerary with ${req.params.id}`);
});

/* Update an itinerary */
router.put('/:id', function(req, res, next){
    res.send(`Update itinerary with ${req.params.id}`);
});

/* Delete an itinerary */
router.delete('/:id', function(req, res, next){
    res.send(`Delete itinerary with ${req.params.id}`);
});

module.exports = router;