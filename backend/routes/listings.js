const express = require('express');
const router = express.Router();
<<<<<<< HEAD
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
=======
const auth = require('../middleware/auth');
const Listing = require('../models/Listing');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function(req, file, cb) {
        cb(null, 'listing-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).array('images', 5); // Allow up to 5 images

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only (jpeg, jpg, png, gif)');
    }
}

// Serve uploaded files statically
router.use('/uploads', express.static(uploadDir));

// @route   POST api/listings
// @desc    Create a new listing
// @access  Private
router.post('/', auth, (req, res) => {
    console.log('POST /api/listings - Creating new listing');
    console.log('Request body:', req.body);
    
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error uploading files:', err);
            return res.status(400).json({ message: err.message || 'Error uploading files' });
        }

        console.log('Uploaded files:', req.files);

        try {
            const imageUrls = req.files ? req.files.map(file => `/api/listings/uploads/${file.filename}`) : [];

            const listing = new Listing({
                ...req.body,
                images: imageUrls,
                owner: req.user.id,
                price: Number(req.body.price),
                size: Number(req.body.size),
                amenities: Array.isArray(req.body['amenities[]']) ? req.body['amenities[]'] : [req.body['amenities[]']].filter(Boolean)
            });

            await listing.save();
            console.log('New listing created:', listing);
            res.json(listing);
        } catch (error) {
            console.error('Error creating listing:', error);
            res.status(500).json({ message: 'Error creating listing', error: error.message });
        }
    });
});

// @route   GET api/listings
// @desc    Get all listings
// @access  Public
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ message: 'Error fetching listings' });
    }
});

// @route   GET api/listings/:id
// @desc    Get listing by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.json(listing);
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ message: 'Error fetching listing' });
    }
});

// @route   DELETE api/listings/:id
// @desc    Delete a listing
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check ownership
        if (listing.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete associated images
        listing.images.forEach(imageUrl => {
            const filename = imageUrl.split('/').pop();
            const filepath = path.join(uploadDir, filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        });

        await listing.remove();
        res.json({ message: 'Listing removed' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ message: 'Error deleting listing' });
    }
});
>>>>>>> d36ce13f62119f069089f57109fb746dc1f53642

module.exports = router;
