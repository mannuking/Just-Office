import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaChevronRight } from 'react-icons/fa';
import { OFFICE_LISTINGS } from '../data/officeListings';
import './LandingPage.css';
import newLogo from '../images/logo.png';

function LandingPage(props) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [searchQuery, setSearchQuery] = useState('');
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleSearch = () => {
    navigate(`/listings/${selectedCity}`);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle contact form submission
    setShowContactForm(false);
  };

  const validateForm = (formData) => {
    const requiredFields = [
      'contactName',
      'contactPhone',
      'contactEmail',
      'monthlyRate',
    ];
    const errors = [];

    requiredFields.forEach((field) => {
      if (!formData.get(field)) {
        errors.push(`${field.replace('contact', '')} is required`);
      }
    });

    if (formData.get('contactPhone').length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.get('contactEmail'))) {
      errors.push('Invalid email format');
    }

    return errors;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    setUploadedImages((prev) => [...prev, ...imageFiles]);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    );
  };

  const handleListingSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    setSubmitSuccess(false);

    const formData = new FormData();
    uploadedImages.forEach((file) => {
      formData.append('images', file);
    });

    // Append each field from listingData individually
    formData.append('name', event.target.elements['establishment'].value);
    formData.append('type', event.target.elements['type'].value);
    formData.append('ownership', event.target.elements['ownership'].value);
    formData.append('city', event.target.elements['city'].value);
    formData.append('address', event.target.elements['address'].value);
    formData.append(
      'monthlyRate',
      Number(event.target.elements['monthlyRate'].value)
    );
    formData.append('contactName', event.target.elements['contactName'].value);
    formData.append(
      'contactPhone',
      event.target.elements['contactPhone'].value
    );
    formData.append(
      'contactEmail',
      event.target.elements['contactEmail'].value
    );
    formData.append('amenities', JSON.stringify(selectedAmenities));

    try {
      const response = await fetch('http://localhost:5001/api/listings', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        setSubmitSuccess(true);
        setUploadedImages([]);
        event.target.reset();
        if (props.onListingsUpdate) {
          props.onListingsUpdate();
        }
        setTimeout(() => setShowListingForm(false), 2000);
      } else {
        // Assuming the server sends back a JSON with an error message
        setFormError(
          responseData.message || 'Failed to create listing. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      setFormError(
        error.message || 'Failed to create listing. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample image data (replace with your actual data)
  const workspaceTypes = [
    {
      type: 'coworking',
      heading: 'Coworking Space',
      subheading: 'Full-time offices for teams of all sizes',
      features: [
        'Dedicated seats & private cabins',
        'Fully-equipped coworking spaces',
        'Ideal for individual or small teams',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      type: 'managed',
      heading: 'Managed Office',
      subheading: 'Dedicated office space managed by a provider',
      features: [
        'Fully furnished customized office',
        'Fully managed operations & housekeeping',
        'Ideal for 50+ team size',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      type: 'commercial',
      heading: 'Office/Commercial Spaces',
      subheading: 'Rent/Lease office space for your company',
      features: [
        'Long term contracts (3 or more years)',
        'Full customizations with self managed amenities',
        'Ideal for 100+ team size',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      type: 'day-pass',
      heading: 'Day Pass',
      subheading: 'Flexible coworking for individuals',
      features: [
        'Desks-by-the-day in coworking spaces',
        'Starting at ₹200/day',
        'Ideal for individual or small teams',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1610389051254-64849803c8fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fG1hbmFnZWQlMjBjbyUyMHdvcmtpbmclMjBvZmZpY2V8ZW58MHwwfDB8fHwy',
    },
    {
      type: 'meeting',
      heading: 'Meeting Room',
      subheading: 'Book by-the-hour or by the day',
      features: [
        'Meeting, conference and training rooms for teams',
        'Modern amenities for a seamless experience',
        'Ideal for remote & hybrid teams',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      type: 'team',
      heading: 'Team Plan',
      subheading: 'Flexible day pass for remote & hybrid teams',
      features: [
        'Centralized dashboard for entire team',
        'Manage & track bookings at one place',
        'Ideal for remote, distributed & hybrid teams',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return (
    <div className="landing-page">
      <div className="video-background">
        <div id="youtube-background"></div>
        <div className="video-overlay"></div>
      </div>

      <nav className="landing-nav">
        <Link to="/" className="logo">
          <img src={newLogo} alt="JustOfis" style={{ marginRight: '10px' }} />
          <span className="company-name">JustOfis</span>
        </Link>
        <div className="nav-links"></div>
        <div className="nav-buttons">
          <button
            onClick={() => setShowListingForm(true)}
            className="list-space-btn"
          >
            List your space
          </button>
          <button onClick={() => setShowContactForm(true)} className="share-btn">
            Share requirement
          </button>
        </div>
      </nav>

      <main className="hero-section">
        <h1 className="hero-heading">The New Way to Offices</h1>
        <p className="hero-subheading">
          A one-stop workspace solution for all work-needs. Choose between
          pay-per-use plans or fixed desks for teams and individuals.
        </p>

        <div className="search-box">
          <div className="search-inputs">
            <div className="city-select">
              <FaMapMarkerAlt />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="Delhi">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>
            <div className="search-input">
              <FaSearch />
              <input
                type="text"
                placeholder="Search location or workspaces"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button onClick={handleSearch} className="view-spaces-btn">
            View Workspaces
          </button>
        </div>

        <div className="workspace-types">
          {workspaceTypes.map((workspace) => (
            <div
              className="type-card"
              key={workspace.type}
              onClick={() => navigate(`/listings/Delhi?type=${workspace.type}`)}
            >
              <img src={workspace.imageUrl} alt={workspace.heading} />
              <div className="type-info">
                <h3 className="type-heading">{workspace.heading}</h3>
                <p className="type-subheading">{workspace.subheading}</p>
                <ul className="type-features">
                  {workspace.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="explore-btn">
                  Explore {workspace.heading}{' '}
                  <FaChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="property-marquee">
        <div className="marquee-content">
          {OFFICE_LISTINGS.map((listing) => (
            <Link
              to={`/listings/${listing.id}`}
              className="marquee-item"
              key={listing.id}
            >
              <img src={listing.images[0]} alt={listing.title} />
              <h3>{listing.title}</h3>
              <p>{listing.address}</p>
            </Link>
          ))}
          {/* Duplicate the listings to create a seamless loop */}
          {OFFICE_LISTINGS.map((listing) => (
            <Link
              to={`/listings/${listing.id}`}
              className="marquee-item"
              key={listing.id}
            >
              <img src={listing.images[0]} alt={listing.title} />
              <h3>{listing.title}</h3>
              <p>{listing.address}</p>
            </Link>
          ))}
        </div>
      </div>

      <section className="benefits-section">
        <h2 className="section-heading">Why choose JustOfis?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">₹</div>
            <h3 className="benefit-heading">Zero Brokerage Fees</h3>
            <p className="benefit-subheading">
              We charge zero brokerage fees for our office space rentals
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌐</div>
            <h3 className="benefit-heading">Large Coverage</h3>
            <p className="benefit-subheading">
              An expansive network of 500+ coworking spaces in Delhi-NCR{' '}
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3 className="benefit-heading">Quick Turnaround Time</h3>
            <p className="benefit-subheading">
              Experience swift and effective solutions with us
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👥</div>
            <h3 className="benefit-heading">
              Dedicated Office Spaces Experts
            </h3>
            <p className="benefit-subheading">
              From consulting, shortlisting to documentation, our office space
              experts will help you in finding the perfect office space.
            </p>
          </div>
        </div>
      </section>

      {showContactForm && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowContactForm(false)}
            >
              ×
            </button>
            <h2 className="modal-heading">Contact an Expert</h2>
            <form onSubmit={handleContactSubmit}>
              <input
                type="text"
                placeholder="Name"
                required
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="input-field"
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                className="input-field"
              />
              <textarea
                placeholder="Message"
                required
                className="input-field"
              ></textarea>
              <button type="submit" className="modal-submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {showListingForm && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowListingForm(false)}
            >
              ×
            </button>
            <h2 className="modal-heading">List Your Space</h2>
            {formError && (
              <div
                className="error-message"
                style={{ color: 'red', marginBottom: '10px' }}
              >
                {formError}
              </div>
            )}
            {submitSuccess && (
              <div
                className="success-message"
                style={{ color: 'green', marginBottom: '10px' }}
              >
                Listing created successfully!
              </div>
            )}
            <form onSubmit={handleListingSubmit}>
              <select required className="input-field" name="type">
                <option value="">Type of establishment</option>
                <option value="office">Office Space</option>
                <option value="coworking">Coworking Space</option>
                <option value="meeting">Meeting Room</option>
              </select>
              <input
                type="text"
                placeholder="Name of establishment"
                required
                className="input-field"
                name="establishment"
              />
              <select required className="input-field" name="ownership">
                <option value="">Ownership of property</option>
                <option value="owned">Owned</option>
                <option value="leased">Leased</option>
                <option value="rented">Rented</option>
              </select>
              <input
                type="text"
                placeholder="City"
                required
                className="input-field"
                name="city"
              />
              <textarea
                placeholder="Complete Address"
                required
                className="input-field"
                name="address"
              ></textarea>
              <div
                className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed #ccc',
                  padding: '20px',
                  textAlign: 'center',
                  marginBottom: '15px',
                  backgroundColor: isDragging ? '#f0f0f0' : 'white',
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                  Drag & drop images here or click to select
                </label>
              </div>

              {/* Preview uploaded images */}
              {uploadedImages.length > 0 && (
                <div
                  className="image-preview"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '15px',
                  }}
                >
                  {uploadedImages.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        width: '100px',
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Amenities Section */}
              <div className="amenities-section">
                <h4>Amenities</h4>
                <div className="amenities-buttons">
                  {['Cafeteria', 'Free Coffee', 'Wifi', 'Kitchen', 'Parking', '24/7 Access'].map((amenity) => (
                    <button
                      type="button"
                      key={amenity}
                      className={`amenity-button ${
                        selectedAmenities.includes(amenity) ? 'active' : ''
                      }`}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                placeholder="Monthly Rate"
                className="input-field"
                name="monthlyRate"
                required
              />
              <input
                type="text"
                placeholder="Name"
                required
                className="input-field"
                name="contactName"
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                className="input-field"
                name="contactPhone"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="input-field"
                name="contactEmail"
              />
              <button
                type="submit"
                className="modal-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Listing'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className={`mybot ${showBot ? 'active' : ''}`}>
        <div className="mybot-header" onClick={() => setShowBot(!showBot)}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/4712/4712006.png"
            alt="myBot"
            className="mybot-icon"
          />
          <span className="mybot-name">myBot</span>
        </div>
        {showBot && (
          <div className="mybot-content">
            <div className="mybot-messages">
              <div className="bot-message">
                Welcome to Just Office! How can I help you today?
              </div>
            </div>
            <div className="mybot-actions">
              <button onClick={() => navigate('/listings')}>
                I am looking for a workspace
              </button>
              <button onClick={() => setShowListingForm(true)}>
                I want to list my space
              </button>
              <button onClick={() => setShowContactForm(true)}>
                Talk to an expert
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="youtube-video" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <iframe
          width="80%"
          height="400"
          src="https://www.youtube.com/embed/V2Bjo_ckbZQ?si=w8egx9w9HqcrT5w1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <footer class="text-gray-600 body-font">
        <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            
            <span class="ml-3 text-xl">JustOfis</span>
          </a>
          <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2024 JustOfis —
            <a href="https://twitter.com/knyttneve" class="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@justofis</a>
          </p>
          <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a class="text-gray-500">
              <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5 social-icon" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a class="ml-3 text-gray-500">
              <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5 social-icon" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a class="ml-3 text-gray-500">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5 social-icon" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
            <a class="ml-3 text-gray-500">
              <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5 social-icon" viewBox="0 0 24 24">
                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
