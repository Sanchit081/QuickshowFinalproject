import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/Movies/MovieCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const dispatch = useDispatch();
  const { movies, loading } = useSelector((state) => state.movies);

  useEffect(() => {
    if (query) {
      dispatch(fetchMovies({ search: query }));
    }
  }, [dispatch, query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Search Results for "{query}"
      </motion.h1>

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
          <p className="text-xl text-gray-600 dark:text-gray-400">No results found</p>
        </div>
      )}
    </div>
  );
};

export default Search;

