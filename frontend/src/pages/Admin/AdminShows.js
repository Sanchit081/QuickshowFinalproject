import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { adminApi } from '../../services/adminApi';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movieId: '',
    cinemaId: '',
    date: '',
    time: '',
    seatPricing: {
      platinum: 400,
      gold: 250,
      silver: 180
    }
  });

  useEffect(() => {
    fetchShows();
    fetchMovies();
    fetchCinemas();
  }, []);

  const fetchShows = async () => {
    try {
      const response = await adminApi.listShows();
      setShows(response.data.shows || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch shows');
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await adminApi.listMovies();
      setMovies(response.data.movies || []);
    } catch (error) {
      toast.error('Failed to fetch movies');
    }
  };

  const fetchCinemas = async () => {
    try {
      const response = await adminApi.listCinemas();
      setCinemas(response.data.cinemas || []);
    } catch (error) {
      toast.error('Failed to fetch cinemas');
    }
  };

  const openAddModal = () => {
    setEditingShow(null);
    setFormData({
      movieId: '',
      cinemaId: '',
      date: '',
      time: '',
      seatPricing: {
        platinum: 400,
        gold: 250,
        silver: 180
      }
    });
    setShowModal(true);
  };

  const openEditModal = (show) => {
    setEditingShow(show);
    const showDate = show.date ? new Date(show.date).toISOString().split('T')[0] : '';
    setFormData({
      movieId: show.movieId?._id || show.movieId || '',
      cinemaId: show.cinemaId?._id || show.cinemaId || '',
      date: showDate,
      time: show.time || '',
      seatPricing: show.seatPricing || {
        platinum: 400,
        gold: 250,
        silver: 180
      }
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingShow) {
        await adminApi.updateShow(editingShow._id, formData);
      } else {
        await adminApi.createShow(formData);
      }
      toast.success(editingShow ? 'Show updated successfully' : 'Show added successfully');
      setShowModal(false);
      setEditingShow(null);
      fetchShows();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save show');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show?')) return;
    try {
      await adminApi.deleteShow(id);
      toast.success('Show deleted successfully');
      fetchShows();
    } catch (error) {
      toast.error('Failed to delete show');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shows Management</h1>
        <button onClick={openAddModal} className="btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Add Show</span>
        </button>
      </div>

      {loading ? (
        <div className="shimmer h-64 rounded-xl" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => (
            <div key={show._id} className="card">
              <h3 className="text-xl font-bold mb-2">
                {show.movieId?.title || 'Unknown Movie'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {show.cinemaId?.name || 'Unknown Cinema'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                {new Date(show.date).toLocaleDateString()} at {show.time}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Available: {show.availableSeats || 0} / {show.totalSeats || 0} seats
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(show)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(show._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingShow ? 'Edit Show' : 'Add Show'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Movie</label>
                <select
                  value={formData.movieId}
                  onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a movie</option>
                  {movies.map((movie) => (
                    <option key={movie._id} value={movie._id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cinema</label>
                <select
                  value={formData.cinemaId}
                  onChange={(e) => setFormData({ ...formData, cinemaId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a cinema</option>
                  {cinemas.map((cinema) => (
                    <option key={cinema._id} value={cinema._id}>
                      {cinema.name} - {cinema.city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Seat Pricing</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Platinum</label>
                    <input
                      type="number"
                      value={formData.seatPricing.platinum}
                      onChange={(e) => setFormData({
                        ...formData,
                        seatPricing: { ...formData.seatPricing, platinum: parseInt(e.target.value) }
                      })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Gold</label>
                    <input
                      type="number"
                      value={formData.seatPricing.gold}
                      onChange={(e) => setFormData({
                        ...formData,
                        seatPricing: { ...formData.seatPricing, gold: parseInt(e.target.value) }
                      })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Silver</label>
                    <input
                      type="number"
                      value={formData.seatPricing.silver}
                      onChange={(e) => setFormData({
                        ...formData,
                        seatPricing: { ...formData.seatPricing, silver: parseInt(e.target.value) }
                      })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingShow ? 'Save Changes' : 'Add Show'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
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

export default AdminShows;


