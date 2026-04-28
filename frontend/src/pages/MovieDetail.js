import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { FiStar, FiHeart, FiClock, FiCalendar, FiPlay } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/slices/movieSlice';
import { getCurrentUser } from '../store/slices/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const BACKEND_BASE_URL = API_URL.replace(/\/api$/, '');

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (movie) {
      fetchShows();
      fetchCinemas();
    }
  }, [movie, selectedDate]);

  const fetchMovie = async () => {
    try {
      console.log('🎬 Fetching movie:', id);
      const response = await fetch(`${API_URL}/movies/${id}`);
      const data = await response.json();
      console.log('✅ Movie data:', data);
      if (data.success && data.movie) {
        setMovie(data.movie);
      } else if (data.movie) {
        setMovie(data.movie);
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ Failed to fetch movie:', error);
      setLoading(false);
    }
  };

  const fetchShows = async () => {
    try {
      console.log('📅 Fetching shows for date:', selectedDate);
      const params = new URLSearchParams({
        movieId: id,
        date: selectedDate
      });
      const response = await fetch(`${API_URL}/shows?${params}`);
      const data = await response.json();
      console.log('✅ Shows data:', data);
      setShows(data.shows || data || []);
    } catch (error) {
      console.error('❌ Failed to fetch shows:', error);
      setShows([]);
    }
  };

  const fetchCinemas = async () => {
    try {
      const response = await fetch(`${API_URL}/cinemas`);
      const data = await response.json();
      setCinemas(data.cinemas || data || []);
    } catch (error) {
      console.error('❌ Failed to fetch cinemas:', error);
      setCinemas([]);
    }
  };

  const handleBookNow = (showId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('🎬 Book Now clicked for showId:', showId);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    console.log('✅ Token found, navigating to seat selection:', `/seat-selection/${showId}`);
    navigate(`/seat-selection/${showId}`);
  };

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
  const inWishlist = effectiveUser?.wishlist?.some((movieId) => String(movieId) === String(movie?._id));

  const handleWishlist = () => {
    if (!isLoggedIn) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
      return;
    }

    if (!movie?._id) return;

    const inWishlist = user?.wishlist?.some((mid) => mid === movie._id);

    dispatch(toggleWishlist(movie._id))
      .unwrap()
      .then(() => {
        dispatch(getCurrentUser());
        toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
      })
      .catch((error) => {
        toast.error(error || 'Failed to update wishlist');
      });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="shimmer h-96 rounded-xl" />
      </div>
    );
  }

  if (!movie) {
    return <div className="container mx-auto px-4 py-8">Movie not found</div>;
  }

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const bannerSrc = movie.banner?.startsWith('/uploads')
    ? `${BACKEND_BASE_URL}${movie.banner}`
    : movie.banner;

  const posterSrc = movie.poster?.startsWith('/uploads')
    ? `${BACKEND_BASE_URL}${movie.poster}`
    : movie.poster;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerSrc || posterSrc || 'https://via.placeholder.com/1200x600'})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </div>
        <div className="relative h-full container mx-auto px-4 flex items-end pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="flex items-center space-x-1">
                <FiStar className="text-yellow-400" />
                <span>{movie.rating || 'N/A'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FiClock />
                <span>{movie.duration} min</span>
              </span>
              <span>{movie.genres?.join(', ')}</span>
            </div>
            <div className="flex space-x-4">
              <button onClick={handleWishlist} className="btn-secondary flex items-center space-x-2">
                <FiHeart />
                <span>Wishlist</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Synopsis</h2>
              <p className="text-gray-700 leading-relaxed">{movie.description}</p>
            </motion.div>

            {/* Cast & Crew */}
            {movie.cast && movie.cast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card mb-8"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movie.cast.map((actor, index) => (
                    <div key={index} className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-2" />
                      <p className="font-semibold text-gray-900">{actor.name}</p>
                      <p className="text-sm text-gray-600">{actor.role}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Trailer */}
            {movie.trailerUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Trailer</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <ReactPlayer url={movie.trailerUrl} width="100%" height="100%" controls />
                </div>
              </motion.div>
            )}

            {/* Movie Trailers Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Trailers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Trailer 1 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ&controls=0&showinfo=0&rel=0"
                    title="Trailer 1"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 2 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/hYcw5zf_d-w?autoplay=1&mute=1&loop=1&playlist=hYcw5zf_d-w&controls=0&showinfo=0&rel=0"
                    title="Trailer 2"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 3 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&mute=1&loop=1&playlist=9bZkp7q19f0&controls=0&showinfo=0&rel=0"
                    title="Trailer 3"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 4 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&loop=1&playlist=ScMzIvxBSi4&controls=0&showinfo=0&rel=0"
                    title="Trailer 4"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 5 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1&mute=1&loop=1&playlist=3JZ_D3ELwOQ&controls=0&showinfo=0&rel=0"
                    title="Trailer 5"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 6 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/4q2qntJ5-uA?autoplay=1&mute=1&loop=1&playlist=4q2qntJ5-uA&controls=0&showinfo=0&rel=0"
                    title="Trailer 6"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Showtimes */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Book Tickets</h2>
              
              {/* Date Selection */}
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-900">Select Date</label>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {dates.map((date) => {
                    const dateObj = new Date(date);
                    const isSelected = date === selectedDate;
                    return (
                      <button
                        key={date}
                        onClick={() => {
                          console.log('📅 Date selected:', date);
                          setSelectedDate(date);
                        }}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <div className="text-xs">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="font-semibold">{dateObj.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shows Display */}
              {shows.length > 0 ? (
                <div className="space-y-4">
                  {cinemas.length > 0 ? (
                    cinemas.map((cinema) => {
                      const cinemaShows = shows.filter(s => {
                        const cinemaId = s.cinemaId?._id || s.cinemaId;
                        const cinemaIdStr = cinema._id?.toString() || cinema._id;
                        return cinemaId?.toString() === cinemaIdStr;
                      });
                      if (cinemaShows.length === 0) return null;

                      return (
                        <div key={cinema._id} className="mb-6">
                          <h3 className="font-bold mb-2 text-gray-900">{cinema.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            {cinemaShows.map((show) => (
                              <button
                                key={show._id}
                                type="button"
                                onClick={(e) => handleBookNow(show._id, e)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer active:bg-blue-800"
                              >
                                {show.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="mb-6">
                      <h3 className="font-bold mb-2">Available Shows</h3>
                      <div className="flex flex-wrap gap-2">
                        {shows.map((show) => (
                          <button
                            key={show._id}
                            type="button"
                            onClick={(e) => handleBookNow(show._id, e)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer active:bg-blue-800"
                          >
                            {show.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  No shows available for selected date
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
