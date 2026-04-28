import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { updateProfile } from '../store/slices/authSlice';
import { fetchBookings } from '../store/slices/bookingSlice';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || 'Mumbai',
  });

  React.useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (result.type === 'auth/updateProfile/fulfilled') {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="md:col-span-1">
            <div className="card text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg glass hover:bg-white/20"
                >
                  <FiEdit2 />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold">Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="input-field pl-10 opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Phone</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">City</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input-field pl-10"
                      >
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-semibold text-lg">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-semibold">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">City</p>
                    <p className="font-semibold">{user?.city}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

