import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMovies } from '../store/slices/movieSlice';
import { getCurrentUser } from '../store/slices/authSlice';
import MovieCard from '../components/Movies/MovieCard';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { movies, loading } = useSelector((state) => state.movies);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fallback to localStorage user like Navbar
  const storedUser = !user && typeof window !== 'undefined'
    ? (() => {
        try {
          const raw = localStorage.getItem('user');
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      })()
    : user;

  const effectiveUser = user || storedUser;

	  // Wishlist may contain IDs or populated movie documents; normalize to ID strings
	  const wishlistIds = Array.isArray(effectiveUser?.wishlist)
	    ? effectiveUser.wishlist.map((entry) =>
	        typeof entry === 'string' || typeof entry === 'number'
	          ? String(entry)
	          : entry && entry._id
	            ? String(entry._id)
	            : null
	      ).filter(Boolean)
	    : [];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token && !isAuthenticated) {
        navigate('/login');
        return;
      }

      // Always refresh current user when we have a token so wishlist stays in sync
      if (token) {
        dispatch(getCurrentUser());
      }
    }
    // Ensure we have movies loaded to filter
    if (!movies || movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, isAuthenticated, movies, navigate]);

  const wishlistIdSet = new Set(wishlistIds.map((id) => String(id)));
  const wishlistMovies = (movies || []).filter((m) => wishlistIdSet.has(String(m._id)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
      </div>

      {loading && movies.length === 0 && wishlistIds.length > 0 ? (
        <div className="shimmer h-64 rounded-xl" />
      ) : wishlistMovies.length === 0 ? (
        <div className="card text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No movies in wishlist</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start exploring movies and tap the heart icon to add them here.
          </p>
          <button
            onClick={() => navigate('/movies')}
            className="btn-primary inline-flex items-center justify-center"
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
