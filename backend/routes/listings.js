const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// @route   POST api/listings
// @desc    Create a new listing
// @access  Public
router.post("/", async (req, res) => {
  console.log("Received request body:", req.body);
  try {
    const {
      type,
      name,
      ownership,
      city,
      address,
      imageUrls,
      contactName,
      contactPhone,
      contactEmail,
      monthlyRate,
    } = req.body;

    // Log the parsed imageUrls to check if it's an array
    const parsedImageUrls = JSON.parse(imageUrls);
    console.log("Parsed imageUrls:", parsedImageUrls);

    if (!Array.isArray(parsedImageUrls)) {
      throw new Error("imageUrls must be an array");
    }

    const newListing = new Listing({
      type,
      name,
      ownership,
      city,
      address,
      imageUrls: parsedImageUrls,
      contactName,
      contactPhone,
      contactEmail,
      monthlyRate: monthlyRate ? parseInt(monthlyRate, 10) : null,
    });

const listing = await newListing.save();
      console.log('New listing saved:', listing);

      res.json(listing);
    } catch (err) {
      console.error('Error saving listing:', err.message);
      if (err.name === "SyntaxError") {
        res.status(400).send("Invalid JSON");
      } else {
        res.status(500).send("Server Error");
      }
    }
  }
);

module.exports = router;
