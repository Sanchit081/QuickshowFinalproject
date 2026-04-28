import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { FiLock, FiMail } from 'react-icons/fi';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (result.type === 'auth/login/fulfilled' && result.payload.user.role === 'admin') {
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } else if (result.type === 'auth/login/fulfilled') {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-gray-600 dark:text-gray-400">QuickShow Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field pl-10"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;


