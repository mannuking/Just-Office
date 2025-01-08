const mongoose = require("mongoose");

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
  images: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
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
    required: false,
    default: null,
  },
  amenities: {
    type: [String],
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("Listing", ListingSchema);
