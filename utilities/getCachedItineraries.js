const getCachedItineraries = (userId, cache) => {
    const regex = new RegExp(`(?<=itineraries:)${userId}(?=:\\d+:\\d+:[a-zA-Z]+:)`);

    const allKeys = cache.keys(); // Get all cached keys
    const matchingKeys = allKeys.filter(key => key.match(regex)); // Filter keys matching regex
    return matchingKeys; // Return matching keys
    /*
    // If you want to retrieve the values as well, you can do so like this:
    const matchingRecords = matchingKeys.map(key => ({
        key,
        value: cache.get(key) // Retrieve cached values
    }));
    return matchingRecords;
    */
};

module.exports = {getCachedItineraries};
