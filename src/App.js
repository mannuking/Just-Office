import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import ListingGrid from "./components/ListingGrid";
import ListingDetails from "./components/ListingDetails";
import LandingPage from "./components/LandingPage";

function App() {
  const [listingsUpdated, setListingsUpdated] = useState(false);

  const handleListingsUpdate = () => {
    setListingsUpdated(!listingsUpdated);
  };

return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<LandingPage onListingsUpdate={handleListingsUpdate} />}
        />
        <Route
          path="/listings"
          element={<ListingGrid listingsUpdated={listingsUpdated} />}
        />
        <Route
          path="/listings/:city"
          element={<ListingGrid listingsUpdated={listingsUpdated} />}
        />
        <Route path="/listing/:id" element={<ListingDetails />} />
      </Routes>
    </div>
  );
}

export default App;
