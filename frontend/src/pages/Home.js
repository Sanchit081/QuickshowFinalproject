import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiClock, FiStar, FiCalendar, FiMapPin } from 'react-icons/fi';
import MovieCard from '../components/Movies/MovieCard';
import HeroSlider from '../components/Home/HeroSlider';
// import AIRecommendations from '../components/AI/AIRecommendations';
// import AISearch from '../components/AI/AISearch';
// import AIChatbot from '../components/AI/AIChatbot';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const BACKEND_BASE_URL = API_URL.replace(/\/api$/, '');

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    console.log('🔍 Environment check:', {
      API_URL,
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL
    });

    // Simple connectivity test
    fetch(`${API_URL}/health`)
      .then(response => {
        console.log('✅ Health check response:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('✅ Health check data:', data);
      })
      .catch(err => {
        console.error('❌ Health check failed:', err);
      });

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Fetching movies from:', `${API_URL}/movies`);
        
        const response = await fetch(`${API_URL}/movies`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ API Response:', data);
        
        if (data && data.movies && Array.isArray(data.movies)) {
          setMovies(data.movies);
          console.log('✅ Movies set successfully:', data.movies.length);
        } else if (Array.isArray(data)) {
          setMovies(data);
          console.log('✅ Movies set from array:', data.length);
        } else {
          console.error('❌ Unexpected response format:', data);
          setError('Unexpected response format');
        }
      } catch (err) {
        console.error('❌ Error fetching movies:', err);
        console.error('❌ Full error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name,
          type: err.type
        });
        setError(`Failed to fetch movies: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const response = await fetch(`${API_URL}/events`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data && Array.isArray(data.events)) {
          setEvents(data.events);
        } else if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        console.error('❌ Error fetching events:', err);
        console.error('❌ Full error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name,
          type: err.type
        });
      } finally {
        setEventsLoading(false);
      }
    };

    fetchMovies();
    fetchEvents();
  }, []);

  const nowShowing = Array.isArray(movies) ? movies.filter(m => m.isNowShowing) : [];
  const comingSoon = Array.isArray(movies) ? movies.filter(m => m.isComingSoon) : [];

  const premieresFromApi = Array.isArray(movies)
    ? movies.filter((m) => m.isPremiere || m.tags?.includes('Premiere'))
    : [];

  const samplePremieres = [
    {
      title: 'Dune: Part Two',
      poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
      rating: 8.6,
      genres: ['Sci-Fi', 'Adventure'],
      language: 'English',
      certification: 'UA',
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    },
    {
      title: 'Stranger Things',
      poster: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
      rating: 8.7,
      genres: ['Sci-Fi', 'Horror'],
      language: 'English',
      certification: 'UA',
      trailerUrl: 'https://www.youtube.com/embed/b9EkMc79ZSU',
    },
    {
      title: 'Loki',
      poster: 'https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
      rating: 8.2,
      genres: ['Action', 'Fantasy'],
      language: 'English',
      certification: 'UA',
      trailerUrl: 'https://www.youtube.com/embed/nW948Va-l10',
    },
    {
      title: 'Money Heist',
      poster: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
      rating: 8.3,
      genres: ['Crime', 'Thriller'],
      language: 'Spanish',
      certification: 'UA',
      trailerUrl: 'https://www.youtube.com/embed/_InqQJRqGW4',
    },
  ];

  const premieres = premieresFromApi.length > 0 ? premieresFromApi.slice(0, 8) : samplePremieres;

  console.log('🏠 Home render:', {
    totalMovies: movies.length,
    nowShowing: nowShowing.length,
    comingSoon: comingSoon.length,
    loading,
    error
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Slider */}
      <HeroSlider movies={movies} loading={loading} />

      {/* Now Showing */}
      <motion.section
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold"
          >
            Now Showing
          </motion.h2>
          <Link to="/movies" className="text-blue-600 hover:text-blue-700 font-semibold">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="shimmer h-64 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4 text-xl font-bold">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Check browser console (F12) for details</p>
            <p className="text-sm text-gray-500 mb-4">Make sure backend is running: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">cd backend && PORT=5001 node server.js</code></p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Reload Page
            </button>
          </div>
        ) : nowShowing.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-xl">No movies available</p>
            <p className="text-sm text-gray-500 mb-4">Total movies fetched: {movies.length}</p>
            <p className="text-sm text-gray-500 mb-4">Now showing filter: {nowShowing.length}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {nowShowing.slice(0, 10).map((movie, index) => (
              <motion.div
                key={movie._id || `movie-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Premieres */}
      <motion.section
        className="container mx-auto px-4 py-4 md:py-8 lg:py-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold flex items-center gap-2"
          >
            <span>Premieres</span>
            <span className="text-xs md:text-sm px-2 py-1 rounded-full bg-purple-600 text-white uppercase tracking-wide">New</span>
          </motion.h2>
          <Link to="/movies" className="text-blue-600 hover:text-blue-700 font-semibold">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {premieres.map((movie, index) => (
            <motion.div
              key={movie._id || `premiere-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.07 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg shadow-slate-900/40 border border-white/60 dark:border-slate-800 group hover:-translate-y-1 hover:shadow-xl transition-transform duration-300 cursor-pointer"
              onClick={() => {
                if (movie.trailerUrl) {
                  setActiveTrailer(movie.trailerUrl);
                }
              }}
            >
              <div className="relative aspect-[2/3] w-full">
                <img
                  src={
                    movie.poster?.startsWith('/uploads')
                      ? `${BACKEND_BASE_URL}${movie.poster}`
                      : movie.poster || movie.banner || 'https://via.placeholder.com/300x450'
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/70 text-[10px] md:text-xs font-semibold text-white uppercase tracking-wide">
                  Premiere
                </div>
              </div>
              <div className="px-3 py-3 space-y-1">
                <h3 className="text-sm md:text-base font-semibold line-clamp-1 text-gray-900 dark:text-gray-100">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] md:text-xs text-gray-600 dark:text-gray-400">
                  <span>{movie.language || 'Language'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-[10px] md:text-[11px] font-medium">
                    {movie.certification || 'UA'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] md:text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span>{movie.rating || 'N/A'}</span>
                  </span>
                  <span className="line-clamp-1">{Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genre}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Coming Soon */}
      {comingSoon.length > 0 && (
        <motion.section
          className="container mx-auto px-4 py-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold"
            >
              Coming Soon
            </motion.h2>
            <Link to="/movies?comingSoon=true" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {comingSoon.slice(0, 10).map((movie, index) => (
              <motion.div
                key={movie._id || `coming-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Featured Events by City */}
      <motion.section
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold"
          >
            Featured Events
          </motion.h2>
          <Link to="/events" className="text-blue-600 hover:text-blue-700 font-semibold">
            View All Events →
          </Link>
        </div>

        {eventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="shimmer h-56 rounded-xl" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No events available right now.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(
              events.reduce((acc, ev) => {
                const city = ev.venue?.city || 'Other Cities';
                if (!acc[city]) acc[city] = [];
                if (acc[city].length < 3) {
                  acc[city].push(ev);
                }
                return acc;
              }, {})
            ).map(([city, cityEvents]) => (
              <div key={city}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{city}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {cityEvents.map((event) => (
                    <Link key={event._id} to={`/events/${event._id}`}>
                      <div className="card group overflow-hidden h-full flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/40 dark:border-slate-800 shadow-lg shadow-slate-900/40 transition-transform duration-300 hover:-translate-y-1">
                        <div className="relative h-40">
                          <img
                            src={event.image || event.banner || 'https://via.placeholder.com/400x250'}
                            alt={event.title}
                            className="w-full h-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                            {event.category}
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h4 className="font-bold mb-2 line-clamp-1">{event.title}</h4>
                          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 flex-1">
                            <div className="flex items-center space-x-1">
                              <FiCalendar />
                              <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiMapPin />
                              <span className="line-clamp-1">{event.venue?.name}</span>
                            </div>
                          </div>
                          <div className="mt-3 text-sm font-semibold text-purple-600 dark:text-purple-400">
                            From ₹{event.price?.min}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card text-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/40 dark:border-slate-800 shadow-lg shadow-slate-900/40"
          >
            <FiPlay className="mx-auto text-4xl text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-gray-600 dark:text-gray-400">Book your tickets in just a few clicks</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card text-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/40 dark:border-slate-800 shadow-lg shadow-slate-900/40"
          >
            <FiClock className="mx-auto text-4xl text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
            <p className="text-gray-600 dark:text-gray-400">Get instant updates on seat availability</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card text-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/40 dark:border-slate-800 shadow-lg shadow-slate-900/40"
          >
            <FiStar className="mx-auto text-4xl text-yellow-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Best Experience</h3>
            <p className="text-gray-600 dark:text-gray-400">Enjoy seamless movie booking experience</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Mobile App Coming Soon Banner */}
      <motion.section
        className="container mx-auto px-4 pb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="card text-center bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-lg border border-white/40 dark:border-slate-800 shadow-lg shadow-slate-900/40"
        >
          <h3 className="text-2xl font-bold mb-2">Mobile App Coming Soon</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Book your favourite movies and events on the go with the QuickShow mobile app.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stay tuned for updates on Android and iOS release dates.
          </p>
        </motion.div>
      </motion.section>

      {activeTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden">
            <button
              onClick={() => setActiveTrailer(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs md:text-sm px-3 py-1.5 backdrop-blur shadow-lg border border-white/20 transition-colors"
            >
              Close ✕
            </button>
            <iframe
              src={activeTrailer}
              title="Premiere Trailer"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
