import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaStar, FaClock, FaCalendar, FaHeart, FaShare } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';
import { buildMediaUrl } from '../../config/api';
import { normalizeGenres, normalizePoster, normalizeBanner } from '../../utils/movie';

const AppleMovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Check if we're on the booking route
  const isBookingRoute = location.pathname.includes('/booking');

  // Auto-scroll to booking section if on booking route
  useEffect(() => {
    if (isBookingRoute && movie) {
      // Wait a bit for the component to render
      setTimeout(() => {
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [isBookingRoute, movie]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        const movieResponse = await axios.get(`/movies/${id}`);
        const movieData = movieResponse.data.movie;
        setMovie(movieData);

        const [summaryResponse, relatedResponse, showsResponse] = await Promise.all([
          axios.post('/gemini/movie-summary', { movieId: id }).catch(() => ({ data: {} })),
          axios.get('/movies', { params: { genre: movieData?.genres?.[0], nowShowing: true } }),
          axios.get('/shows', { params: { movieId: id, date: selectedDate } })
        ]);

        setAiSummary(summaryResponse.data.summary || movieData.description);
        setRelatedMovies((relatedResponse.data.movies || []).filter((item) => item._id !== id).slice(0, 6));
        setShows(showsResponse.data.shows || []);
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, selectedDate]);

  const nextShow = useMemo(() => shows[0] || null, [shows]);
  const genres = useMemo(() => normalizeGenres(movie?.genres), [movie?.genres]);
  const displayShows = useMemo(() => {
    const sorted = [...shows].sort((a, b) => {
      const byTime = String(a.time || '').localeCompare(String(b.time || ''));
      if (byTime !== 0) return byTime;
      return String(a.cinemaId?.name || '').localeCompare(String(b.cinemaId?.name || ''));
    });
    return sorted.slice(0, 7);
  }, [shows]);

  const handleWatchNow = () => {
    if (!nextShow?._id) {
      toast.error('No shows available right now for this movie');
      return;
    }

    navigate(`/seat-selection/${nextShow._id}`);
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const handleShare = async () => {
    if (!movie) return;

    if (navigator.share) {
      await navigator.share({
        title: movie.title,
        text: `Check out ${movie.title} on QuickShow`,
        url: window.location.href
      });
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    toast.success('Movie link copied');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-10">
          <div className="shimmer h-10 w-72 rounded-xl mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="shimmer h-[520px] rounded-2xl" />
            <div className="lg:col-span-2 space-y-4">
              <div className="shimmer h-8 rounded-xl w-2/3" />
              <div className="shimmer h-5 rounded-xl w-1/2" />
              <div className="shimmer h-40 rounded-2xl" />
              <div className="shimmer h-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <h2 className="text-2xl font-bold text-black">{error || 'Movie Not Found'}</h2>
          <button
            onClick={() => navigate('/movies')}
            className="apple-button apple-button-primary mt-4"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${normalizeBanner(movie.banner, movie.poster)})` }}
          />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/88 to-white" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,9,20,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(15,23,42,0.08),transparent_40%)]" />
        </div>

        <div className="relative container mx-auto px-6 py-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="apple-card p-3">
                <img
                  src={normalizePoster(movie.poster)}
                  alt={movie.title}
                  className="w-full rounded-2xl shadow-apple-lg"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="space-y-3">
                <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {genres.slice(0, 4).map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-800 border border-gray-200"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold text-gray-900">{movie.rating || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span>{movie.duration ? `${movie.duration} min` : '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-gray-500" />
                    <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '—'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleWatchNow}
                  className="apple-button apple-button-primary"
                  disabled={!nextShow}
                >
                  <FaPlay className="mr-2" />
                  {nextShow ? 'Book tickets' : 'No shows yet'}
                </button>
                <button onClick={handleBookmark} className="apple-button">
                  <FaHeart className={`mr-2 ${isBookmarked ? 'text-red-600' : 'text-gray-500'}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </button>
                <button onClick={handleShare} className="apple-button">
                  <FaShare className="mr-2 text-gray-500" />
                  Share
                </button>
              </div>

              <div className="apple-card p-6">
                <h2 className="text-lg font-semibold text-black mb-2">About</h2>
                <p className="text-gray-800 leading-relaxed">{movie.description}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="apple-card p-6">
                <h2 className="text-lg font-semibold text-black mb-2">AI Summary</h2>
                <p className="text-gray-800 leading-relaxed">{aiSummary}</p>
              </div>

              <div id="booking-section" className="apple-card p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-black">Showtimes</h2>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="apple-input !w-auto text-sm"
                  />
                </div>

                {!!displayShows.length ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayShows.map((showItem) => (
                      <button
                        key={showItem._id}
                        type="button"
                        onClick={() => navigate(`/seat-selection/${showItem._id}`)}
                        className="apple-card-glass p-4 text-left hover:shadow-apple-md transition-all"
                      >
                        <div className="text-sm text-gray-600 truncate">{showItem.cinemaId?.name}</div>
                        <div className="text-xl font-bold text-black mt-1">{showItem.time}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {showItem.availableSeats ?? 0} seats available
                        </div>
                        <div className="text-sm text-red-700 font-semibold mt-2">Select seats</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-700">
                    No showtimes available for today. Try again later.
                  </div>
                )}
                {shows.length > displayShows.length && (
                  <div className="text-xs text-gray-600 mt-3">
                    Showing {displayShows.length} of {shows.length} shows for a cleaner view.
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="apple-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Fast checkout</div>
                    <div className="text-lg font-semibold text-black mt-1">
                      {nextShow ? `Next show: ${nextShow.time}` : 'No shows today'}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {nextShow?.cinemaId?.name || ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleWatchNow}
                    disabled={!nextShow}
                    className="apple-button apple-button-primary"
                  >
                    Book
                  </button>
                </div>
              </div>

              {!!relatedMovies.length && (
                <div className="apple-card p-6">
                  <h2 className="text-lg font-semibold text-black mb-4">Recommended</h2>
                  <div className="space-y-3">
                    {relatedMovies.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => navigate(`/movies/${item._id}`)}
                        className="w-full flex items-center gap-3 text-left rounded-2xl p-2 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={buildMediaUrl(item.poster)}
                          alt={item.title}
                          className="w-14 h-20 object-cover rounded-xl border border-gray-200"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-black truncate">{item.title}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {normalizeGenres(item.genres).slice(0, 2).join(' • ') || '—'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppleMovieDetail;
