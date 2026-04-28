import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaSearch, FaBrain } from 'react-icons/fa';

const AISearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setShowResults(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ai/enhanced-search`,
        { query }
      );

      setResults(response.data.results);
    } catch (error) {
      console.error('AI Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
    setShowResults(false);
    setQuery('');
  };

  const exampleQueries = [
    "action movies with Tom Cruise",
    "comedy movies for family",
    "horror movies released recently",
    "movies in Hindi",
    "romantic movies this weekend"
  ];

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: 'action movies with Tom Cruise' or 'comedy movies for family'"
            className="w-full px-12 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all"
          />
          
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            <FaBrain className="text-sm" />
            <span>AI Search</span>
          </button>
        </div>
      </form>

      {/* Example Queries */}
      {!query && !showResults && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-[60] max-h-96 overflow-y-auto"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                AI Search Results
              </h3>
              <button
                onClick={() => setShowResults(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="w-12 h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {results.map((movie) => (
                  <motion.div
                    key={movie._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleMovieClick(movie._id)}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {movie.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {movie.description}
                      </p>
                      
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500 text-xs">⭐</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {movie.rating}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.slice(0, 2).map(genre => (
                            <span
                              key={genre}
                              className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No movies found for "{query}"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Try different keywords or browse our movie collection
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AISearch;
