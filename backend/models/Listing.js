const mongoose = require('mongoose');

<<<<<<< HEAD
const ListingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ownership: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  imageUrls: [{
    type: String,
    required: true,
  }],
  contactName: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  monthlyRate: {
    type: Number,
    required: false, // Can be null
    default: null, // Default value is null
  },
});

module.exports = mongoose.model('Listing', ListingSchema);
=======
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['office', 'coworking', 'meeting', 'virtual']
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    amenities: [{
        type: String
    }],
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Listing', listingSchema);
>>>>>>> d36ce13f62119f069089f57109fb746dc1f53642
