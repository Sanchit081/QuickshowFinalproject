import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFire, FaStar, FaRobot, FaGem, FaFilm, FaCrown, FaTicketAlt } from 'react-icons/fa';
import axios from 'axios';
import PremiumHero from '../components/Home/PremiumHero';
import PremiumMovieSection from '../components/Home/PremiumMovieSection';
import PremiumGeminiChat from '../components/AI/PremiumGeminiChat';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const PremiumHome = () => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [aiPicks, setAiPicks] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [premiumPicks, setPremiumPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPremiumHomeData();
  }, []);

  const fetchPremiumHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        moviesResponse,
        trendingResponse,
        topRatedResponse,
        aiPicksResponse,
        hiddenGemsResponse
      ] = await Promise.all([
        axios.get(`${API_URL}/movies`, { withCredentials: true }),
        axios.get(`${API_URL}/movies/trending`, { withCredentials: true }),
        axios.get(`${API_URL}/movies/top-rated`, { withCredentials: true }),
        axios.get(`${API_URL}/gemini/ai-picks`, { withCredentials: true }),
        axios.get(`${API_URL}/movies/hidden-gems`, { withCredentials: true })
      ]);

      const allMovies = moviesResponse.data.movies || moviesResponse.data;
      setMovies(allMovies);
      setTrendingMovies(trendingResponse.data.movies || allMovies.slice(0, 10));
      setTopRatedMovies(topRatedResponse.data.movies || allMovies.slice(0, 10));
      setAiPicks(aiPicksResponse.data.picks || allMovies.slice(0, 8));
      setHiddenGems(hiddenGemsResponse.data.movies || allMovies.slice(0, 8));
      
      // Create premium picks (top rated movies with high ratings)
      setPremiumPicks(allMovies
        .filter(m => m.rating >= 8.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8));

    } catch (err) {
      console.error('Error fetching premium home data:', err);
      setError('Failed to load premium content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-purple-400/10" />
        <div className="h-screen loading-luxury luxury-card-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="luxury-card-gold p-8 rounded-3xl">
            <h2 className="text-3xl font-bold text-gradient-gold mb-4">Premium Experience Unavailable</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button 
              onClick={fetchPremiumHomeData}
              className="btn-luxury-gold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nowShowing = movies.filter(m => m.isNowShowing);
  const comingSoon = movies.filter(m => m.isComingSoon);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black relative">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-luxury" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-luxury" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-purple-400/5" />
      </div>

      {/* Premium Hero */}
      <PremiumHero movies={nowShowing} />

      {/* Premium Picks - Gold Theme */}
      <PremiumMovieSection
        title="Premium Picks"
        movies={premiumPicks.length > 0 ? premiumPicks : topRatedMovies.slice(0, 8)}
        icon={FaCrown}
        gradient="bg-gradient-to-r from-yellow-400 to-yellow-600"
        variant="gold"
        showAI={true}
      />

      {/* Trending Now - Cosmic Theme */}
      <PremiumMovieSection
        title="Trending Now"
        movies={trendingMovies.length > 0 ? trendingMovies : nowShowing.slice(0, 10)}
        icon={FaFire}
        gradient="bg-gradient-to-r from-orange-500 to-red-500"
        variant="trending"
      />

      {/* AI Picks - Platinum Theme */}
      <PremiumMovieSection
        title="AI Curated"
        movies={aiPicks.length > 0 ? aiPicks : nowShowing.slice(0, 8)}
        icon={FaRobot}
        gradient="bg-gradient-to-r from-purple-500 to-blue-500"
        variant="platinum"
        showAI={true}
      />

      {/* Top Rated - Default Theme */}
      <PremiumMovieSection
        title="Critically Acclaimed"
        movies={topRatedMovies.length > 0 ? topRatedMovies : nowShowing.slice(0, 10)}
        icon={FaStar}
        gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
        variant="default"
      />

      {/* Now Showing */}
      <PremiumMovieSection
        title="Now Showing"
        movies={nowShowing}
        icon={FaFilm}
        gradient="bg-gradient-to-r from-green-500 to-teal-500"
        variant="cosmic"
      />

      {/* Hidden Gems - Platinum Theme */}
      <PremiumMovieSection
        title="Hidden Gems"
        movies={hiddenGems.length > 0 ? hiddenGems : nowShowing.slice(0, 8)}
        icon={FaGem}
        gradient="bg-gradient-to-r from-pink-500 to-purple-500"
        variant="platinum"
        showAI={true}
      />

      {/* Coming Soon */}
      <PremiumMovieSection
        title="Coming Soon"
        movies={comingSoon}
        icon={FaTicketAlt}
        gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
        variant="default"
      />

      {/* Premium AI Chat Assistant */}
      <PremiumGeminiChat />

      {/* Enhanced Floating Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed left-12 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
      >
        <div className="space-y-6">
          <Link
            to="/movies"
            className="block w-14 h-14 rounded-full luxury-card-gold border-luxury flex items-center justify-center text-white hover:scale-110 transition-all glow-luxury group"
          >
            <FaFilm className="text-xl text-gradient-gold" />
            <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-sm text-white luxury-card-gold px-3 py-2 rounded-full text-gradient-gold">Explore</span>
            </div>
          </Link>
          
          <Link
            to="/search"
            className="block w-14 h-14 rounded-full luxury-card-platinum border-platinum flex items-center justify-center text-white hover:scale-110 transition-all glow-platinum group"
          >
            <FaRobot className="text-xl text-gradient-platinum" />
            <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-sm text-white luxury-card-platinum px-3 py-2 rounded-full text-gradient-platinum">AI Search</span>
            </div>
          </Link>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-14 h-14 rounded-full luxury-card border-luxury flex items-center justify-center text-white hover:scale-110 transition-all group"
          >
            <FaCrown className="text-xl text-gradient-luxury" />
            <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-sm text-white luxury-card px-3 py-2 rounded-full text-gradient-luxury">Top</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Premium Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="fixed bottom-12 left-12 z-40"
      >
        <div className="luxury-card-gold border-luxury px-4 py-3 rounded-full">
          <div className="flex items-center space-x-3 text-gray-300">
            <span className="text-sm font-medium text-gradient-gold">Premium Experience</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumHome;
