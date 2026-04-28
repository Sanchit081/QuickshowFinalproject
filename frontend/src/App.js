import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import './components/Booking/apple-seat-selection.css';
import ErrorBoundary from './components/ErrorBoundary';
import { readStorage } from './utils/storage';

// Premium Layout Components
import PremiumNavbar from './components/Layout/PremiumNavbar';
import PremiumFooter from './components/Layout/PremiumFooter';
import QuickShowCommunityChat from './components/Layout/QuickShowCommunityChat';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import AppleHome from './pages/AppleHome';
import Movies from './pages/Movies';
import AppleMovieDetail from './components/Movie/AppleMovieDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Search from './pages/Search';
import Trending from './pages/Trending';

// Information Pages
import About from './pages/About';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Blog from './pages/Blog';
import Support from './pages/Support';
import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import FAQs from './pages/FAQs';
import Feedback from './pages/Feedback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import RefundPolicy from './pages/RefundPolicy';

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

const TestAPI = lazy(() => import('./pages/TestAPI'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const token = readStorage('token');

  // If we have a token but user hasn't hydrated yet, avoid redirect loops.
  if (token && (loading || !user)) {
    return (
      <div className="min-h-screen bg-cinematic-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cinematic-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const token = readStorage('token');

  // If we have a token but user hasn't hydrated yet, avoid redirecting to home.
  if (token && (loading || !user)) {
    return (
      <div className="min-h-screen bg-cinematic-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cinematic-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token && !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has admin role
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (readStorage('token')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex flex-col">
          <PremiumNavbar />
          <main className="flex-grow pt-16 lg:pt-20">
          <Suspense
            fallback={
              <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-cinematic-400 text-lg">Loading...</p>
                </div>
              </div>
            }
          >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AppleHome />} />
            {isDevelopment && <Route path="/test-api" element={<TestAPI />} />}
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<AppleMovieDetail />} />
            <Route path="/movies/:id/booking" element={<AppleMovieDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Information Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/support" element={<Support />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />

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
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
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
          </Suspense>
        </main>
        <PremiumFooter />
        <QuickShowCommunityChat />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
