import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import { toggleDarkMode } from './store/slices/uiSlice';
import './components/Booking/apple-seat-selection.css';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import QuickShowCommunityChat from './components/Layout/QuickShowCommunityChat';

// Public Pages
import AppleHome from './pages/AppleHome';
import TestAPI from './pages/TestAPI';
import Movies from './pages/Movies';
import AppleMovieDetail from './components/Movie/AppleMovieDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';

// Private Pages
import AppleSeatSelection from './components/Booking/AppleSeatSelection';
import MealSelection from './pages/MealSelection';
import Checkout from './pages/Checkout';
import EventCheckout from './pages/EventCheckout';
import TicketSummary from './pages/TicketSummary';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';
import Wishlist from './pages/Wishlist';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminMovies from './pages/Admin/AdminMovies';
import AdminCinemas from './pages/Admin/AdminCinemas';
import AdminShows from './pages/Admin/AdminShows';
import AdminBookings from './pages/Admin/AdminBookings';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminAnalytics from './pages/Admin/AdminAnalytics';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  let effectiveUser = user;
  if (!effectiveUser && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user');
      effectiveUser = stored ? JSON.parse(stored) : null;
    } catch {
      effectiveUser = user;
    }
  }

  if (!token && !isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (effectiveUser?.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  useEffect(() => {
    // Set dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Get current user if token exists
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, darkMode]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AppleHome />} />
            <Route path="/test-api" element={<TestAPI />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<AppleMovieDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/seat-selection/:showId"
              element={
                <ProtectedRoute>
                  <AppleSeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meals"
              element={
                <ProtectedRoute>
                  <MealSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-checkout"
              element={
                <ProtectedRoute>
                  <EventCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ticket/:bookingId"
              element={
                <ProtectedRoute>
                  <TicketSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/movies"
              element={
                <AdminRoute>
                  <AdminMovies />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/cinemas"
              element={
                <AdminRoute>
                  <AdminCinemas />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/shows"
              element={
                <AdminRoute>
                  <AdminShows />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <QuickShowCommunityChat />
      </div>
    </Router>
  );
}

export default App;

