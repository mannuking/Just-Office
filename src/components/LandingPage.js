import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage({ setIsAuthenticated }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e, type) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    setIsAuthenticated(true);
    navigate('/listings/Mumbai');
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">PackUp</div>
        <div className="nav-buttons">
          <button onClick={() => setShowLogin(true)}>Login</button>
          <button onClick={() => setShowSignup(true)} className="signup-btn">Sign Up</button>
        </div>
      </nav>

      <main className="hero-section">
        <h1>Find Your Perfect Office Space</h1>
        <p>Discover flexible workspaces that fit your business needs</p>
        <div className="features">
          <div className="feature">
            <h3>Private Offices</h3>
            <p>Dedicated spaces for teams of all sizes</p>
          </div>
          <div className="feature">
            <h3>Coworking Spaces</h3>
            <p>Collaborative environments for professionals</p>
          </div>
          <div className="feature">
            <h3>Meeting Rooms</h3>
            <p>Professional spaces for your meetings</p>
          </div>
        </div>
      </main>

      {(showLogin || showSignup) && (
        <div className="auth-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => {
              setShowLogin(false);
              setShowSignup(false);
            }}>×</button>
            <h2>{showLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={(e) => handleAuth(e, showLogin ? 'login' : 'signup')}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">
                {showLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
            <p>
              {showLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                className="switch-auth"
                onClick={() => {
                  setShowLogin(!showLogin);
                  setShowSignup(!showSignup);
                }}
              >
                {showLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
