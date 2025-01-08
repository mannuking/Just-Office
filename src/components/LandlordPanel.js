import React, { useState, useEffect } from 'react';
import './LandlordPanel.css';

function LandlordPanel() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'office',
    address: '',
    city: '',
    price: '',
    size: '',
    amenities: [],
    description: '',
    images: []
  });

  const amenitiesOptions = [
    'WiFi',
    'Air Conditioning',
    'Parking',
    'Meeting Rooms',
    'Reception',
    'Security',
    'Cafeteria',
    'Printer/Scanner',
    '24/7 Access'
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/listings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to add a listing');
      }

      console.log('Starting form submission...');
      const formDataToSend = new FormData();

      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          if (Array.isArray(formData[key])) {
            formData[key].forEach(value => formDataToSend.append(`${key}[]`, value));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Append image files
      if (formData.images) {
        Array.from(formData.images).forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      console.log('Form data prepared:', {
        title: formData.title,
        type: formData.type,
        address: formData.address,
        city: formData.city,
        price: formData.price,
        size: formData.size,
        amenities: formData.amenities,
        images: formData.images.length + ' files'
      });

      const response = await fetch('http://localhost:5001/api/listings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      console.log('Server response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to add listing');
      }

      // Fetch updated listings
      await fetchListings();
      
      setShowAddForm(false);
      setError(null);
      setFormData({
        title: '',
        type: 'office',
        address: '',
        city: '',
        price: '',
        size: '',
        amenities: [],
        description: '',
        images: []
      });
    } catch (error) {
      console.error('Error adding listing:', error);
      setError(error.message || 'Failed to add listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="landlord-panel">
      <header className="panel-header">
        <h1>Property Management</h1>
        <button 
          className="add-property-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add New Property
        </button>
      </header>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="add-property-modal">
            <button 
              className="close-modal"
              onClick={() => setShowAddForm(false)}
            >
              ×
            </button>
            <h2>Add New Property</h2>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="property-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter property title"
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="office">Private Office</option>
                  <option value="coworking">Coworking Space</option>
                  <option value="meeting">Meeting Room</option>
                  <option value="virtual">Virtual Office</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  placeholder="Enter property address"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                  placeholder="Enter city"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (per month)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    placeholder="Enter price"
                  />
                </div>

                <div className="form-group">
                  <label>Size (sq ft)</label>
                  <input
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    required
                    placeholder="Enter size"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <div className="amenities-grid">
                  {amenitiesOptions.map(amenity => (
                    <label key={amenity} className="amenity-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Enter property description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFormData({...formData, images: Array.from(e.target.files)})}
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Adding Property...' : 'Add Property'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="properties-grid">
        {listings.map(listing => (
          <div key={listing._id} className="property-card">
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <div className="property-details">
              <span>Type: {listing.type}</span>
              <span>Price: ${listing.price}/month</span>
              <span>Size: {listing.size} sq ft</span>
              <span>Location: {listing.city}</span>
            </div>
            {listing.images && listing.images.length > 0 && (
              <div className="property-images">
                {listing.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`${listing.title} - Image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandlordPanel;
