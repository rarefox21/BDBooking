import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import HotelPage from './pages/HotelPage';
import MyBookings from './pages/MyBookings';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/AdminDashboard';
import AdminHotels from './pages/AdminHotels';
import AdminAddHotel from './pages/AdminAddHotel';
import AdminEditHotel from './pages/AdminEditHotel';
import AdminRooms from './pages/AdminRooms';
import AdminUsers from './pages/AdminUsers';
import PaymentSuccess from './pages/PaymentSuccess'; // Import the new page
import PaymentFail from './pages/PaymentFail'; // Import the new page

// Import the route protection components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hotel/:id" element={<HotelPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/payment/cancel" element={<PaymentFail />} />


          {/* Protected User Routes */}
          <Route 
            path="/my-bookings" 
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            } 
          />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/hotels" element={<AdminRoute><AdminHotels /></AdminRoute>} />
          <Route path="/admin/hotels/new" element={<AdminRoute><AdminAddHotel /></AdminRoute>} />
          <Route path="/admin/hotels/edit/:id" element={<AdminRoute><AdminEditHotel /></AdminRoute>} />
          <Route path="/admin/rooms" element={<AdminRoute><AdminRooms /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
