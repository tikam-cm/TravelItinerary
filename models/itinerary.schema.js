const mongoose  = require("mongoose");

const Schema = mongoose.Schema, ObjectId = Schema.ObjectId, ISODate = Schema.Types.Date;

const itinerarySchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        index: true,
    },
    title:{
        type: String,
        required: true,
    },
    destination:{
        type: String,
        required: true,
        index: true,
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
            description:{
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
        default: Date.now,
    },
    updatedAt:{
        type: ISODate,
        default: Date.now,
    },
});

module.exports = mongoose.model('Itinerary', itinerarySchema);