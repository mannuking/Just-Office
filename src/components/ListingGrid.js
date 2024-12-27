import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OFFICE_LISTINGS, OFFICE_TYPES } from '../data/officeListings';
import { FaFilter } from 'react-icons/fa';
import './ListingGrid.css';

function ListingGrid() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);

  // Filter listings based on city, type, and price
  const filteredListings = OFFICE_LISTINGS.filter(listing => 
    listing.city === city && 
    (selectedType ? listing.type === selectedType : true) &&
    listing.monthlyRate >= priceRange[0] &&
    listing.monthlyRate <= priceRange[1]
  );

  return (
    <div className="listing-grid-container">
      <div className="filters">
        <div className="filter-section">
          <label>Office Type</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {OFFICE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label>Price Range (Monthly)</label>
          <div className="price-range">
            <input 
              type="range" 
              min="0" 
              max="50000" 
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="listings-grid">
        {filteredListings.length === 0 ? (
          <div className="no-listings">
            <p>No office spaces found in {city}.</p>
          </div>
        ) : (
          filteredListings.map(listing => (
            <div 
              key={listing.id} 
              className="listing-card"
              onClick={() => navigate(`/listing/${listing.id}`)}
            >
              <img 
                src={listing.images[0]} 
                alt={listing.title} 
                className="listing-image"
              />
              <div className="listing-details">
                <h3>{listing.title}</h3>
                <p><strong>Type:</strong> {listing.type}</p>
                <p><strong>Location:</strong> {listing.address}</p>
                <div className="pricing">
                  <span>Daily: ₹{listing.dailyRate}</span>
                  <span>Monthly: ₹{listing.monthlyRate}</span>
                </div>
                <div className="listing-amenities">
                  {listing.amenities.slice(0, 3).map(amenity => (
                    <span key={amenity} className="amenity-tag">{amenity}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListingGrid;
