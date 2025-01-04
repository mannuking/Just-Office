import { Routes, Route } from 'react-router-dom';
import './App.css';
import ListingGrid from './components/ListingGrid';
import ListingDetails from './components/ListingDetails';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/listings" element={<ListingGrid />} />
        <Route path="/listings/:city" element={<ListingGrid />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
      </Routes>
    </div>
  );
}

export default App;
