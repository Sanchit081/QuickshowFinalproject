import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiCalendar, FiStar, FiFilm, FiChevronDown } from 'react-icons/fi';
import { searchMovies } from '../services/tmdbService';
import { Link } from 'react-router-dom';

const EnhancedMovieSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Filters
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState('');
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // TMDb Genres
  const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ];

  // Generate year options (current year back to 1950)
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const yearOptions = [];
    for (let i = currentYear; i >= 1950; i--) {
      yearOptions.push(i);
    }
    return yearOptions;
  }, [currentYear]);

  // Rating options
  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '7', label: '7+ Stars' },
    { value: '8', label: '8+ Stars' },
    { value: '9', label: '9+ Stars' },
  ];

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, year, genre, minRating]);

  const performSearch = async () => {
    if (query.length < 2) return;
    
    console.log('EnhancedMovieSearch: Starting search for:', query);
    console.log('EnhancedMovieSearch: Filters:', { year, genre, minRating });
    
    setLoading(true);
    try {
      const searchParams = {};
      if (year) searchParams.year = year;
      if (genre) searchParams.genre = genre;
      if (minRating) searchParams.minRating = minRating;

      console.log('EnhancedMovieSearch: Calling searchMovies API...');
      const data = await searchMovies(query, 1);
      console.log('EnhancedMovieSearch: API response:', data);
      
      let filteredResults = data.results || [];
      console.log('EnhancedMovieSearch: Initial results count:', filteredResults.length);

      // Apply client-side filters
      if (year) {
        filteredResults = filteredResults.filter(movie => {
          const releaseYear = new Date(movie.release_date).getFullYear();
          return releaseYear === parseInt(year);
        });
        console.log('EnhancedMovieSearch: After year filter:', filteredResults.length);
      }

      if (minRating) {
        filteredResults = filteredResults.filter(movie => 
          movie.vote_average >= parseFloat(minRating)
        );
        console.log('EnhancedMovieSearch: After rating filter:', filteredResults.length);
      }

      console.log('EnhancedMovieSearch: Final results:', filteredResults);
      setResults(filteredResults.slice(0, 8)); // Limit to 8 results
      setShowSuggestions(true);
    } catch (error) {
      console.error('EnhancedMovieSearch: Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowSuggestions(false);
    setQuery(movie.title);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowSuggestions(false);
    setSelectedMovie(null);
    setYear('');
    setGenre('');
    setMinRating('');
  };

  const hasActiveFilters = year || genre || minRating;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Discover Movies</h2>
        <p className="text-gray-400">Search thousands of movies with smart filters</p>
      </div>

      {/* Main Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="flex gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                placeholder="Search movies, actors, genres..."
                className="w-full pl-12 pr-12 py-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
                >
                  {loading ? (
                    <div className="p-4 text-center text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="p-2">
                      <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                        {results.length} movies found
                      </div>
                      {results.map((movie) => (
                        <Link
                          key={movie.id}
                          to={`/movies/${movie.id}`}
                          onClick={() => handleMovieClick(movie)}
                          className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <FiFilm className="text-white/60" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">{movie.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                              <span>{new Date(movie.release_date).getFullYear()}</span>
                              <span className="flex items-center gap-1">
                                <FiStar className="text-yellow-500" />
                                {movie.vote_average.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      <FiFilm className="text-2xl mx-auto mb-2 opacity-50" />
                      <p>No movies found</p>
                      <p className="text-xs mt-1">Try different keywords</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-4 rounded-xl border transition-all ${
              hasActiveFilters
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
            }`}
          >
            <FiFilter className="text-xl" />
          </button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {year && (
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm flex items-center gap-1">
                <FiCalendar className="text-xs" />
                {year}
                <button onClick={() => setYear('')} className="ml-1 hover:text-blue-300">
                  <FiX className="text-xs" />
                </button>
              </span>
            )}
            {genre && (
              <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
                {genres.find(g => g.id === parseInt(genre))?.name || genre}
                <button onClick={() => setGenre('')} className="ml-1 hover:text-purple-300">
                  <FiX className="text-xs" />
                </button>
              </span>
            )}
            {minRating && (
              <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm flex items-center gap-1">
                <FiStar className="text-xs" />
                {minRating}+ Stars
                <button onClick={() => setMinRating('')} className="ml-1 hover:text-yellow-300">
                  <FiX className="text-xs" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 bg-gray-900/50 border border-gray-800 rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <FiCalendar className="inline mr-1" />
                  Release Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Any Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <FiFilm className="inline mr-1" />
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Any Genre</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <FiStar className="inline mr-1" />
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {ratingOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Tips */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Try searching for "action", "comedy", or specific movie titles like "Inception"
        </p>
      </div>
    </div>
  );
};

export default EnhancedMovieSearch;
