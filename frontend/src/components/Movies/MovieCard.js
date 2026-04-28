import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiHeart } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist } from '../../store/slices/movieSlice';
import { getCurrentUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { buildMediaUrl } from '../../config/api';
import { normalizeGenres } from '../../utils/movie';

const MovieCard = ({ movie }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fallback to localStorage user if Redux user is not yet populated
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
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isLoggedIn = isAuthenticated || !!token;

	  // Wishlist may be an array of IDs or populated movie objects; normalize to ID strings
	  const wishlistIds = Array.isArray(effectiveUser?.wishlist)
	    ? effectiveUser.wishlist.map((entry) =>
	        typeof entry === 'string' || typeof entry === 'number'
	          ? String(entry)
	          : entry && entry._id
	            ? String(entry._id)
	            : null
	      ).filter(Boolean)
	    : [];

	  const inWishlist = wishlistIds.includes(String(movie._id));

	  const [localInWishlist, setLocalInWishlist] = useState(inWishlist);

	  useEffect(() => {
	    setLocalInWishlist(inWishlist);
	  }, [inWishlist]);

  const posterSrc = buildMediaUrl(movie.poster);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to add to wishlist');
      return;
    }
	    // Optimistic UI update so heart turns red immediately
	    setLocalInWishlist((prev) => !prev);
    dispatch(toggleWishlist(movie._id))
      .unwrap()
      .then(() => {
        // Refresh current user so wishlist state (user.wishlist) stays updated
        dispatch(getCurrentUser());
        const nowInWishlist = !inWishlist;
        toast.success(nowInWishlist ? 'Added to wishlist' : 'Removed from wishlist');
      })
      .catch((error) => {
	        // Revert optimistic update on error
	        setLocalInWishlist(inWishlist);
        toast.error(error || 'Failed to update wishlist');
      });
  };

  return (
    <Link to={`/movies/${movie._id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="card overflow-hidden group cursor-pointer"
      >
        <div className="relative">
          <img
            src={posterSrc || 'https://via.placeholder.com/300x450'}
            alt={movie.title}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full glass ${
              localInWishlist ? 'text-red-500' : 'text-gray-800'
            } transition-colors`}
          >
            <FiHeart fill={localInWishlist ? 'currentColor' : 'none'} />
          </button>
          {movie.isComingSoon && (
            <div className="absolute top-2 left-2 px-3 py-1 bg-purple-600 text-gray-800 rounded-full text-sm font-semibold">
              Coming Soon
            </div>
          )}
        </div>
        <div className="p-4 bg-white">
          <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900">{movie.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <FiStar className="text-yellow-500" />
              <span className="text-gray-900">{movie.rating || 'N/A'}</span>
            </span>
            <span className="text-gray-900">{normalizeGenres(movie.genres)?.[0] || 'Movie'}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;


