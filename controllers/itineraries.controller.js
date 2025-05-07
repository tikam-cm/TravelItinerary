require('dotenv').config();
const asyncHandler = require('express-async-handler');
const { NotFound, BadRequest} = require('http-errors');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: process.env.CACHE_TIMEOUT || 300 }); // 5 minutes default

const { getCachedItineraries } = require('../utilities/getCachedItineraries')

const Itinerary = require('../models/itinerary.schema');
const { mongo } = require('mongoose');
const { sendMailNotification } = require('../utilities/mailerUtility');

/*
@route POST /api/itineraries
@desc get all itineraries
@access private
*/
const createItinerary = asyncHandler(async (req, res) => {
    const itinerary = {
        userId: req.user.id,
        title: req.body.title,
        destination: req.body.destination,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        activities: req.body.activities,
        shareableId: new mongo.ObjectId(),
    }
    const itineraryData = await Itinerary.create(itinerary);

    if (itineraryData) {
        console.log('itineraryData:', itineraryData._id);
        cache.set(itineraryData._id.toString(), itineraryData);
        console.log('itineraryData:', itineraryData._id);
        sendMailNotification(req.user.email, itineraryData);
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
    const { page = 1, limit = 10, sort = "startDate", destination } = req.query;
    const searchQuery = { userId: req.user.id };

    if (destination) {
        searchQuery.destination = new RegExp(destination, 'i'); // Case-insensitive search
    }

    const skip = (page - 1) * limit;
    const validSortFields = ['createdAt', 'startDate', 'title'];

    if (!validSortFields.includes(sort)) {
        res.status(400);
        throw new BadRequest('Invalid sort field');
    }

    // Generate cache key
    const cacheKey = `itineraries:${req.user.id}:${page}:${limit}:${sort}:${destination || ''}`;
    console.log('cacheKey:', cacheKey);
    let itineraries = cache.get(cacheKey);

    if (!itineraries) {
        // Fetch from database if not in cache
        itineraries = await Itinerary.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .sort({ [sort]: 1 }); // Will sort results in ascending order

        if (!itineraries.length) {
            res.status(404);
            throw new NotFound('No itineraries found');
        }

        // Store results in cache
        cache.set(cacheKey, itineraries);
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
    // Check if itinerary is in cache
    let itineraryData = cache.get(id);
    if (!itineraryData) {
        itineraryData = await Itinerary.findById(id);

        if (!itineraryData) {
            res.status(404);
            throw new NotFound('Itinerary not found');
        }

        // Store retrieved data in cache
        cache.set(id, itineraryData);
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
    const itineraryData = await Itinerary.findByIdAndUpdate(id, req.body)
    if (!itineraryData) {
        res.status(404);
        throw new NotFound('Itinerary not found');
    }
    // Invalidate the cache for this itinerary
    cache.del(id);

    // Store updated itinerary in cache
    cache.set(id, itineraryData);
    res.status(204).json(itineraryData);
});

/*
@route DELETE /api/itineraries/:id
@desc get all itineraries
@access private
*/
const deleteItinerary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const itineraryData = await Itinerary.findByIdAndDelete(id);
    if (!itineraryData) {
        res.status(404);
        throw new NotFound('Itinerary not found');
    }

    // Invalidate the cache for this this user
    const keys = getCachedItineraries(req.user.id, cache);
    cache.del(keys);
    // Remove itinerary from cache
    cache.del(id);

    res.status(204).json(itineraryData);
});

module.exports = {
    createItinerary,
    getAllItineraries,
    getItinerary,
    updateItinerary,
    deleteItinerary
}