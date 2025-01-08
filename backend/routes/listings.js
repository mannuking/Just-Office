const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const multer = require("multer");

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET api/listings
// @desc    Get all listings
// @access  Public
// @route   GET api/listings/:id
// @desc    Get a listing by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET api/listings
// @desc    Get all listings
// @access  Public
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// @route   POST api/listings
// @desc    Create a new listing
// @access  Public
router.post("/", upload.array("images"), async (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Received files:", req.files);

  try {
    const {
      type,
      name,
      ownership,
      city,
      address,
      contactName,
      contactPhone,
      contactEmail,
      monthlyRate,
    } = req.body;

    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }

    const images = req.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));

    const amenities = req.body.amenities
      ? JSON.parse(req.body.amenities)
      : [];

    // Create a new listing object
    const newListing = new Listing({
      type,
      name,
      ownership,
      city,
      address,
      images,
      contactName,
      contactPhone,
      contactEmail,
      monthlyRate: monthlyRate ? parseInt(monthlyRate, 10) : null,
      amenities,
    });

    const listing = await newListing.save();
    console.log("New listing saved:", listing);

    res.json(listing);
  } catch (err) {
    console.error("Error saving listing:", err);
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
      res.status(400).json({ message: "Validation Error", errors: validationErrors });
    } else {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
});

module.exports = router;
