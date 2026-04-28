import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaPlay, FaClock, FaCalendar } from 'react-icons/fa';
import { normalizeGenres, normalizePoster } from '../../utils/movie';

const AppleMovieSection = ({ title, movies, icon: Icon, showAI = false }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-6">
        {/* Clean Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center space-x-4">
            <Icon className="text-3xl text-apple-primary" />
            <h2 className="text-3xl font-bold text-apple-primary">{title}</h2>
            {showAI && (
              <span className="px-3 py-1 rounded-full bg-red-50 text-xs font-semibold text-red-700 border border-red-100">
                AI
              </span>
            )}
          </div>
          <Link
            to="/movies"
            className="text-apple-secondary hover:text-red-700 transition-colors duration-200 font-medium"
          >
            View All
          </Link>
        </motion.div>

        {/* Clean Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie, index) => (
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.05, 
                duration: 0.6,
                ease: "easeOut"
              }}
              className="group"
            >
              <div className="movie-card">
                {/* Poster */}
                <div className="relative overflow-hidden">
                  <img
                    src={normalizePoster(movie.poster)}
                    alt={movie.title}
                    className="movie-card-poster"
                    loading="lazy"
                  />
                  
                  {/* Premium Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* CTA */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      to={`/movies/${movie._id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-4 py-2 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <FaPlay className="text-xs" />
                      <span className="text-sm font-semibold">View</span>
                    </Link>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-white/50">
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-gray-900 text-xs font-semibold">{movie.rating || '—'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="movie-card-content">
                  <h3 className="font-semibold text-apple-primary line-clamp-1 mb-2 group-hover:text-red-700 transition-colors duration-200">
                    {movie.title}
                  </h3>
                  
                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {normalizeGenres(movie.genres).slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700 border border-gray-200"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-xs text-apple-muted mb-4">
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-apple-muted" />
                      <span>{movie.duration ? `${movie.duration}m` : '—'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaCalendar className="text-apple-muted" />
                      <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '—'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/movies/${movie._id}`}
                      className="text-sm font-semibold text-red-700 hover:text-red-800 transition-colors"
                    >
                      Book tickets
                    </Link>
                    <span className="text-xs text-gray-500">QuickShow</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppleMovieSection;
