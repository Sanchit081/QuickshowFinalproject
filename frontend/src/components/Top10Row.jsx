import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiPlay, FiStar } from 'react-icons/fi';
import { getTop10Today } from '../services/tmdbService';
import Top10Debug from './Top10Debug';

const Top10Row = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Fetch top 10 trending movies
  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        console.log('Top10Row: Starting to fetch movies...');
        setLoading(true);
        setError(null);
        const topMovies = await getTop10Today();
        console.log('Top10Row: Successfully fetched movies:', topMovies.length);
        setMovies(topMovies);
      } catch (err) {
        console.error('Top10Row: Error fetching movies:', err);
        setError(err.message);
      } finally {
        console.log('Top10Row: Setting loading to false');
        setLoading(false);
      }
    };

    fetchTopMovies();
    
    // Auto-refresh every 24 hours
    const interval = setInterval(fetchTopMovies, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      setCurrentIndex(Math.min(movies.length - 1, currentIndex + 1));
    }
  };

  // Memoized movie cards for performance
  const movieCards = useMemo(() => {
    if (!movies.length) return [];
    
    console.log('Top10Row: Creating movie cards for movies:', movies);
    
    return movies.map((movie, index) => (
      <motion.div
        key={movie.id}
        className="flex-shrink-0 relative group"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {/* Rank Number - Big and Bold */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-6xl font-black text-gray-800/20 select-none">
            {movie.rank}
          </div>
        </div>

        {/* Movie Card */}
        <Link 
          to={`/movies/${movie.id}/booking`} 
          className="block"
          onClick={(e) => {
            console.log('Movie clicked, navigating to:', `/movies/${movie.id}/booking`);
            console.log('Movie data:', movie);
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-48 h-72 cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all duration-300"
          >
            {/* Movie Poster */}
            <div className="relative w-full h-full">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onLoad={() => console.log('Image loaded successfully:', movie.poster)}
                  onError={(e) => {
                    console.error('Image failed to load:', movie.poster);
                    e.target.src = 'https://via.placeholder.com/200x300/1f2937/ffffff?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <span className="text-gray-800 text-sm font-bold">No Poster</span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Hover Info Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="text-gray-800 text-xl font-bold line-clamp-2 drop-shadow-lg">
                    {movie.title}
                  </h3>
                  
                  {/* Rating Badge */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-yellow-500/90 px-2 py-1 rounded-full">
                      <FiStar className="text-gray-800 text-sm" />
                      <span className="text-gray-800 text-sm font-bold">{movie.rating}</span>
                    </div>
                    <div className="bg-red-600/90 px-2 py-1 rounded-full">
                      <span className="text-gray-800 text-xs font-bold">#{movie.rank}</span>
                    </div>
                  </div>
                  
                  {/* Play Button */}
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                      <FiPlay className="text-black ml-1" />
                    </div>
                    <span className="text-gray-800 text-sm font-medium">Watch Now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rank Badge */}
            <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-gray-800 text-sm font-black">{movie.rank}</span>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    ));
  }, [movies]);

  // Loading skeleton
  if (loading) {
    console.log('Top10Row: Rendering loading state');
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-gray-800 text-2xl">🔥</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800">Trending Today</h2>
            </div>
          </div>
          
          {/* Skeleton Cards */}
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48 h-72 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    console.log('Top10Row: Rendering error state:', error);
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center py-12">
            <p className="text-red-500 text-xl">Failed to load trending movies</p>
            <p className="text-gray-800 text-sm mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-gray-800 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  console.log('Top10Row: Rendering main content with', movies.length, 'movies');

  return (
    <>
      <Top10Debug />
      <section className="py-8 bg-black relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-gray-800 text-lg">🔥</span>
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Top 10 Today</h2>
              <p className="text-gray-400 text-xs">Trending movies right now</p>
            </div>
          </div>
          
          <Link
            to="/trending"
            className="text-gray-800 hover:text-gray-300 transition-colors text-sm"
          >
            View All →
          </Link>
        </motion.div>

        {/* Movie Row */}
        <div className="relative">
          {/* Scroll Buttons */}
          {movies.length > 0 && (
            <>
              <button
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="text-xl" />
              </button>
              
              <button
                onClick={scrollRight}
                disabled={currentIndex === movies.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </>
          )}

          {/* Movie Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movieCards}
          </div>
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {movies.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-red-600 w-8' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
    </>
  );
};

export default React.memo(Top10Row);
