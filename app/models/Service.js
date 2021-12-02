const mongoose = require('mongoose');
const geocoder = require('../../utils/geocoder')

const ServiceSchema = new mongoose.Schema({
    serviceId: {
        type: String,
        required: [true, 'Please enter your name'],
        unique: true,
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    interests: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Geocode & create location
ServiceSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address)
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude]
    }

    // Do not save address
    this.address = undefined;
    next();
});

module.exports = mongoose.model('Services', ServiceSchema)