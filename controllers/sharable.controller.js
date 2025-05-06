const asyncHandler = require('express-async-handler');
const { NotFound } = require('http-errors');
const Itinerary = require('../models/itinerary.schema');

const getPublicItinerary = asyncHandler(async (req, res) => {
    const { shareableId } = req.params;

    // Retrieve itinerary but exclude `userId`
    const itinerary = await Itinerary.findOne({ shareableId }).select('-userId');

    if (!itinerary) {
        res.status(404);
        throw new NotFound('Itinerary not found or is private');
    }

    res.status(200).json(itinerary);
});

module.exports = {
    getPublicItinerary,
}