import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaClock, FaCalendar } from 'react-icons/fa';

const HeroSection = ({ movies }) => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate movies
  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const handleDotClick = (index) => {
    setCurrentMovie(index);
    setIsAutoPlaying(false);
  };

  if (movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="loading-skeleton w-full h-screen" />
      </div>
    );
  }

  const movie = movies[currentMovie];

  // Debug: Log movie data
  console.log('Current movie:', movie);
  console.log('Movie banner:', movie.banner);
  console.log('Movie poster:', movie.poster);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl md:text-7xl font-bold text-white leading-tight"
                >
                  {movie.title}
                </motion.h1>
                <p className="text-white text-xl">Clean hero section ready for background</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentMovie
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Ask AI Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button
          onClick={() => window.location.hash = '#ai-chat'}
          className="w-16 h-16 rounded-full glass-card flex items-center justify-center neon-glow group"
        >
          <span className="text-2xl">AI</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
        </button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
