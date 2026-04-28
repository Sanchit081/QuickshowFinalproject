import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiPlay, FiCalendar } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist } from '../store/slices/movieSlice';
import { getCurrentUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const MovieCard = ({ movie, variant = 'default' }) => {
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

  const inWishlist = wishlistIds.includes(String(movie.id || movie._id));
  const [localInWishlist, setLocalInWishlist] = useState(inWishlist);

  useEffect(() => {
    setLocalInWishlist(inWishlist);
  }, [inWishlist]);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to add to wishlist');
      return;
    }
    // Optimistic UI update so heart turns red immediately
    setLocalInWishlist((prev) => !prev);
    const movieId = movie.id || movie._id;
    dispatch(toggleWishlist(movieId))
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

  const posterSrc = movie.poster || `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const rating = movie.rating || movie.vote_average || 'N/A';
  const title = movie.title;
  const releaseDate = movie.releaseDate || movie.release_date;

  // Card variants
  const cardStyles = {
    default: 'w-48 h-72',
    large: 'w-64 h-96',
    trending: 'w-56 h-80'
  };

  const currentStyle = cardStyles[variant] || cardStyles.default;

  return (
    <Link to={`/movies/${movie.id || movie._id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`card overflow-hidden group cursor-pointer ${currentStyle}`}
      >
        <div className="relative h-full">
          {/* Movie Poster */}
          <img
            src={posterSrc || 'https://via.placeholder.com/300x450'}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full glass transition-colors ${
              localInWishlist ? 'text-red-500' : 'text-white'
            }`}
          >
            <FiHeart fill={localInWishlist ? 'currentColor' : 'none'} />
          </button>
          
          {/* Coming Soon Badge */}
          {movie.isComingSoon && (
            <div className="absolute top-2 left-2 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
              Coming Soon
            </div>
          )}

          {/* Hover Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="space-y-2">
              {/* Title */}
              <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
                {title}
              </h3>
              
              {/* Rating and Date */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <FiStar className="text-yellow-500" />
                  <span className="text-white font-medium">{rating}</span>
                </div>
                {releaseDate && (
                  <div className="flex items-center space-x-1 text-white/80">
                    <FiCalendar className="text-xs" />
                    <span className="text-xs">
                      {new Date(releaseDate).getFullYear()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Play Button */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <FiPlay className="text-black ml-0.5 text-xs" />
                </div>
                <span className="text-white text-sm font-medium">Watch Now</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Footer (always visible) */}
        <div className="p-4 bg-white">
          <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900">{title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <FiStar className="text-yellow-500" />
              <span className="text-gray-900">{rating}</span>
            </span>
            <span className="text-gray-900">
              {movie.genres?.[0] || movie.genre || 'Movie'}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default memo(MovieCard);
