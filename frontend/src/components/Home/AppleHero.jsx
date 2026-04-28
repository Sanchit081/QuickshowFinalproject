import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const AppleHero = ({ movies }) => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate movies
  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % movies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const handleDotClick = (index) => {
    setCurrentMovie(index);
    setIsAutoPlaying(false);
  };

  if (movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-black">
        <div className="loading-apple w-full h-screen apple-card-glass" />
      </div>
    );
  }

  const movie = movies[currentMovie];

  return (
    <div className="relative min-h-screen overflow-hidden bg-apple-black">
      {/* Cinematic Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${movie.banner || movie.poster})`,
            }}
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-apple-black via-apple-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-apple-black via-transparent to-apple-black/90" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Minimal Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
                {movie.title}
              </h1>
              
              {/* Subtle Divider */}
              <div className="w-24 h-px bg-apple-subtle mx-auto" />
              
              {/* Minimal Description */}
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                {movie.description}
              </p>
              
              {/* Clean CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to={`/movies/${movie._id}`}
                  className="apple-button apple-button-primary text-lg px-8 py-4"
                >
                  <FaPlay className="mr-3" />
                  Watch Now
                </Link>
                <Link
                  to="/movies"
                  className="apple-button text-lg px-8 py-4"
                >
                  Browse Films
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Minimal Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-500 ${
              currentMovie === index
                ? 'w-8 h-2 bg-apple-primary rounded-full'
                : 'w-2 h-2 bg-apple-subtle rounded-full hover:bg-apple-secondary'
            }`}
            aria-label={`Go to movie ${index + 1}`}
          />
        ))}
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-8 z-20"
      >
        <div className="flex flex-col items-center space-y-2 text-gray-600">
          <span className="text-sm font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-6 bg-apple-subtle"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AppleHero;
