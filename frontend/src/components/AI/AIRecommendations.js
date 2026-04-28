import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';
import { buildMediaUrl } from '../../config/api';

const AIRecommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const effectiveUserId = userId || user?._id || user?.id;
      if (!effectiveUserId) {
        setRecommendations([]);
        return;
      }

      const response = await axios.get(`/ai/recommendations/${effectiveUserId}`);
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-4">
                <div className="h-24 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          AI Recommendations
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No recommendations available. Watch some movies to get personalized suggestions!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          🤖 AI Recommendations for You
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Based on your preferences
        </span>
      </div>
      
      <div className="grid gap-4">
        {recommendations.map((movie, index) => (
          <motion.div
            key={movie._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => window.location.href = `/movies/${movie._id}`}
          >
            <img
              src={buildMediaUrl(movie.poster)}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded-lg shadow-md"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {movie.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {movie.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {movie.rating}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {(movie.genres || []).slice(0, 2).map(genre => (
                        <span
                          key={genre}
                          className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    {Math.round(movie.aiScore * 100)}% Match
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    AI Score
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button
        onClick={fetchRecommendations}
        className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Recommendations
      </button>
    </div>
  );
};

export default AIRecommendations;
