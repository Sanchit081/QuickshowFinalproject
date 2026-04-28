import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaClock, FaCalendar, FaChevronRight, FaInfo, FaFilm } from 'react-icons/fa';

const PremiumHeroSection = ({ movies = [] }) => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (movies.length > 0) {
      setIsLoaded(true);
    }
  }, [movies]);

  useEffect(() => {
    if (!movies.length) return;

    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  const handleDotClick = (index) => {
    setCurrentMovie(index);
  };

  // Fallback image if movie poster/banner is not available
  const getMovieImage = () => {
    const currentMovieData = movies[currentMovie];
    if (currentMovieData?.banner) return currentMovieData.banner;
    if (currentMovieData?.poster) return currentMovieData.poster;
    // Add a fallback image URL or return null
    return null;
  };

  const movieImage = getMovieImage();

  if (!isLoaded || movies.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 pt-16 lg:pt-20">
      {/* Cinematic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {movieImage ? (
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%), url(${movieImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <FaFilm className="text-6xl text-white/20 mb-4 mx-auto" />
                  <p className="text-white/50 text-lg">Movie Poster Loading...</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Cinematic Lighting Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          
          {/* Subtle animated particles - REMOVED FOR CLEAN LOOK */}
          
        </motion.div>
      </AnimatePresence>

      {/* Premium Content */}
      <div className="relative z-10 min-h-screen flex items-center pt-8 lg:pt-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">
                  {movies[currentMovie]?.category || 'Featured Movie'}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight"
              >
                {movies[currentMovie]?.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xl lg:text-2xl text-gray-300 leading-relaxed line-clamp-3"
              >
                {movies[currentMovie]?.description}
              </motion.p>

              {/* Movie Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap items-center gap-8 text-white"
              >
                <div className="flex items-center space-x-2">
                  <FaStar className="text-orange-500 text-lg" />
                  <span className="font-semibold text-lg">{movies[currentMovie]?.rating || '8.5'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="text-blue-400 text-lg" />
                  <span className="text-lg">{movies[currentMovie]?.duration || '2h 30m'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendar className="text-purple-400 text-lg" />
                  <span className="text-lg">{movies[currentMovie]?.releaseDate || new Date().getFullYear()}</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <Link
                  to={`/movies/${movies[currentMovie]?._id}`}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
                >
                  <FaPlay className="text-sm" />
                  <span>Watch Trailer</span>
                  <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to={`/movies/${movies[currentMovie]?._id}`}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-3"
                >
                  <FaInfo className="text-sm" />
                  <span>More Info</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Movie Poster */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex justify-center lg:justify-end"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="relative group">
                  <img
                    src={movies[currentMovie]?.poster}
                    alt={movies[currentMovie]?.title}
                    className="w-72 h-96 lg:w-80 lg:h-[480px] xl:w-96 xl:h-[560px] object-cover rounded-2xl shadow-2xl"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <p className="text-sm opacity-75">Now Showing</p>
                          <p className="text-lg font-semibold">{movies[currentMovie]?.title}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                          <FaPlay className="text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300"></div>
                </div>
                
                {/* Rating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold">{movies[currentMovie]?.rating || '8.5'}</div>
                    <div className="text-xs opacity-75">IMDb</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {movies.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentMovie
                ? 'w-8 bg-gradient-to-r from-purple-600 to-blue-600'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, repeat: Infinity, repeatType: "reverse", duration: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 translate-y-16 z-20"
      >
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2">Scroll down</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumHeroSection;
