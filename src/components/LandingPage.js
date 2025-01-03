import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaChevronRight, FaStar, FaQuoteLeft } from 'react-icons/fa';
import './LandingPage.css';

function LandingPage() {
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
        videoId: 'V2Bjo_ckbZQ',
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
          onReady: (event) => event.target.playVideo()
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.pauseVideo();
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

  const handleListingSubmit = (e) => {
    e.preventDefault();
    // Handle listing form submission
    setShowListingForm(false);
  };

  return (
    <div className="landing-page">
      <div className="video-background">
        <div id="youtube-background"></div>
        <div className="video-overlay"></div>
      </div>

      <nav className="landing-nav">
        <Link to="/" className="logo">
          <img src="/justofis-logo.png" alt="JustOfis" />
        </Link>
        <div className="nav-links">
          <Link to="/solutions">All Solutions</Link>
          <Link to="/office-space">Office space</Link>
          <Link to="/more">More</Link>
        </div>
        <div className="nav-buttons">
          <button onClick={() => setShowListingForm(true)} className="list-space-btn">List your space</button>
          <button onClick={() => setShowContactForm(true)} className="share-btn">Share requirement</button>
        </div>
      </nav>

      <main className="hero-section" style={{
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/images/office-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <h1>The New Way to Offices</h1>
        <p>A one-stop workspace solution for all work-needs. Choose between pay-per-use plans or fixed desks for teams and individuals.</p>
        
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
          <div className="type-card" onClick={() => navigate('/listings/Delhi?type=coworking')}>
            <img src="/images/spaces/coworking.jpg" alt="Coworking Space" />
            <div className="type-info">
              <h3>Coworking Space</h3>
              <p>Full-time offices for teams of all sizes</p>
              <ul>
                <li>Dedicated seats & private cabins</li>
                <li>Fully-equipped coworking spaces</li>
                <li>Ideal for individual or small teams</li>
              </ul>
              <button className="explore-btn">Explore Coworking Space <FaChevronRight /></button>
            </div>
          </div>

          <div className="type-card" onClick={() => navigate('/listings/Delhi?type=managed')}>
            <img src="/images/spaces/managed-office.jpg" alt="Managed Office" />
            <div className="type-info">
              <h3>Managed Office</h3>
              <p>Dedicated office space managed by a provider</p>
              <ul>
                <li>Fully furnished customized office</li>
                <li>Fully managed operations & housekeeping</li>
                <li>Ideal for 50+ team size</li>
              </ul>
              <button className="explore-btn">Explore Managed Office <FaChevronRight /></button>
            </div>
          </div>

          <div className="type-card" onClick={() => navigate('/listings/Delhi?type=commercial')}>
            <img src="/images/spaces/commercial.jpg" alt="Office/Commercial Spaces" />
            <div className="type-info">
              <h3>Office/Commercial Spaces</h3>
              <p>Rent/Lease office space for your company</p>
              <ul>
                <li>Long term contracts (3 or more years)</li>
                <li>Full customizations with self managed amenities</li>
                <li>Ideal for 100+ team size</li>
              </ul>
              <button className="explore-btn">Explore Office/Commercial <FaChevronRight /></button>
            </div>
          </div>

          <div className="type-card" onClick={() => navigate('/listings/Delhi?type=day-pass')}>
            <img src="/images/spaces/day-pass.jpg" alt="Day Pass" />
            <div className="type-info">
              <h3>Day Pass</h3>
              <p>Flexible coworking for individuals</p>
              <ul>
                <li>Desks-by-the-day in coworking spaces</li>
                <li>Starting at ₹200/day</li>
                <li>Ideal for individual or small teams</li>
              </ul>
              <button className="explore-btn">Explore Day Pass <FaChevronRight /></button>
            </div>
          </div>

          <div className="type-card" onClick={() => navigate('/listings/Delhi?type=meeting')}>
            <img src="/images/spaces/meeting-room.jpg" alt="Meeting Room" />
            <div className="type-info">
              <h3>Meeting Room</h3>
              <p>Book by-the-hour or by the day</p>
              <ul>
                <li>Meeting, conference and training rooms for teams</li>
                <li>Modern amenities for a seamless experience</li>
                <li>Ideal for remote & hybrid teams</li>
              </ul>
              <button className="explore-btn">Explore Meeting Room <FaChevronRight /></button>
            </div>
          </div>

          <div className="type-card" onClick={() => navigate('/listings/Delhi?type=team')}>
            <img src="/images/spaces/team-plan.jpg" alt="Team Plan" />
            <div className="type-info">
              <h3>Team Plan</h3>
              <p>Flexible day pass for remote & hybrid teams</p>
              <ul>
                <li>Centralized dashboard for entire team</li>
                <li>Manage & track bookings at one place</li>
                <li>Ideal for remote, distributed & hybrid teams</li>
              </ul>
              <button className="explore-btn">Explore Team Plan <FaChevronRight /></button>
            </div>
          </div>
        </div>
      </main>

      <section className="benefits-section">
        <h2>Why choose JustOfis?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">₹</div>
            <h3>Zero Brokerage Fees</h3>
            <p>We charge zero brokerage fees for our office space rentals</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌐</div>
            <h3>Largest Coverage</h3>
            <p>An expansive network of 5000+ coworking spaces, you're sure to find what you're looking for</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>Quick Turnaround Time</h3>
            <p>Experience swift and effective solutions with us</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👥</div>
            <h3>Dedicated Office Spaces Experts</h3>
            <p>From consulting, shortlisting to documentation, our office space experts will help you in finding the perfect office space.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h3>50,000+</h3>
          <p>Seats Delivered</p>
        </div>
        <div className="stat-card">
          <h3>5,000+</h3>
          <p>Partner Spaces</p>
        </div>
        <div className="stat-card">
          <h3>5,000+</h3>
          <p>Clients Served</p>
        </div>
        <div className="stat-card">
          <h3>100+</h3>
          <p>Expert Consultants</p>
        </div>
      </section>

      <section className="reviews-section">
        <h2>A word from our community</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <div className="review-header">
              <img src="/images/reviews/reviewer1.jpg" alt="Reviewer" className="reviewer-image" />
              <div className="reviewer-info">
                <h4>Abhishek Agrawal</h4>
                <p>General Partner at Operator VC</p>
                <div className="rating">
                  {[1,2,3,4,5].map(star => <FaStar key={star} className="star" />)}
                </div>
              </div>
            </div>
            <FaQuoteLeft className="quote-icon" />
            <p className="review-text">
              I love using the JustOfis spaces to do my meetings! Now I don't have to worry about getting an 
              environment more conducive to work, where one can actually get things done, while it's still 
              comfortable and relaxed.
            </p>
          </div>

          <div className="review-card">
            <div className="review-header">
              <img src="/images/reviews/reviewer2.jpg" alt="Reviewer" className="reviewer-image" />
              <div className="reviewer-info">
                <h4>Kirti Puri</h4>
                <p>Founder, Trippin Media</p>
                <div className="rating">
                  {[1,2,3,4,5].map(star => <FaStar key={star} className="star" />)}
                </div>
              </div>
            </div>
            <FaQuoteLeft className="quote-icon" />
            <p className="review-text">
              I have had a great experience at every JustOfis space. Being a freelancer it really gets boring sometimes 
              to work alone, but whenever I visit any space I get introduced to new people and talk about each other's work.
            </p>
          </div>

          <div className="review-card">
            <div className="review-header">
              <img src="/images/reviews/reviewer3.jpg" alt="Reviewer" className="reviewer-image" />
              <div className="reviewer-info">
                <h4>Niraj Singh</h4>
                <p>Founder & CEO, Spinny</p>
                <div className="rating">
                  {[1,2,3,4,5].map(star => <FaStar key={star} className="star" />)}
                </div>
              </div>
            </div>
            <FaQuoteLeft className="quote-icon" />
            <p className="review-text">
              JustOfis has helped us find the perfect office space for our team. JustOfis stitches together all key 
              aspects of a productive workspace and networking opportunities. Would strongly recommend JustOfis to 
              growing stage companies and startups.
            </p>
          </div>
        </div>
      </section>

      {showContactForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowContactForm(false)}>×</button>
            <h2>Contact an Expert</h2>
            <form onSubmit={handleContactSubmit}>
              <input type="text" placeholder="Name" required className="input-field" />
              <input type="email" placeholder="Email" required className="input-field" />
              <input type="tel" placeholder="Phone" required className="input-field" />
              <textarea placeholder="Message" required className="input-field"></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      )}

      {showListingForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowListingForm(false)}>×</button>
            <h2>List Your Space</h2>
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
              <input type="text" placeholder="Pictures of the space (URL)" className="input-field" />
              <input type="text" placeholder="Name" required className="input-field" />
              <input type="tel" placeholder="Phone" required className="input-field" />
              <input type="email" placeholder="Email" required className="input-field" />
              <button type="submit">Submit Listing</button>
            </form>
          </div>
        </div>
      )}

      <div className={`mybot ${showBot ? 'active' : ''}`}>
        <div className="mybot-header" onClick={() => setShowBot(!showBot)}>
          <img src="/mybot-icon.png" alt="myBot" className="mybot-icon" />
          <span>myBot</span>
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
