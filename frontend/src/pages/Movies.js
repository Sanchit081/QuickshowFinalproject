import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchMovies, setFilters } from '../store/slices/movieSlice';
import MovieCard from '../components/Movies/MovieCard';
import { FiFilter } from 'react-icons/fi';

const genres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Adventure'];
const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali'];

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, loading, filters } = useSelector((state) => state.movies);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const genre = searchParams.get('genre') || '';
    const language = searchParams.get('language') || '';
    const search = searchParams.get('search') || '';
    const nowShowing = searchParams.get('nowShowing') === 'true';
    const comingSoon = searchParams.get('comingSoon') === 'true';

    dispatch(setFilters({ genre, language, search, nowShowing, comingSoon }));
    dispatch(fetchMovies({ genre, language, search, nowShowing: nowShowing ? 'true' : undefined, comingSoon: comingSoon ? 'true' : undefined }));
  }, [dispatch, searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-gray-900"
        >
          Movies
        </motion.h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg glass hover:bg-white/20 transition-colors"
        >
          <FiFilter />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Filter Movies</h3>
            <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700">
              Clear All
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-900">Genre</label>
              <select
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="input-field"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-900">Language</label>
              <select
                value={filters.language || ''}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="input-field"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-900">Status</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.nowShowing}
                    onChange={(e) => handleFilterChange('nowShowing', e.target.checked)}
                    className="rounded"
                  />
                  <span>Now Showing</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.comingSoon}
                    onChange={(e) => handleFilterChange('comingSoon', e.target.checked)}
                    className="rounded"
                  />
                  <span>Coming Soon</span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="shimmer h-64 rounded-xl" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie, index) => (
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No movies found</p>
        </div>
      )}
    </div>
  );
};

export default Movies;

