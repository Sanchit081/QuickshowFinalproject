import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFire, FaStar, FaRobot, FaGem, FaFilm } from 'react-icons/fa';
import axios from 'axios';
import HeroSection from '../components/Home/HeroSection';
import MovieSection from '../components/Home/MovieSection';
import GeminiChat from '../components/AI/GeminiChat';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [aiPicks, setAiPicks] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
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

      setMovies(moviesResponse.data.movies || moviesResponse.data);
      setTrendingMovies(trendingResponse.data.movies || []);
      setTopRatedMovies(topRatedResponse.data.movies || []);
      setAiPicks(aiPicksResponse.data.picks || []);
      setHiddenGems(hiddenGemsResponse.data.movies || []);

    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('Failed to load home data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="h-screen loading-skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchHomeData}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const nowShowing = movies.filter(m => m.isNowShowing);
  const comingSoon = movies.filter(m => m.isComingSoon);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
      {/* Hero Section */}
      <HeroSection movies={nowShowing} />

      {/* Trending Now */}
      <MovieSection
        title="Trending Now"
        movies={trendingMovies.length > 0 ? trendingMovies : nowShowing.slice(0, 5)}
        icon={FaFire}
        gradient="bg-gradient-to-r from-orange-500 to-red-500"
      />

      {/* AI Picks */}
      <MovieSection
        title="AI Picks"
        movies={aiPicks.length > 0 ? aiPicks : nowShowing.slice(0, 5)}
        icon={FaRobot}
        gradient="bg-gradient-to-r from-purple-500 to-blue-500"
        showAI={true}
      />

      {/* Top Rated */}
      <MovieSection
        title="Top Rated"
        movies={topRatedMovies.length > 0 ? topRatedMovies : nowShowing.slice(0, 5)}
        icon={FaStar}
        gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
      />

      {/* Now Showing */}
      <MovieSection
        title="Now Showing"
        movies={nowShowing}
        icon={FaFilm}
        gradient="bg-gradient-to-r from-green-500 to-teal-500"
      />

      {/* Hidden Gems */}
      <MovieSection
        title="Hidden Gems"
        movies={hiddenGems.length > 0 ? hiddenGems : nowShowing.slice(0, 5)}
        icon={FaGem}
        gradient="bg-gradient-to-r from-pink-500 to-purple-500"
        showAI={true}
      />

      {/* Coming Soon */}
      <MovieSection
        title="Coming Soon"
        movies={comingSoon}
        icon={FaCalendar}
        gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
      />

      {/* AI Chat Assistant */}
      <GeminiChat />

      {/* Floating CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
      >
        <div className="space-y-4">
          <Link
            to="/movies"
            className="block w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:scale-110 transition-transform group"
          >
            <FaFilm className="text-lg" />
            <div className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-xs text-white glass-card px-2 py-1 rounded">Explore</span>
            </div>
          </Link>
          
          <button
            onClick={() => window.location.hash = '#ai-search'}
            className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:scale-110 transition-transform group"
          >
            <FaRobot className="text-lg" />
            <div className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-xs text-white glass-card px-2 py-1 rounded">AI Search</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Home;
