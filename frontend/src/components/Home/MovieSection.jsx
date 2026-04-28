import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaPlay, FaHeart } from 'react-icons/fa';

const MovieSection = ({ title, movies, icon: Icon, gradient, showAI = false }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-16 relative">
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${gradient} opacity-10`} />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <Icon className="text-3xl text-white" />
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            {showAI && (
              <span className="px-3 py-1 rounded-full text-xs glass-card bg-gradient-to-r from-purple-600 to-blue-600">
                AI Curated
              </span>
            )}
          </div>
          <Link
            to="/movies"
            className="text-white hover:text-purple-400 transition-colors"
          >
            View All
          </Link>
        </motion.div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie, index) => (
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Movie Card */}
              <div className="relative glass-card rounded-xl overflow-hidden">
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      to={`/movies/${movie._id}`}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300"
                    >
                      <FaPlay className="text-white ml-1" />
                    </Link>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full glass-card flex items-center space-x-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-white text-xs font-semibold">{movie.rating}</span>
                  </div>
                  
                  {/* Wishlist Button */}
                  <button className="absolute top-2 left-2 w-8 h-8 rounded-full glass-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaHeart className="text-white text-sm" />
                  </button>
                </div>
                
                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white line-clamp-1 mb-2 group-hover:text-purple-400 transition-colors">
                    {movie.title}
                  </h3>
                  
                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genres?.slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="text-xs px-2 py-1 rounded-full glass-card text-gray-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  {/* Duration */}
                  <div className="flex items-center text-gray-400 text-sm">
                    <span>{movie.duration} min</span>
                  </div>
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSection;
