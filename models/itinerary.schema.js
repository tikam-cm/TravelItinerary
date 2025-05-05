const mongoose  = require("mongoose");

const itinerarySchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    destination:{
        type: String,
        required: true,
    },
    startDate:{
        type: ISODate,
        required: true,
    },
    endDate:{
        type: ISODate,
        required: true,
    },
    activities:[
        {
            time:{
                type: String,
                required: true,
            },
            desciption:{
                type: String,
                required: true,
            },
            location:{
                type: String,
                required: true,
            },
        }
        ],
    createdAt:{
        type: ISODate,
    },
    updatedAt:{
        type: ISODate,
    },
});

module.exports = mongoose.model('Itinerary', itinerarySchema);