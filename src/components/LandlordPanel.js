import React, { useState } from 'react';
import './LandlordPanel.css';

function LandlordPanel() {
  const [showAddForm, setShowAddForm] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add listing');
      }

      setShowAddForm(false);
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
      // Refresh listings
    } catch (error) {
      console.error('Error adding listing:', error);
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

              <button type="submit" className="submit-btn">
                Add Property
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="properties-grid">
        {/* Property listings will be displayed here */}
      </div>
    </div>
  );
}

export default LandlordPanel;
