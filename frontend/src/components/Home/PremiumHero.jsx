import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaClock, FaCalendar, FaCrown, FaGem } from 'react-icons/fa';

const PremiumHero = ({ movies }) => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Auto-rotate movies
  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDotClick = (index) => {
    setCurrentMovie(index);
    setIsAutoPlaying(false);
  };

  if (movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-purple-400/10" />
        <div className="loading-luxury w-full h-screen luxury-card-gold" />
      </div>
    );
  }

  const movie = movies[currentMovie];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Background with Parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${movie.banner || movie.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        >
          {/* Multi-layer Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30" />
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0">
        {/* Gold Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`gold-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-30"
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 0.6, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Platinum Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`platinum-${i}`}
            className="absolute w-1 h-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 80 - 40, 0],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Premium Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center space-x-3 px-6 py-3 rounded-full luxury-card-gold border-luxury"
              >
                <FaCrown className="text-yellow-400 text-lg" />
                <span className="text-sm font-medium text-gradient-gold">Premium Experience</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </motion.div>

              {/* Enhanced Title */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                  <span className="text-gradient-luxury">{movie.title}</span>
                </h1>
                <div className="flex items-center space-x-4">
                  <FaGem className="text-2xl text-gradient-platinum animate-float-luxury" />
                  <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1" />
                </div>
              </motion.div>

              {/* Enhanced Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-gray-300 leading-relaxed max-w-2xl"
              >
                {movie.description}
              </motion.p>

              {/* Premium Meta */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center space-x-2 luxury-card-platinum px-4 py-2 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span className="text-white font-semibold">{movie.rating}</span>
                </div>
                <div className="flex items-center space-x-2 luxury-card px-4 py-2 rounded-full">
                  <FaClock className="text-gray-400" />
                  <span className="text-gray-300">{movie.duration} min</span>
                </div>
                <div className="flex items-center space-x-2 luxury-card px-4 py-2 rounded-full">
                  <FaCalendar className="text-gray-400" />
                  <span className="text-gray-300">
                    {new Date(movie.releaseDate).getFullYear()}
                  </span>
                </div>
              </motion.div>

              {/* Enhanced Genres */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-3"
              >
                {movie.genres?.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="px-4 py-2 rounded-full text-sm luxury-card-gold text-gradient-gold font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </motion.div>

              {/* Premium CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-6"
              >
                <Link
                  to={`/movies/${movie._id}`}
                  className="btn-luxury-gold text-lg px-8 py-4 glow-luxury group"
                >
                  <FaPlay className="mr-3 group-hover:animate-pulse" />
                  Book Premium Experience
                </Link>
                <Link
                  to="/movies"
                  className="btn-luxury-platinum text-lg px-8 py-4 glow-platinum"
                >
                  Explore Collection
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Enhanced Movie Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="hidden lg:block relative"
            >
              <div className="relative group">
                {/* Glow Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-600/10 to-purple-600/10 rounded-3xl blur-xl animate-pulse-luxury" />
                
                {/* Main Image */}
                <div className="relative luxury-card-gold border-luxury rounded-3xl overflow-hidden transform group-hover:scale-105 transition-all duration-700">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full max-w-sm mx-auto rounded-3xl"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Premium Badge */}
                  <div className="absolute top-4 right-4 luxury-card-platinum px-3 py-2 rounded-full">
                    <FaCrown className="text-yellow-400 text-sm" />
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute bottom-4 left-4 luxury-card-gold px-3 py-2 rounded-full">
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-white font-bold">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-500 ${
              currentMovie === index
                ? 'w-12 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full glow-luxury'
                : 'w-3 h-3 bg-white/30 hover:bg-white/50 rounded-full'
            }`}
            aria-label={`Go to movie ${index + 1}`}
          />
        ))}
      </div>

      {/* Enhanced AI Assistant Button */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-12 right-12 z-50"
      >
        <button
          onClick={() => window.location.hash = '#ai-chat'}
          className="w-20 h-20 rounded-full luxury-card-gold border-luxury flex items-center justify-center glow-luxury group animate-pulse-luxury"
        >
          <div className="text-center">
            <span className="text-2xl font-bold text-gradient-gold">AI</span>
            <div className="text-xs text-gradient-gold">Chat</div>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-white" />
        </button>
      </motion.div>

      {/* Premium Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-12 left-12 z-20"
      >
        <div className="flex flex-col items-center space-y-2 text-gray-400">
          <span className="text-sm font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumHero;
