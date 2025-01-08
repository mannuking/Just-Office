const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    console.log('Auth middleware - checking token');
    console.log('Headers:', req.headers);
    
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Extracted token:', token ? 'Present' : 'Missing');

    // Check if no token
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        console.log('Verifying token with JWT_SECRET');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully');
        console.log('Decoded user:', decoded.user);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ 
            message: 'Token is not valid',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

const handleListingSubmit = async (event) => {
  event.preventDefault();
  setFormError(null);
  setIsSubmitting(true);
  setSubmitSuccess(false);

  const token = localStorage.getItem("token");
  if (!token) {
    setFormError("Please login to list a space.");
    setIsSubmitting(false);
    return;
  }

  try {
    // First upload images and get their URLs
    const imageUrls = [];
    for (const image of uploadedImages) {
      const imageFormData = new FormData();
      imageFormData.append('image', image);
      
      const uploadResponse = await fetch('http://localhost:5000/api/listings/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: imageFormData
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload images');
      }
      
      const { url } = await uploadResponse.json();
      imageUrls.push(url);
    }

    // Create listing with image URLs
    const listingData = {
      type: event.target.elements["type"].value,
      name: event.target.elements["establishment"].value,
      ownership: event.target.elements["ownership"].value,
      city: event.target.elements["city"].value,
      address: event.target.elements["address"].value,
      imageUrls: imageUrls,
      contactName: event.target.elements["contactName"].value,
      contactPhone: event.target.elements["contactPhone"].value,
      contactEmail: event.target.elements["contactEmail"].value,
      monthlyRate: Number(event.target.elements["monthlyRate"].value)
    };

    const response = await fetch('http://localhost:5000/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listingData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create listing");
    }

    const responseData = await response.json();
    setSubmitSuccess(true);
    setUploadedImages([]);
    event.target.reset();
    if (props.onListingsUpdate) {
      props.onListingsUpdate();
    }
    setTimeout(() => setShowListingForm(false), 2000);

  } catch (error) {
    console.error('Error creating listing:', error);
    setFormError(error.message || 'Failed to create listing. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
