const asyncHandler = require('express-async-handler');
const { NotFound } = require('http-errors');


const itinerary = require('../models/itinerary.schema');

/*
@route POST /api/itineraries
@desc get all itineraries
@access private
*/
const createItinerary = asyncHandler(async (req, res) => {
    const itineraryData = await itinerary.create(req.body);
    if (itineraryData) {
        res.status(201).json({
            message: 'Itinerary created successfully',
            itinerary: {
                id: itineraryData._id,
                ...itineraryData._doc
            }
        });
    }
    else{
        res.status(400);
        throw new BadRequest('Invalid itinerary data');
    }
});

/*
@route GET /api/itineraries/
@desc get all itineraries
@access private
*/
const getAllItineraries = asyncHandler(async (req, res) => {
    const itineraries = await itinerary.find({userId: req.user.id});
    if (!itineraries) {
        res.status(404);
        throw new NotFound('No itineraries found');
    }
    res.status(200).json(itineraries);
});

/*
@route GET /api/itineraries/:id
@desc get all itineraries
@access private
*/
const getItinerary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const itineraryData = await itinerary.findById(id);
    if (!itineraryData) {
        res.status(404);
        throw new NotFound('Itinerary not found');
    }
    res.status(200).json(itineraryData);
});

/*
@route PUT /api/itineraries/:id
@desc get all itineraries
@access private
*/
const updateItinerary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const itineraryData = await itinerary.findByIdAndUpdate(id, req.body)
    if (!itineraryData) {
        res.status(404);
        throw new NotFound('Itinerary not found');
    }
    res.status(204).json(itineraryData);
});

/*
@route DELETE /api/itineraries/:id
@desc get all itineraries
@access private
*/
const deleteItinerary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const itineraryData = await itinerary.findByIdAndDelete(id);
    if (!itineraryData) {
        res.status(404);
        throw new NotFound('Itinerary not found');
    }
    res.status(204).json(itineraryData);
});

module.exports = {
    createItinerary,
    getAllItineraries,
    getItinerary,
    updateItinerary,
    deleteItinerary
}