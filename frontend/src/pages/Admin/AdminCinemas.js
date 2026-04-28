import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { adminApi } from '../../services/adminApi';

const AdminCinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: 'Mumbai',
    address: '',
    rows: 10,
    seatsPerRow: 20,
    amenities: []
  });

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const response = await adminApi.listCinemas();
      setCinemas(response.data.cinemas || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch cinemas');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCinema(formData);
      toast.success('Cinema added successfully');
      setShowModal(false);
      setFormData({
        name: '',
        city: 'Mumbai',
        address: '',
        rows: 10,
        seatsPerRow: 20,
        amenities: []
      });
      fetchCinemas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add cinema');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cinema?')) return;
    try {
      await adminApi.deleteCinema(id);
      toast.success('Cinema deleted successfully');
      fetchCinemas();
    } catch (error) {
      toast.error('Failed to delete cinema');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Cinemas Management</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Cinema</span>
        </button>
      </div>

      {loading ? (
        <div className="shimmer h-64 rounded-xl" />
      ) : cinemas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-xl">No cinemas found</p>
          <p className="text-sm text-gray-500 mb-4">Click "Add Cinema" to create your first cinema</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Add Cinema
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cinemas.map((cinema) => (
            <div key={cinema._id} className="card">
              <h3 className="text-xl font-bold mb-2">{cinema.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">{cinema.city}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">{cinema.address}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                {cinema.seatLayout?.seats?.length || 0} seats ({cinema.seatLayout?.rows || 0} rows × {cinema.seatLayout?.seatsPerRow || 0} seats/row)
              </p>
              <button
                onClick={() => handleDelete(cinema._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FiTrash2 />
              </button>
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
            <h2 className="text-2xl font-bold mb-4">Add Cinema</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Cinema Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input-field"
                required
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
              </select>
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Rows</label>
                  <input
                    type="number"
                    value={formData.rows}
                    onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) })}
                    className="input-field"
                    min="5"
                    max="15"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seats per Row</label>
                  <input
                    type="number"
                    value={formData.seatsPerRow}
                    onChange={(e) => setFormData({ ...formData, seatsPerRow: parseInt(e.target.value) })}
                    className="input-field"
                    min="10"
                    max="30"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  Add Cinema
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

export default AdminCinemas;

