import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './AdminPanel.css';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('listings');
  const [showListingForm, setShowListingForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Mock data - in a real app, this would come from a backend
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Tech Hub Coworking',
      city: 'Bangalore',
      type: 'Coworking Spaces',
      address: '100 Feet Road, Indiranagar',
      dailyRate: 500,
      monthlyRate: 8000,
    },
    // Add more mock listings as needed
  ]);

  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      listingId: 1,
      date: '2024-01-20',
    },
    // Add more mock inquiries as needed
  ]);

  const onListingSubmit = (data) => {
    if (editingListing) {
      // Update existing listing
      setListings(listings.map(listing => 
        listing.id === editingListing.id ? { ...listing, ...data } : listing
      ));
      toast.success('Listing updated successfully!');
    } else {
      // Add new listing
      setListings([...listings, { ...data, id: Date.now() }]);
      toast.success('New listing added successfully!');
    }
    setShowListingForm(false);
    setEditingListing(null);
    reset();
  };

  const handleEditListing = (listing) => {
    setEditingListing(listing);
    setShowListingForm(true);
    reset(listing);
  };

  const handleDeleteListing = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter(listing => listing.id !== id));
      toast.success('Listing deleted successfully!');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="tab-navigation">
          <button 
            className={activeTab === 'listings' ? 'active' : ''} 
            onClick={() => setActiveTab('listings')}
          >
            Manage Listings
          </button>
          <button 
            className={activeTab === 'inquiries' ? 'active' : ''} 
            onClick={() => setActiveTab('inquiries')}
          >
            View Inquiries
          </button>
        </div>
      </div>

      {activeTab === 'listings' && (
        <div className="listings-management">
          <button 
            className="add-listing-btn"
            onClick={() => {
              setEditingListing(null);
              setShowListingForm(true);
              reset();
            }}
          >
            <FaPlus /> Add New Listing
          </button>

          <div className="listings-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>City</th>
                  <th>Type</th>
                  <th>Daily Rate</th>
                  <th>Monthly Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing.id}>
                    <td>{listing.title}</td>
                    <td>{listing.city}</td>
                    <td>{listing.type}</td>
                    <td>₹{listing.dailyRate}</td>
                    <td>₹{listing.monthlyRate}</td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditListing(listing)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="inquiries-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Listing</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inquiry => (
                <tr key={inquiry.id}>
                  <td>{inquiry.date}</td>
                  <td>{inquiry.name}</td>
                  <td>{inquiry.email}</td>
                  <td>{inquiry.phone}</td>
                  <td>
                    {listings.find(l => l.id === inquiry.listingId)?.title || 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showListingForm && (
        <div className="listing-form-overlay">
          <div className="listing-form">
            <h2>{editingListing ? 'Edit Listing' : 'Add New Listing'}</h2>
            <form onSubmit={handleSubmit(onListingSubmit)}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  {...register("title", { required: "Title is required" })} 
                  placeholder="Listing title"
                />
                {errors.title && <span className="error">{errors.title.message}</span>}
              </div>

              <div className="form-group">
                <label>City</label>
                <input 
                  {...register("city", { required: "City is required" })} 
                  placeholder="City"
                />
                {errors.city && <span className="error">{errors.city.message}</span>}
              </div>

              <div className="form-group">
                <label>Type</label>
                <select {...register("type", { required: "Type is required" })}>
                  <option value="">Select type</option>
                  <option value="Coworking Spaces">Coworking Spaces</option>
                  <option value="Private Offices">Private Offices</option>
                  <option value="Meeting Rooms">Meeting Rooms</option>
                  <option value="Virtual Offices">Virtual Offices</option>
                  <option value="Day Passes">Day Passes</option>
                  <option value="Event Spaces">Event Spaces</option>
                </select>
                {errors.type && <span className="error">{errors.type.message}</span>}
              </div>

              <div className="form-group">
                <label>Address</label>
                <input 
                  {...register("address", { required: "Address is required" })} 
                  placeholder="Full address"
                />
                {errors.address && <span className="error">{errors.address.message}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Daily Rate (₹)</label>
                  <input 
                    type="number"
                    {...register("dailyRate", { 
                      required: "Daily rate is required",
                      min: { value: 0, message: "Rate must be positive" }
                    })} 
                  />
                  {errors.dailyRate && <span className="error">{errors.dailyRate.message}</span>}
                </div>

                <div className="form-group">
                  <label>Monthly Rate (₹)</label>
                  <input 
                    type="number"
                    {...register("monthlyRate", { 
                      required: "Monthly rate is required",
                      min: { value: 0, message: "Rate must be positive" }
                    })} 
                  />
                  {errors.monthlyRate && <span className="error">{errors.monthlyRate.message}</span>}
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  {editingListing ? 'Update Listing' : 'Add Listing'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowListingForm(false);
                    setEditingListing(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
