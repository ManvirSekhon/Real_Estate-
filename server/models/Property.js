const mongoose = require('mongoose');

const Property = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true,
        min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
        type: Number,
        required: true,
        min: [0, 'Bathrooms cannot be negative']
    },
    square_foot: {
        type: Number,
        required: true,
        min: [0, 'Square footage cannot be negative']
    },
    parking:{
        type: String,
        required: true
    },
    property_type: {
        type: String,
        required: true
    },
    // user reference
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    cloudinary_id: {
        type: String,
        required: true
    }
}, { timestamps: true }) 

const property = mongoose.model('Property', Property);

module.exports = property;