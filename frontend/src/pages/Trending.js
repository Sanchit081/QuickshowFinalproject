import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTop10Today, searchMovies } from '../services/tmdbService';
import MovieCard from '../components/MovieCard';
import { FiSearch, FiTrendingUp, FiCalendar, FiStar } from 'react-icons/fi';

const Trending = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const trendingMovies = await getTop10Today();
        setMovies(trendingMovies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  // Search movies
  useEffect(() => {
    const searchMoviesHandler = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const results = await searchMovies(searchQuery);
        setSearchResults(results.results || []);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchMoviesHandler, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const displayMovies = searchQuery ? searchResults : movies;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <FiTrendingUp className="text-white text-2xl" />
              </motion.div>
              <h1 className="text-5xl font-bold text-white">Trending Movies</h1>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Discover the most popular movies right now
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-72 bg-gray-200 rounded-2xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : displayMovies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-xl">
                {searchQuery ? 'No movies found' : 'No trending movies available'}
              </p>
            </div>
          ) : (
            <div>
              {/* Search Results Header */}
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900">
                    Search Results ({searchResults.length})
                  </h2>
                </motion.div>
              )}

              {/* Movies Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {displayMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <MovieCard movie={movie} variant="default" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {!loading && !error && movies.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrendingUp className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily Trending</h3>
                <p className="text-gray-600">Updated every 24 hours with the latest trending movies</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiStar className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Rated</h3>
                <p className="text-gray-600">Highest rated movies based on user reviews and ratings</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCalendar className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Fresh Content</h3>
                <p className="text-gray-600">New releases and classic movies updated regularly</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Trending;
