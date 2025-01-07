import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaSubway, FaParking, FaRegHeart } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './ListingGrid.css';

function ListingGrid({ listingsUpdated }) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [hasParking, setHasParking] = useState(false);
  const [hasMetro, setHasMetro] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('Popularity');
  const [selectedMarker, setSelectedMarker] = useState(null);

  const mapCenter = useMemo(() => ({
    lat: 28.6139,
    lng: 77.2090
  }), []);

  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
    ],
  }), []);

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/listings');
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      
      // Transform API data to match expected format
      const formattedListings = data.map(listing => ({
        id: listing._id,
        title: listing.title,
        type: listing.type,
        address: listing.address,
        city: listing.city,
        monthlyRate: Number(listing.price),
        images: listing.images,
        amenities: listing.amenities || [],
        coordinates: {
          lat: 28.6139, // Default to Delhi coordinates for now
          lng: 77.2090
        }
      }));
      
      setListings(formattedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter listings based on selected criteria, but don't filter if no criteria selected
  const filteredListings = listings.filter(listing => {
    const cityMatch = !selectedCity || selectedCity === 'All Cities' || listing.city === selectedCity;
    const parkingMatch = !hasParking || listing.amenities.includes('Parking');
    const metroMatch = !hasMetro || listing.amenities.includes('Metro Connectivity');
    const priceMatch = listing.monthlyRate >= priceRange[0] && listing.monthlyRate <= priceRange[1];
    
    // Map frontend product types to backend types
    const productTypeMap = {
      'All': null,
      'Coworking Space': 'coworking',
      'Private Office': 'office',
      'Meeting Room': 'meeting',
      'Virtual Office': 'virtual'
    };
    const selectedBackendType = productTypeMap[selectedProduct];
    const productMatch = !selectedBackendType || listing.type === selectedBackendType;
    
    return cityMatch && parkingMatch && metroMatch && priceMatch && productMatch;
  });

  const resetFilters = () => {
    setSelectedProduct('All');
    setSelectedCity('All Cities');
    setSelectedLocation('All Locations');
    setHasParking(false);
    setHasMetro(false);
    setPriceRange([0, 50000]);
    setSortBy('Popularity');
  };

  return (
    <div className="listing-grid-container">
      {/* Header */}
      <div className="listing-header">
        <Link to="/" className="logo-container">
          <img src="/justofis-logo.svg" alt="JustOfis" className="logo" />
          <span className="logo-text">JustOfis</span>
        </Link>
        <div className="breadcrumb">
          <Link to="/">Home</Link> {' > '}
          <span>Office Spaces</span>
        </div>
      </div>

      {/* Page Title */}
      <h1 className="page-title">Office Spaces</h1>

      {/* Quick Filters */}
      <div className="quick-filters">
        <div className="filter-group">
          <label>Product</label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="All">All Spaces</option>
            <option value="Coworking Space">Coworking Space</option>
            <option value="Private Office">Private Office</option>
            <option value="Meeting Room">Meeting Room</option>
            <option value="Virtual Office">Virtual Office</option>
          </select>
        </div>

        <div className="filter-group">
          <label>City</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="All Cities">All Cities</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Locations</label>
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="All Locations">All Locations</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Parking</label>
          <button 
            className={`toggle-button ${hasParking ? 'active' : ''}`}
            onClick={() => setHasParking(!hasParking)}
          >
            <FaParking />
          </button>
        </div>

        <div className="filter-group">
          <label>Metro Connectivity</label>
          <button 
            className={`toggle-button ${hasMetro ? 'active' : ''}`}
            onClick={() => setHasMetro(!hasMetro)}
          >
            <FaSubway />
          </button>
        </div>

        <div className="filter-group">
          <label>Price Range</label>
          <select value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}>
            <option value="10000">Up to ₹10,000</option>
            <option value="20000">Up to ₹20,000</option>
            <option value="50000">Up to ₹50,000</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Popularity">Popularity</option>
            <option value="Price">Price</option>
          </select>
        </div>

        <button className="reset-filters" onClick={resetFilters}>
          Reset filters
        </button>
      </div>

      <div className="content-wrapper">
        <div className="main-content">
          <div className="listings-section">
          {isLoading ? (
            <div className="loading">Loading listings...</div>
          ) : error ? (
            <div className="error-message">
              {error}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="no-listings">
              <p>No office spaces found{selectedCity !== 'All Cities' ? ` in ${selectedCity}` : ''}.</p>
            </div>
          ) : (
            filteredListings.map(listing => (
              <div 
                key={listing.id} 
                className="listing-card"
                onClick={() => navigate(`/listing/${listing.id}`)}
              >
                <div className="listing-image-container">
                    {listing.images && listing.images.length > 0 ? (
                      <img src={listing.images[0]} alt={listing.title} className="listing-image" />
                    ) : (
                      <div className="no-image">No Image Available</div>
                    )}
                    <button
                      className="favorite-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add favorite functionality here
                      }}
                    >
                      <FaRegHeart />
                    </button>
                </div>
                <div className="listing-details">
                  <h3>{listing.title}</h3>
                  <p className="location">
                    <FaMapMarkerAlt /> {listing.address}
                  </p>
                  {/* <p className="timing">
                    <FaClock /> Open Now, 08:00 to 20:00
                  </p> */}
                  {/* <div className="amenities">
                      {listing.amenities.includes('Metro Connectivity') && (
                        <span className="amenity"><FaSubway /> Metro/Rail Connectivity</span>
                      )}
                      {listing.amenities.includes('Parking') && (
                        <span className="amenity"><FaParking /> Parking Available</span>
                      )}
                    </div> */}
                  <div className="space-types">
                    <span>{listing.type}</span>
                    {/* <span>Private Cabins</span>
                    <span>Managed Office</span> */}
                  </div>
                  <div className="pricing-section">
                    <div className="price">
                      <span className="price-label">Prices starting at</span>
                      <span className="price-amount">₹10,000</span> {/* Placeholder for monthlyRate */}
                      <span className="price-period">/ desk / month</span>
                    </div>
                    <button
                      className="get-quote-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const message = encodeURIComponent(
                          `Hi, I'm interested in ${listing.title} at ${listing.address}. Please share more details.`
                        );
                        window.open(`https://wa.me/918650000096?text=${message}`, '_blank');
                      }}
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
          </div>
          <div className="expert-profile">
          <h2>Upgrade your office with Nitin Kashyap & team</h2>
          <div className="expert-info">
            <img src="/images/expert-profile.svg" alt="Expert" className="expert-image" />
            <div className="expert-details">
              <h3>Connect with Us</h3>
              <p className="expert-phone">+91-865*****96</p>
              <div className="expert-badge">JustOfis Expert</div>
            </div>
            <button className="contact-expert" onClick={() => window.location.href='tel:+918650000096'}>
              Contact Us
            </button>
          </div>
          <p className="expert-description">
            Our team has assisted 200+ corporates in Delhi with customized office spaces
          </p>
          <div className="client-logos">
            {/* Client logos will be added later */}
          </div>
          <div className="expert-services">
            <h4>Explore workspace solutions with our expert guidance:</h4>
            <ul>
              <li>Research & shortlisting</li>
              <li>Workspace tours</li>
              <li>Terms negotiations</li>
              <li>Deal signing and move-in</li>
            </ul>
          </div>
                  <button 
                    className="connect-button"
                    onClick={() => {
                      const message = encodeURIComponent("Hi Nitin, I'm interested in exploring workspace solutions.");
                      window.open(`https://wa.me/918650000096?text=${message}`, '_blank');
                    }}
                  >
                    Connect with us
                  </button>
                </div>
              </div>
        <div className="map-section">
          <LoadScript 
            googleMapsApiKey="AIzaSyDseNwG6SIghKKnFEWR36paPD_T4JDw6xM"
            loadingElement={
              <div className="map-loading">
                Loading map...
              </div>
            }
          >
            <GoogleMap
              onLoad={() => console.log('Map loaded successfully')}
              onError={(error) => console.error('Error loading map:', error)}
              mapContainerClassName="google-map"
              center={mapCenter}
              zoom={11}
              options={mapOptions}
            >
              {filteredListings.map(listing => (
                <React.Fragment key={listing.id}>
                  <Marker
                    position={listing.coordinates}
                    onClick={() => setSelectedMarker(listing)}
                    icon={{
                      path: window.google?.maps?.SymbolPath.CIRCLE,
                      fillColor: '#1a73e8',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                      scale: 8
                    }}
                  />
                  {selectedMarker && selectedMarker.id === listing.id && (
                    <InfoWindow
                      position={listing.coordinates}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="map-info-window">
                        <h3>{listing.title}</h3>
                        <p>{listing.address}</p>
                        <p className="price">₹{listing.monthlyRate.toLocaleString()} / month</p>
                        <button 
                          onClick={() => navigate(`/listing/${listing.id}`)}
                          className="view-details-btn"
                        >
                          View Details
                        </button>
                      </div>
                    </InfoWindow>
                  )}
                </React.Fragment>
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    
  );
}

export default ListingGrid;
