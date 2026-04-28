import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaSignInAlt, FaFilm, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginUser } from '../store/slices/authSlice';
import { readStorage } from '../utils/storage';

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated || readStorage('token')) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearError());
  }, [dispatch, error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Branding / Hero */}
          <div className="hidden md:flex flex-col space-y-6 text-gray-900">
            <div className="inline-flex items-center space-x-2 rounded-full bg-purple-100 border border-purple-200 px-4 py-2 text-sm text-purple-600 w-max">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Book movies in seconds</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              Welcome back to
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                QuickShow
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Continue where you left off, manage your bookings, wishlist your favourite movies,
              and never miss a show again.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-700">Fast bookings</span>
              <span className="px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-700">Smart seat selection</span>
              <span className="px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-700">Wishlists</span>
              <span className="px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-700">Live chat</span>
            </div>
          </div>

          {/* Right: Login Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl shadow-lg"
              >
                <FaFilm />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to QuickShow</h2>
              <p className="text-gray-600">Use your email and password to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 bg-white text-purple-600 focus:ring-purple-500" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-purple-600 hover:text-purple-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FaSignInAlt />
                    <span>Sign In</span>
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Sign up now
                </Link>
              </p>
            </div>

            {/* Social Login Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
