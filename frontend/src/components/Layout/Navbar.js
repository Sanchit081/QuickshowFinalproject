import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { setCity, toggleDarkMode } from '../../store/slices/uiSlice';
import { FiSearch, FiUser, FiLogOut, FiMoon, FiSun, FiMapPin, FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { city, darkMode } = useSelector((state) => state.ui);

  const storedUser = !user && typeof window !== 'undefined'
    ? (() => {
        try {
          const raw = localStorage.getItem('user');
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      })()
    : user;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const effectiveIsAuthenticated = isAuthenticated || !!token;
  const effectiveUser = user || storedUser;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = (
    <>
      <Link to="/movies" className="hover:opacity-80 transition-opacity">Movies</Link>
      <Link to="/events" className="hover:opacity-80 transition-opacity">Events</Link>
      {effectiveIsAuthenticated && <Link to="/bookings" className="hover:opacity-80 transition-opacity">My Bookings</Link>}
      {effectiveIsAuthenticated && <Link to="/wishlist" className="hover:opacity-80 transition-opacity">Wishlist</Link>}
      {effectiveIsAuthenticated && <Link to="/profile" className="hover:opacity-80 transition-opacity">Profile</Link>}
      {effectiveIsAuthenticated && effectiveUser?.role === 'admin' && (
        <Link
          to="/admin/dashboard"
          className="apple-button flex items-center justify-center space-x-2 bg-apple-secondary border-apple-thin"
        >
          <span>Admin Panel</span>
        </Link>
      )}
    </>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass sticky top-0 z-50 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              🎬 QuickShow
            </motion.div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, events..."
                className="input-field w-full pl-10 pr-4"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          <div className="hidden lg:flex items-center space-x-5 text-sm font-medium">
            {navLinks}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <FiMapPin />
                <span className="hidden sm:inline">{city}</span>
              </button>
              
              {showCityDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 glass rounded-lg p-2 min-w-[150px] shadow-xl"
                >
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        dispatch(setCity(c));
                        setShowCityDropdown(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded hover:bg-white/20 transition-colors ${
                        city === c ? 'text-white font-medium' : 'text-gray-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {effectiveIsAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-apple-primary to-apple-secondary rounded-2xl flex items-center justify-center shadow-apple-lg">
                      <span className="text-white font-bold text-lg">{effectiveUser.name?.charAt(0)}</span>
                    </div>
                    <div className="hidden md:flex flex-col">
                      <span className="text-xl font-bold text-apple-primary">{effectiveUser.name}</span>
                      <span className="text-xs text-apple-secondary font-medium">{effectiveUser.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-apple-muted hover:text-apple-primary transition-colors p-2 rounded-lg hover:bg-apple-medium"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="apple-button flex items-center space-x-2"
                  >
                    <FiUser />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="apple-button flex items-center space-x-2"
                  >
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-4 rounded-2xl border border-white/10 bg-black/40 p-4 space-y-4"
          >
            <form onSubmit={handleSearch} className="md:hidden">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, events..."
                  className="input-field w-full pl-10 pr-4"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>
            <div className="flex flex-col gap-3 text-sm font-medium">
              {navLinks}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

