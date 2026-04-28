import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaFilm, FaCalendarAlt, FaTicketAlt, FaUser, FaSearch, FaBars, FaTimes, FaHome, FaHeart, FaCog, FaShieldAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const PremiumNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navItems = [
    { name: 'Home', icon: FaHome, path: '/' },
    { name: 'Movies', icon: FaFilm, path: '/movies' },
    { name: 'Events', icon: FaCalendarAlt, path: '/events' },
  ];

  const userMenuItems = [
    { name: 'Profile', icon: FaUser, path: '/profile' },
    { name: 'Bookings', icon: FaTicketAlt, path: '/booking-history' },
  ];

  // Add admin panel for admin users
  const adminMenuItems = [
    { name: 'Admin Panel', icon: FaShieldAlt, path: '/admin' }
  ];

  const allUserMenuItems = user?.role === 'admin' 
    ? [...userMenuItems, ...adminMenuItems]
    : [...userMenuItems];

  return (
    <div>
      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Premium Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'backdrop-blur-2xl bg-white/70 border-b border-white/30 shadow-2xl'
            : 'backdrop-blur-xl bg-white/40 border-b border-white/20'
        }`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 100%)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(16px)',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(16px)',
          borderBottom: isScrolled 
            ? '1px solid rgba(255,255,255,0.3)' 
            : '1px solid rgba(255,255,255,0.2)',
          boxShadow: isScrolled
            ? '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1) inset'
            : '0 10px 30px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.05) inset'
        }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 8 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #9333ea 0%, #8b5cf6 50%, #3b82f6 100%)',
                  boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }}
              >
                <FaFilm className="text-white text-lg lg:text-xl" />
              </motion.div>
              <span className="text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-all duration-300 group-hover:scale-105 inline-block">
                QuickShow
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={item.path}
                    className={`relative flex items-center space-x-2 px-5 py-3 rounded-2xl transition-all duration-300 group ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    style={{
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                  >
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className="text-sm group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium group-hover:font-semibold">{item.name}</span>
                    {location.pathname === item.path && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-600 rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.form
                      initial={{ width: 0, opacity: 0, scale: 0.8 }}
                      animate={{ width: 280, opacity: 1, scale: 1 }}
                      exit={{ width: 0, opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      onSubmit={handleSearch}
                      className="relative"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search movies..."
                        className="w-full px-5 py-3 bg-white/80 backdrop-blur-md border border-white/30 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                        style={{
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2) inset'
                        }}
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
                      >
                        <FaSearch className="text-sm" />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.button
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      onClick={() => setIsSearchOpen(true)}
                      className="relative p-3 text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-2xl transition-all duration-300 group"
                      style={{
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)'
                      }}
                    >
                      <FaSearch className="text-lg group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="hidden lg:block">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    {allUserMenuItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <Link
                          to={item.path}
                          className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition-all duration-300 group ${
                            location.pathname === item.path
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                          }`}
                          style={{
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)'
                          }}
                        >
                          {location.pathname === item.path && (
                            <motion.div
                              layoutId="activeUserTab"
                              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl"
                              style={{ zIndex: -1 }}
                            />
                          )}
                          <item.icon className="text-sm group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium text-sm group-hover:font-semibold">{item.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                    
                    {/* Prominent Logout Button */}
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition-all duration-300 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <FaUser className="text-sm relative z-10" />
                      <span className="text-sm relative z-10">Logout</span>
                    </motion.button>
                    
                    {/* User Avatar */}
                    <div className="relative group">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-11 h-11 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #9333ea 0%, #8b5cf6 50%, #3b82f6 100%)',
                          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(255,255,255,0.2) inset'
                        }}
                      >
                        <FaUser className="text-white" />
                      </motion.div>
                      
                      {/* Dropdown Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 0, y: 10, scale: 0.95 }}
                        whileHover={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300"
                        style={{
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2) inset'
                        }}
                      >
                        <div className="p-5">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                              <FaUser className="text-white text-sm" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold">{user?.name || 'User'}</p>
                              <p className="text-gray-600 text-sm">{user?.email || 'user@example.com'}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Link
                              to="/profile"
                              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-300 font-medium"
                            >
                              Profile Settings
                            </Link>
                            <Link
                              to="/booking-history"
                              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-300 font-medium"
                            >
                              Booking History
                            </Link>
                            <div className="border-t border-gray-200/50 my-2"></div>
                            <button
                              onClick={handleLogout}
                              className="w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300 font-medium text-left"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300 font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative p-3 text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-2xl transition-all duration-300 group overflow-hidden"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 text-lg">
                  {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="lg:hidden bg-white/90 backdrop-blur-xl border-t border-white/30 shadow-2xl overflow-hidden"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2) inset'
              }}
            >
              <div className="container mx-auto px-6 py-8 space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                      }`}
                      style={{
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)'
                      }}
                    >
                      <item.icon className="text-lg group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium text-lg group-hover:font-semibold">{item.name}</span>
                      {location.pathname === item.path && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Auth Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="pt-6 border-t border-gray-200/50"
                >
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-5 py-4 text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-2xl transition-all duration-300 font-medium"
                        style={{
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)'
                        }}
                      >
                        Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-center px-5 py-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-2xl transition-all duration-300 font-medium"
                          style={{
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)'
                          }}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full px-5 py-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-all duration-300 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-5 py-4 text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-2xl transition-all duration-300 font-medium"
                        style={{
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)'
                        }}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-5 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-medium shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #9333ea 0%, #8b5cf6 50%, #3b82f6 100%)',
                          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(255,255,255,0.2) inset'
                        }}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default PremiumNavbar;
