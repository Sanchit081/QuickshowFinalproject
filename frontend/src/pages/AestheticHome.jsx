import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFire, FaStar, FaRobot, FaGem, FaFilm, FaTicketAlt } from 'react-icons/fa';
import axios from 'axios';
import AestheticHero from '../components/Home/AestheticHero';
import AestheticMovieSection from '../components/Home/AestheticMovieSection';
import AestheticGeminiChat from '../components/AI/AestheticGeminiChat';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const AestheticHome = () => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [aiPicks, setAiPicks] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAestheticHomeData();
  }, []);

  const fetchAestheticHomeData = async () => {
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

    } catch (err) {
      console.error('Error fetching aesthetic home data:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-texture-pattern" />
        <div className="h-screen loading-textured textured-card-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="textured-card-accent p-8 rounded-3xl">
            <h2 className="text-3xl font-bold text-accent mb-4">Something went wrong</h2>
            <p className="text-secondary mb-6">{error}</p>
            <button 
              onClick={fetchAestheticHomeData}
              className="btn-textured-primary"
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
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-pink-50 relative">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-textured" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse-textured" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/10 via-transparent to-pink-100/10" />
        <div className="absolute inset-0 bg-texture-pattern opacity-20" />
      </div>

      {/* Aesthetic Hero */}
      <AestheticHero movies={nowShowing} />

      {/* Trending Now */}
      <AestheticMovieSection
        title="Trending Now"
        movies={trendingMovies.length > 0 ? trendingMovies : nowShowing.slice(0, 10)}
        icon={FaFire}
        gradient="bg-gradient-to-r from-red-500 to-pink-500"
        variant="accent"
      />

      {/* AI Picks */}
      <AestheticMovieSection
        title="AI Curated"
        movies={aiPicks.length > 0 ? aiPicks : nowShowing.slice(0, 8)}
        icon={FaRobot}
        gradient="bg-gradient-to-r from-purple-500 to-blue-500"
        variant="subtle"
        showAI={true}
      />

      {/* Top Rated */}
      <AestheticMovieSection
        title="Critically Acclaimed"
        movies={topRatedMovies.length > 0 ? topRatedMovies : nowShowing.slice(0, 10)}
        icon={FaStar}
        gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
        variant="default"
      />

      {/* Now Showing */}
      <AestheticMovieSection
        title="Now Showing"
        movies={nowShowing}
        icon={FaFilm}
        gradient="bg-gradient-to-r from-green-500 to-teal-500"
        variant="subtle"
      />

      {/* Hidden Gems */}
      <AestheticMovieSection
        title="Hidden Gems"
        movies={hiddenGems.length > 0 ? hiddenGems : nowShowing.slice(0, 8)}
        icon={FaGem}
        gradient="bg-gradient-to-r from-pink-500 to-purple-500"
        variant="accent"
        showAI={true}
      />

      {/* Coming Soon */}
      <AestheticMovieSection
        title="Coming Soon"
        movies={comingSoon}
        icon={FaTicketAlt}
        gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
        variant="default"
      />

      {/* Aesthetic AI Chat Assistant */}
      <AestheticGeminiChat />

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
            className="block w-14 h-14 rounded-full textured-card-accent border-accent flex items-center justify-center text-primary hover:scale-110 transition-all group"
          >
            <FaFilm className="text-xl text-accent" />
            <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-sm text-primary textured-card px-3 py-2 rounded-full text-accent">Explore</span>
            </div>
          </Link>
          
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-14 h-14 rounded-full textured-card border-accent flex items-center justify-center text-primary hover:scale-110 transition-all group"
          >
            <FaStar className="text-xl text-accent" />
            <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-sm text-primary textured-card px-3 py-2 rounded-full text-accent">Top</span>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AestheticHome;
