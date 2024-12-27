import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import ListingGrid from './components/ListingGrid';
import ListingDetails from './components/ListingDetails';
import AdminPanel from './components/AdminPanel';
import LandingPage from './components/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route 
          path="/listings/:city" 
          element={
            <ProtectedRoute>
              <ListingGrid />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/listing/:id" 
          element={
            <ProtectedRoute>
              <ListingDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
