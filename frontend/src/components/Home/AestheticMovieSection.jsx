import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaPlay, FaHeart, FaFire, FaGem, FaFilm, FaClock, FaCalendar } from 'react-icons/fa';

const AestheticMovieSection = ({ title, movies, icon: Icon, gradient, showAI = false, variant = 'default' }) => {
  if (!movies || movies.length === 0) return null;

  const getCardVariant = (variant) => {
    switch (variant) {
      case 'accent':
        return 'textured-card-accent border-accent';
      case 'subtle':
        return 'textured-card bg-texture-subtle';
      default:
        return 'textured-card';
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-pink-50">
      {/* Textured Background */}
      <div className="absolute inset-0 bg-texture-pattern opacity-30" />
      <div className={`absolute inset-0 ${gradient} opacity-5`} />
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full"
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.6, 0],
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
      
      <div className="container mx-auto px-8 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Icon className="text-4xl text-gradient-accent" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 text-4xl opacity-30"
              >
                <Icon className="text-gradient-accent" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gradient-accent">{title}</h2>
              {showAI && (
                <div className="flex items-center space-x-2">
                  <span className="px-4 py-2 rounded-full textured-card-accent text-accent text-sm font-medium flex items-center space-x-2">
                    <span>AI Curated</span>
                  </span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </div>
          <Link
            to="/movies"
            className="group flex items-center space-x-2 text-accent hover:text-red-600 transition-all duration-300"
          >
            <span className="font-medium">View All</span>
            <motion.div
              animate={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="transform"
            >
              <FaPlay className="text-sm rotate-90" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Enhanced Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {movies.map((movie, index) => (
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              className="group relative"
            >
              {/* Premium Movie Card */}
              <div className={`relative ${getCardVariant(variant)} rounded-2xl overflow-hidden transition-all duration-700 hover:transform hover:scale-105`}>
                {/* Enhanced Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Multi-layer Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Enhanced Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <Link
                      to={`/movies/${movie._id}`}
                      className="w-16 h-16 rounded-full textured-card-accent border-accent flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-700 hover:scale-110"
                    >
                      <FaPlay className="text-accent text-xl ml-1" />
                    </Link>
                  </div>
                  
                  {/* Enhanced Rating Badge */}
                  <div className="absolute top-4 right-4 textured-card px-3 py-2 rounded-full">
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-red-500 text-sm" />
                      <span className="text-primary font-bold text-sm">{movie.rating}</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Wishlist Button */}
                  <button className="absolute top-4 left-4 w-10 h-10 rounded-full textured-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110">
                    <FaHeart className="text-red-500 text-sm" />
                  </button>
                </div>
                
                {/* Enhanced Movie Info */}
                <div className="p-6 space-y-4 bg-white/90 backdrop-blur-sm">
                  <div className="space-y-2">
                    <h3 className="font-bold text-primary line-clamp-1 text-lg group-hover:text-accent transition-colors duration-300">
                      {movie.title}
                    </h3>
                    
                    {/* Enhanced Genres */}
                    <div className="flex flex-wrap gap-2">
                      {movie.genres?.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            variant === 'accent' 
                              ? 'textured-card-accent text-accent' 
                              : 'textured-card text-secondary'
                          }`}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Enhanced Meta */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3 text-secondary">
                      <span className="flex items-center space-x-1">
                        <FaClock className="text-xs" />
                        <span>{movie.duration} min</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FaCalendar className="text-xs" />
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10 bg-gradient-to-r from-red-400/30 to-pink-400/30 blur-xl" />
              
              {/* Floating Particles on Hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.random() * 20 - 10, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random(),
                    }}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AestheticMovieSection;
