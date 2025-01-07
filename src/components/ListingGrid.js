import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaSubway, FaParking, FaRegHeart } from "react-icons/fa";
import "./ListingGrid.css";

function ListingGrid({ listingsUpdated }) {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("Coworking Space");
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [hasParking, setHasParking] = useState(false);
  const [hasMetro, setHasMetro] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("Popularity");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listings");
        if (response.ok) {
          const data = await response.json();
          setListings(data);
        } else {
          console.error("Failed to fetch listings:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [listingsUpdated]);

  // Filter listings based on all criteria
// Filter listings based on all criteria except amenities
  const filteredListings = listings.filter(listing =>
    listing.city === selectedCity &&
    (!priceRange || (listing.monthlyRate >= priceRange[0] && listing.monthlyRate <= priceRange[1]))
  );

  const resetFilters = () => {
    setSelectedProduct('Coworking Space');
    setSelectedCity('Delhi');
    setSelectedLocation('All Locations');
    setHasParking(false);
    setHasMetro(false);
    setPriceRange([0, 50000]);
    setSortBy('Popularity');
  };

  return (
    <div className="listing-grid-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/" className="home-link">
          <img src="/justofis-logo.svg" alt="JustOfis Logo" className="justofis-logo" />
        </Link>
        <Link to="/coworking">Coworking</Link> {'>'}
        <span>Delhi</span>
      </div>

      {/* Page Title */}
      <h1 className="page-title">Coworking Space In Delhi</h1>

      {/* Quick Filters */}
      <div className="quick-filters">
        <div className="filter-group">
          <label>Product</label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="Coworking Space">Coworking Space</option>
          </select>
        </div>

        <div className="filter-group">
          <label>City</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="Delhi">Delhi</option>
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
        <div className="listings-section">
          {filteredListings.length === 0 ? (
            <div className="no-listings">
              <p>No office spaces found in {selectedCity}.</p>
            </div>
          ) : (
            filteredListings.map(listing => (
              <div 
                key={listing.id} 
                className="listing-card"
                onClick={() => navigate(`/listing/${listing.id}`)}
              >
                <div className="listing-image-container">
                    {listing.imageUrls && listing.imageUrls.length > 0 ? (
                      <img src={listing.imageUrls[0]} alt={listing.name} className="listing-image" />
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
                  <h3>{listing.name}</h3>
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
                          `Hi, I'm interested in ${listing.name} at ${listing.address}. Please share more details.`
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

        <div className="expert-profile">
          <h2>Upgrade your office with Our Experts</h2>
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
              const message = encodeURIComponent("Hi, I'm interested in exploring workspace solutions in Delhi.");
              window.open(`https://wa.me/918650000096?text=${message}`, '_blank');
            }}
          >
            Connect with us
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingGrid;
