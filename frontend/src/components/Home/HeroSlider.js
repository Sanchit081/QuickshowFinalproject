import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const BACKEND_BASE_URL = API_URL.replace(/\/api$/, '');

const HeroSlider = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  const bannerSrc = currentMovie.banner?.startsWith('/uploads')
    ? `${BACKEND_BASE_URL}${currentMovie.banner}`
    : currentMovie.banner;

  const posterSrc = currentMovie.poster?.startsWith('/uploads')
    ? `${BACKEND_BASE_URL}${currentMovie.poster}`
    : currentMovie.poster;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bannerSrc || posterSrc || 'https://via.placeholder.com/1200x600'})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full container mx-auto px-4 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-white space-y-4 md:space-y-6 bg-black/40 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/60"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{currentMovie.title}</h1>
          <p className="text-lg md:text-xl mb-6 line-clamp-3">{currentMovie.description}</p>
          <div className="flex items-center space-x-4 mb-6">
            <span className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span>{currentMovie.rating || 'N/A'}</span>
            </span>
            <span>{currentMovie.duration} min</span>
            <span>{currentMovie.genres?.join(', ')}</span>
          </div>
          <div className="flex space-x-4">
            <Link
              to={`/movies/${currentMovie._id}`}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlay />
              <span>Book Now</span>
            </Link>
            <Link
              to={`/movies/${currentMovie._id}`}
              className="btn-secondary"
            >
              View Details
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 glass p-3 rounded-full hover:bg-white/30 transition-all hover:scale-105"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 glass p-3 rounded-full hover:bg-white/30 transition-all hover:scale-105"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;


