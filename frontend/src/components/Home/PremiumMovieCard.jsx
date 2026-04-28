import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaHeart, FaPlus, FaInfo, FaClock, FaCalendar } from 'react-icons/fa';

const PremiumMovieCard = ({ movie, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const handleAddToWatchlist = (e) => {
    e.preventDefault();
    // Add to watchlist logic
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <Link to={`/movies/${movie._id}`} className="block">
        <div className="relative overflow-hidden rounded-xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl bg-white border border-gray-200">
          {/* Movie Poster */}
          <div className="relative w-48 h-72 lg:w-56 lg:h-80">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-90"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Hover Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      // Play trailer logic
                    }}
                    className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaPlay className="ml-1" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <FaHeart className={isLiked ? '' : 'text-sm'} />
                  </motion.button>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddToWatchlist}
                    className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-purple-600 hover:border-purple-600 transition-all duration-300"
                  >
                    <FaPlus className="text-sm" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-purple-600 hover:border-purple-600 transition-all duration-300"
                  >
                    <FaInfo className="text-sm" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            {/* Rating Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg flex items-center space-x-1">
              <FaStar className="text-orange-500 text-xs" />
              <span className="text-gray-900 text-xs font-semibold">{movie.rating || '8.5'}</span>
            </div>
            
            {/* Genre Badge */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-purple-600/90 backdrop-blur-sm rounded-lg">
                <span className="text-white text-xs font-medium">{movie.genres[0]}</span>
              </div>
            )}
            
            {/* New/Popular Badge */}
            {(movie.isNew || movie.isTrending) && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-lg">
                <span className="text-white text-xs font-medium">
                  {movie.isNew ? 'NEW' : 'TRENDING'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Movie Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className="mt-3 px-1"
        >
          <h3 className="text-gray-900 font-semibold text-sm lg:text-base line-clamp-1 group-hover:text-purple-600 transition-colors duration-300">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-gray-500 text-xs lg:text-sm">
              {movie.year || new Date().getFullYear()}
            </p>
            <div className="flex items-center space-x-1">
              <FaStar className="text-orange-500 text-xs" />
              <span className="text-gray-600 text-xs">{movie.rating || '8.5'}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Expanded Info on Hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            height: isHovered ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-full left-0 right-0 mb-2 p-4 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
        >
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {movie.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <FaClock className="text-gray-400 text-xs" />
                <span className="text-gray-600 text-xs">{movie.duration || '2h 30m'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaCalendar className="text-gray-400 text-xs" />
                <span className="text-gray-600 text-xs">{movie.releaseDate || '2024'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xs ${
                    i < Math.floor((movie.rating || 8.5) / 2)
                      ? 'text-orange-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default PremiumMovieCard;
