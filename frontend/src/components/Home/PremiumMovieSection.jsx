import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaCrown, FaFire, FaRocket } from 'react-icons/fa';
import PremiumMovieCard from './PremiumMovieCard';

const PremiumMovieSection = ({ title, movies, icon: Icon, gradient, showAI = false, variant = 'default' }) => {
  if (!movies || movies.length === 0) return null;

  const getVariantConfig = (variant) => {
    switch (variant) {
      case 'trending':
        return {
          icon: FaFire,
          gradient: 'from-accent-red to-accent-orange',
          badge: 'TRENDING'
        };
      case 'ai':
        return {
          icon: FaRocket,
          gradient: 'from-accent-purple to-accent-blue',
          badge: 'AI CURATED'
        };
      case 'premium':
        return {
          icon: FaCrown,
          gradient: 'from-yellow-400 to-yellow-600',
          badge: 'PREMIUM'
        };
      default:
        return {
          icon: Icon,
          gradient: 'from-accent-purple to-accent-blue',
          badge: null
        };
    }
  };

  const config = getVariantConfig(variant);
  const SectionIcon = config.icon;

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Aesthetic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center space-x-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <SectionIcon className="text-white text-xl" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl opacity-30 blur-lg"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">{title}</h2>
              <div className="flex items-center space-x-4">
                {showAI && (
                  <div className="flex items-center space-x-2">
                    <span className="px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-600 text-sm font-medium flex items-center space-x-2">
                      <FaRocket className="text-xs" />
                      <span>AI Curated</span>
                    </span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                )}
                {config.badge && (
                  <span className={`px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-semibold shadow-lg`}>
                    {config.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link
            to="/movies"
            className="group flex items-center space-x-3 px-6 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 hover:bg-gray-200 hover:border-purple-600 hover:text-purple-600 transition-all duration-300"
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

        {/* Movies Horizontal Scroll */}
        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
            {movies.map((movie, index) => (
              <PremiumMovieCard 
                key={movie._id} 
                movie={movie} 
                index={index}
                variant={variant}
              />
            ))}
          </div>
          
          {/* Gradient Edges for Scroll */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default PremiumMovieSection;
