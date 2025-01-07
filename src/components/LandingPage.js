import React, { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-background', {
        videoId: 'V2Bjo_ckbZQ', // Ensure this video is set to be embeddable
        playerVars: {
          autoplay: 1,
          loop: 1,
          controls: 0,
          showinfo: 0,
          mute: 1,
          modestbranding: 1,
          playsinline: 1,
          playlist: 'V2Bjo_ckbZQ'
        },
        events: {
          onReady: (event) => event.target.playVideo(),
          onError: (event) => console.error('YouTube Player Error:', event)
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy(); // Properly destroys the player instance
      }
    };
  }, []);

  const handleSearch = () => {
    navigate(`/listings/${selectedCity}`);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle contact form submission
    setShowContactForm(false);
  };

  const handleListingSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    // Placeholder for image URLs until actual image upload is implemented
    const imageUrls = [
      "https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];

    const formData = new FormData(form);
    formData.append('imageUrls', JSON.stringify(imageUrls));
    formData.append('monthlyRate', form.elements.monthlyRate.value);

    // Log the form data to console
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch('http://localhost:5001/api/listings', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newListing = await response.json();
        console.log('New listing created:', newListing);
        props.onListingsUpdate(); // Call the function to update the listings
      } else {
        console.error('Failed to create listing:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    }

    form.reset();
    setShowListingForm(false);
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
        'Ideal for individual or small teams'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      type: 'managed',
      heading: 'Managed Office',
      subheading: 'Dedicated office space managed by a provider',
      features: [
        'Fully furnished customized office',
        'Fully managed operations & housekeeping',
        'Ideal for 50+ team size'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      type: 'commercial',
      heading: 'Office/Commercial Spaces',
      subheading: 'Rent/Lease office space for your company',
      features: [
        'Long term contracts (3 or more years)',
        'Full customizations with self managed amenities',
        'Ideal for 100+ team size'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      type: 'day-pass',
      heading: 'Day Pass',
      subheading: 'Flexible coworking for individuals',
      features: [
        'Desks-by-the-day in coworking spaces',
        'Starting at ₹200/day',
        'Ideal for individual or small teams'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1610389051254-64849803c8fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fG1hbmFnZWQlMjBjbyUyMHdvcmtpbmclMjBvZmZpY2V8ZW58MHwwfDB8fHwy'
    },
    {
      type: 'meeting',
      heading: 'Meeting Room',
      subheading: 'Book by-the-hour or by the day',
      features: [
        'Meeting, conference and training rooms for teams',
        'Modern amenities for a seamless experience',
        'Ideal for remote & hybrid teams'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      type: 'team',
      heading: 'Team Plan',
      subheading: 'Flexible day pass for remote & hybrid teams',
      features: [
        'Centralized dashboard for entire team',
        'Manage & track bookings at one place',
        'Ideal for remote, distributed & hybrid teams'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
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
        <div className="nav-links">
        </div>
        <div className="nav-buttons">
          <button onClick={() => setShowListingForm(true)} className="list-space-btn">List your space</button>
          <button onClick={() => setShowContactForm(true)} className="share-btn">Share requirement</button>
        </div>
      </nav>

      <main className="hero-section">
        <h1 className="hero-heading">The New Way to Offices</h1>
        <p className="hero-subheading">A one-stop workspace solution for all work-needs. Choose between pay-per-use plans or fixed desks for teams and individuals.</p>
        
        <div className="search-box">
          <div className="search-inputs">
            <div className="city-select">
              <FaMapMarkerAlt />
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
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
          <button onClick={handleSearch} className="view-spaces-btn">View Workspaces</button>
        </div>

        <div className="workspace-types">
          {workspaceTypes.map((workspace) => (
            <div className="type-card" key={workspace.type} onClick={() => navigate(`/listings/Delhi?type=${workspace.type}`)}>
              <img src={workspace.imageUrl} alt={workspace.heading} />
              <div className="type-info">
                <h3 className="type-heading">{workspace.heading}</h3>
                <p className="type-subheading">{workspace.subheading}</p>
                <ul className="type-features">
                  {workspace.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="explore-btn">Explore {workspace.heading} <FaChevronRight /></button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="property-marquee">
        <div className="marquee-content">
          {OFFICE_LISTINGS.map((listing) => (
            <Link to={`/listings/${listing.id}`} className="marquee-item" key={listing.id}>
              <img src={listing.images[0]} alt={listing.title} />
              <h3>{listing.title}</h3>
              <p>{listing.address}</p>
            </Link>
          ))}
          {/* Duplicate the listings to create a seamless loop */}
          {OFFICE_LISTINGS.map((listing) => (
            <Link to={`/listings/${listing.id}`} className="marquee-item" key={listing.id}>
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
            <p className="benefit-subheading">We charge zero brokerage fees for our office space rentals</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌐</div>
            <h3 className="benefit-heading">Large Coverage</h3>
            <p className="benefit-subheading">An expansive network of 500+ coworking spaces in Delhi-NCR </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3 className="benefit-heading">Quick Turnaround Time</h3>
            <p className="benefit-subheading">Experience swift and effective solutions with us</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👥</div>
            <h3 className="benefit-heading">Dedicated Office Spaces Experts</h3>
            <p className="benefit-subheading">From consulting, shortlisting to documentation, our office space experts will help you in finding the perfect office space.</p>
          </div>
        </div>
      </section>

      <section className="youtube-section">
        <h2 className="section-heading">Explore with us !</h2>
        <div className="youtube-player-wrapper">
          <iframe
            id="youtube-player"
            src={`https://www.youtube.com/embed/${'V2Bjo_ckbZQ'}?enablejsapi=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen>
          </iframe>
        </div>
      </section>

      {showContactForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowContactForm(false)}>×</button>
            <h2 className="modal-heading">Contact an Expert</h2>
            <form onSubmit={handleContactSubmit}>
              <input type="text" placeholder="Name" required className="input-field" />
              <input type="email" placeholder="Email" required className="input-field" />
              <input type="tel" placeholder="Phone" required className="input-field" />
              <textarea placeholder="Message" required className="input-field"></textarea>
              <button type="submit" className="modal-submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      )}

      {showListingForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowListingForm(false)}>×</button>
            <h2 className="modal-heading">List Your Space</h2>
            <form onSubmit={handleListingSubmit}>
              <select required className="input-field">
                <option value="">Type of establishment</option>
                <option value="office">Office Space</option>
                <option value="coworking">Coworking Space</option>
                <option value="meeting">Meeting Room</option>
              </select>
              <input type="text" placeholder="Name of establishment" required className="input-field" />
              <select required className="input-field">
                <option value="">Ownership of property</option>
                <option value="owned">Owned</option>
                <option value="leased">Leased</option>
                <option value="rented">Rented</option>
              </select>
              <input type="text" placeholder="City" required className="input-field" />
              <textarea placeholder="Complete Address" required className="input-field"></textarea>
              <input type="file" placeholder="Pictures of the space" className="input-field" multiple name="images" />
              <input type="number" placeholder="Monthly Rate" className="input-field" name="monthlyRate" />
              <input type="text" placeholder="Name" required className="input-field" name="contactName" />
              <input type="tel" placeholder="Phone" required className="input-field" name="contactPhone" />
              <input type="email" placeholder="Email" required className="input-field" name="contactEmail" />
              <button type="submit" className="modal-submit-btn">Submit Listing</button>
            </form>
          </div>
        </div>
      )}

      <div className={`mybot ${showBot ? 'active' : ''}`}>
        <div className="mybot-header" onClick={() => setShowBot(!showBot)}>
          <img src="https://cdn-icons-png.flaticon.com/128/4712/4712006.png" alt="myBot" className="mybot-icon" />
          <span className="mybot-name">myBot</span>
        </div>
        {showBot && (
          <div className="mybot-content">
            <div className="mybot-messages">
              <div className="bot-message">Welcome to Just Office! How can I help you today?</div>
            </div>
            <div className="mybot-actions">
              <button onClick={() => navigate('/listings')}>I am looking for a workspace</button>
              <button onClick={() => setShowListingForm(true)}>I want to list my space</button>
              <button onClick={() => setShowContactForm(true)}>Talk to an expert</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
