import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { adminApi } from '../../services/adminApi';
import { buildMediaUrl } from '../../config/api';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genres: [],
    languages: [],
    duration: '',
    releaseDate: '',
    isNowShowing: true,
    isComingSoon: false,
    poster: null,
    banner: null,
    trailerUrl: '',
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await adminApi.listMovies();
      setMovies(response.data.movies || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch movies');
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      description: '',
      genres: [],
      languages: [],
      duration: '',
      releaseDate: '',
      isNowShowing: true,
      isComingSoon: false,
      poster: null,
      banner: null,
      trailerUrl: '',
    });
    setShowModal(true);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      description: movie.description || '',
      genres: movie.genres || [],
      languages: movie.languages || [],
      duration: movie.duration || '',
      releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
      isNowShowing: !!movie.isNowShowing,
      isComingSoon: !!movie.isComingSoon,
      poster: null,
      banner: null,
      trailerUrl: movie.trailerUrl || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'genres' || key === 'languages') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'poster' || key === 'banner') {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const url = editingMovie
        ? adminApi.updateMovie(editingMovie._id, formDataToSend)
        : adminApi.createMovie(formDataToSend);

      await url;
      toast.success(editingMovie ? 'Movie updated successfully' : 'Movie added successfully');
      setShowModal(false);
      setEditingMovie(null);
      fetchMovies();
    } catch (error) {
      toast.error('Failed to save movie');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await adminApi.deleteMovie(id);
      toast.success('Movie deleted');
      fetchMovies();
    } catch (error) {
      toast.error('Failed to delete movie');
    }
  };

  const handleCreateShows = async (movieId, movieTitle) => {
    if (!window.confirm(`Create default shows for "${movieTitle}"? This will create shows for the next 7 days across all cinemas.`)) return;
    try {
      const response = await adminApi.createShowsForMovie(movieId);
      toast.success(response.data.message || `Created ${response.data.count} shows successfully`);
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shows. Make sure cinemas exist.');
    }
  };

  const handleCreateShowsForAll = async () => {
    if (!window.confirm('Create shows for ALL movies? This will create shows for the next 7 days across all cinemas for all "Now Showing" movies.')) return;
    try {
      const response = await adminApi.createShowsForAll();
      toast.success(response.data.message || `Created ${response.data.count} shows successfully`);
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shows. Make sure cinemas exist.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Movies Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleCreateShowsForAll} 
            className="btn-secondary flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            title="Create shows for all movies"
          >
            <FiPlus />
            <span>Create Shows for All Movies</span>
          </button>
          <button onClick={openAddModal} className="btn-primary flex items-center space-x-2">
            <FiPlus />
            <span>Add Movie</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="shimmer h-64 rounded-xl" />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {movies.map((movie) => {
            const posterSrc = buildMediaUrl(movie.poster);

            return (
              <motion.div key={movie._id} className="card">
                <img
                  src={posterSrc || 'https://via.placeholder.com/300x450'}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {movie.isNowShowing ? 'Now Showing' : movie.isComingSoon ? 'Coming Soon' : 'Not Available'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    onClick={() => handleCreateShows(movie._id, movie.title)}
                    title="Create shows for next 7 days"
                  >
                    Create Shows
                  </button>
                  <button
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    onClick={() => openEditModal(movie)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(movie._id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">{editingMovie ? 'Edit Movie' : 'Add Movie'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="url"
                placeholder="Trailer YouTube URL (optional)"
                value={formData.trailerUrl}
                onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                className="input-field"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={4}
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium">Movie Type</label>
                <div className="flex items-center space-x-4 text-sm">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="movieType"
                      checked={formData.isNowShowing && !formData.isComingSoon}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          isNowShowing: true,
                          isComingSoon: false,
                        })
                      }
                    />
                    <span>Current (Now Showing)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="movieType"
                      checked={!formData.isNowShowing && formData.isComingSoon}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          isNowShowing: false,
                          isComingSoon: true,
                        })
                      }
                    />
                    <span>Upcoming</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Poster Image (required)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, poster: e.target.files?.[0] || null })}
                  className="input-field"
                  required={!editingMovie}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Banner Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, banner: e.target.files?.[0] || null })}
                  className="input-field"
                />
              </div>
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="input-field"
                required
              />
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingMovie ? 'Save Changes' : 'Add Movie'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;


