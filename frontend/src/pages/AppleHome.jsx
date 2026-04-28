import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilm, FaStar, FaRobot, FaExclamationTriangle, FaPlay } from 'react-icons/fa';
import axios from '../utils/axios';
import PremiumHeroSection from '../components/Home/PremiumHeroSection';
import PremiumMovieSection from '../components/Home/PremiumMovieSection';
import GeminiTest from '../components/GeminiTest';
import AppleGeminiChat from '../components/AI/AppleGeminiChat';

const AppleHome = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [aiPicks, setAiPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppleHomeData();
  }, []);

  const fetchAppleHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [moviesResponse, topRatedResponse, aiPicksResponse] = await Promise.all([
        axios.get('/movies', { timeout: 10000 }),
        axios.get('/movies/top-rated', { timeout: 10000 }),
        axios.get('/gemini/ai-picks', { timeout: 12000 })
      ]);

      const allMovies = moviesResponse.data.movies || [];
      const nowShowingMovies = allMovies.filter((m) => m.isNowShowing);

      setNowShowing(nowShowingMovies);
      setTopRated(topRatedResponse.data.movies || nowShowingMovies.slice(0, 10));
      setAiPicks(aiPicksResponse.data.picks || nowShowingMovies.slice(0, 8));

      setLoading(false);
    } catch (error) {
      console.error('AppleHome data fetch error:', error);
      setError('Failed to load movies. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAppleHomeData}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Premium Hero Section */}
      <PremiumHeroSection movies={nowShowing} />

      {/* Premium Movie Sections */}
      <div className="space-y-0">
        {/* Trending Now */}
        <PremiumMovieSection
          title="Trending Now"
          movies={nowShowing.slice(0, 8)}
          icon={FaStar}
          gradient="from-accent-red to-accent-orange"
          variant="trending"
        />

        {/* AI Picks */}
        <PremiumMovieSection
          title="AI Curated Picks"
          movies={aiPicks}
          icon={FaRobot}
          gradient="from-accent-purple to-accent-blue"
          showAI={true}
          variant="ai"
        />

        {/* Top Rated */}
        <PremiumMovieSection
          title="Top Rated"
          movies={topRated}
          icon={FaStar}
          gradient="from-yellow-400 to-yellow-600"
          variant="premium"
        />

        {/* Movie Trailers Grid */}
        <section className="py-16 lg:py-24 relative overflow-hidden">
          {/* Aesthetic Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100" />
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center space-x-6 mb-6">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <FaPlay className="text-white text-xl" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl opacity-30 blur-lg"
                  />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Latest Movie Trailers
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch the latest movie trailers and discover your next cinema experience
              </p>
            </motion.div>

            {/* Trailers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trailer 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-xl"
              >
                <iframe
                  src="https://www.youtube.com/embed/LR-y1v6qywA?autoplay=1&mute=1&loop=1&playlist=LR-y1v6qywA&controls=0&showinfo=0&rel=0"
                  title="Trailer 1"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
              
              {/* Trailer 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-xl"
              >
                <iframe
                  src="https://www.youtube.com/embed/Os4JVfZp4jg?autoplay=1&mute=1&loop=1&playlist=Os4JVfZp4jg&controls=0&showinfo=0&rel=0"
                  title="Trailer 2"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
              
              {/* Trailer 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-xl"
              >
                <iframe
                  src="https://www.youtube.com/embed/818y7rF3XPI?autoplay=1&mute=1&loop=1&playlist=818y7rF3XPI&controls=0&showinfo=0&rel=0"
                  title="Trailer 3"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
              
              {/* Trailer 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-xl"
              >
                <iframe
                  src="https://www.youtube.com/embed/XW1RkKiRnsg?autoplay=1&mute=1&loop=1&playlist=XW1RkKiRnsg&controls=0&showinfo=0&rel=0"
                  title="Trailer 4"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
              
              {/* Trailer 5 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-xl"
              >
                <iframe
                  src="https://www.youtube.com/embed/5X1dMFuHZhc?autoplay=1&mute=1&loop=1&playlist=5X1dMFuHZhc&controls=0&showinfo=0&rel=0"
                  title="Trailer 5"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
              
              {/* Trailer 6 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-xl"
              >
                <iframe
                  src="https://www.youtube.com/embed/S4UI11MeljA?autoplay=1&mute=1&loop=1&playlist=S4UI11MeljA&controls=0&showinfo=0&rel=0"
                  title="Trailer 6"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Now Showing */}
        <PremiumMovieSection
          title="Now Showing"
          movies={nowShowing}
          icon={FaFilm}
          gradient="from-accent-purple to-accent-blue"
        />
      </div>

      {/* AI Chat */}
      <GeminiTest />
      <AppleGeminiChat />
    </div>
  );
};

export default AppleHome;
