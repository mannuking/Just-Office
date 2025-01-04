<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 85483fbfc5edee2216201f767389fe1422eb9e54
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
<<<<<<< HEAD
>>>>>>> 3c09b83 (here u go)
=======
>>>>>>> 85483fbfc5edee2216201f767389fe1422eb9e54
