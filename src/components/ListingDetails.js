import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OFFICE_LISTINGS } from '../data/officeListings';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaWifi, FaCar, FaCoffee, FaArrowLeft } from 'react-icons/fa';
import './ListingDetails.css';

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  
  const listing = OFFICE_LISTINGS.find(l => l.id === parseInt(id));
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  if (!listing) {
    return <div className="error-message">Listing not found</div>;
  }

  const onSubmit = (data) => {
    // In a real app, this would send data to a backend
    console.log('Form submitted:', data);
    toast.success('Inquiry submitted successfully! We will contact you soon.');
    setShowInquiryForm(false);
    reset();
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
      case 'high-speed wifi':
        return <FaWifi />;
      case 'parking':
        return <FaCar />;
      case 'pantry':
      case 'kitchen':
        return <FaCoffee />;
      default:
        return null;
    }
  };

  return (
    <div className="listing-details-container">
      <button 
        className="back-button" 
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back
      </button>

      <div className="listing-details-content">
        <div className="image-gallery">
          {listing.images.map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt={`${listing.title} - Image ${index + 1}`} 
              className="listing-detail-image"
            />
          ))}
        </div>

        <div className="listing-info">
          <h1>{listing.title}</h1>
          <p className="address">{listing.address}</p>
          
          <div className="pricing-info">
            <div className="price-card">
              <h3>Daily Rate</h3>
              <p>₹{listing.dailyRate}</p>
            </div>
            <div className="price-card">
              <h3>Monthly Rate</h3>
              <p>₹{listing.monthlyRate}</p>
            </div>
          </div>

          <div className="amenities-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {listing.amenities.map(amenity => (
                <div key={amenity} className="amenity-item">
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="description-section">
            <h2>About this space</h2>
            <p>{listing.description}</p>
          </div>

          <div className="action-buttons">
            <button 
              className="inquiry-button"
              onClick={() => setShowInquiryForm(true)}
            >
              Request a Callback
            </button>
          </div>
        </div>

        {showInquiryForm && (
          <div className="inquiry-form-overlay">
            <div className="inquiry-form">
              <h2>Request Information</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    {...register("name", { required: "Name is required" })} 
                    placeholder="Your name"
                  />
                  {errors.name && <span className="error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input 
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })} 
                    placeholder="Your email"
                  />
                  {errors.email && <span className="error">{errors.email.message}</span>}
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    {...register("phone", { 
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Invalid phone number"
                      }
                    })} 
                    placeholder="Your phone number"
                  />
                  {errors.phone && <span className="error">{errors.phone.message}</span>}
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-button">Submit</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowInquiryForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListingDetails;
