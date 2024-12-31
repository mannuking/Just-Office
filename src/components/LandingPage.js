import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage({ setIsAuthenticated }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e, type) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(type === 'login' ? {
          email: formData.email,
          password: formData.password
        } : formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (type === 'login') {
        // Store the token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userEmail', data.data.user.email);
        localStorage.setItem('userRole', data.data.user.role);
        localStorage.setItem('userName', data.data.user.name);
      }

      setIsAuthenticated(true);
      // Role-based navigation
      switch(data.data.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'landlord':
          navigate('/landlord/properties');
          break;
        default:
          navigate('/listings/Mumbai');
      }
    } catch (err) {
      setError(err.message);
      console.error('Authentication error:', err);
    }
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
              setError('');
              setFormData({
                email: '',
                password: '',
                name: '',
                role: 'user'
              });
            }}>×</button>
            <h2>{showLogin ? 'Login' : 'Sign Up'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={(e) => handleAuth(e, showLogin ? 'login' : 'signup')} className="auth-form">
              {!showLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!showLogin}
                  className="input-field"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="input-field"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength="6"
                className="input-field"
              />
              {!showLogin && (
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required={!showLogin}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="landlord">Landlord</option>
                  <option value="admin">Admin</option>
                </select>
              )}
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
                  setError('');
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
