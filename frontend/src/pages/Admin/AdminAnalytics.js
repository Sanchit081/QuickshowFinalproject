import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiDollarSign, FiUsers, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { adminApi } from '../../services/adminApi';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminApi.getAnalytics();
      setAnalytics(response.data.analytics);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch analytics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="shimmer h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <FiDollarSign className="text-4xl text-green-600 mb-4" />
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">₹{analytics?.totalRevenue || 0}</p>
        </div>
        <div className="card">
          <FiCalendar className="text-4xl text-blue-600 mb-4" />
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">{analytics?.totalBookings || 0}</p>
        </div>
        <div className="card">
          <FiUsers className="text-4xl text-purple-600 mb-4" />
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{analytics?.totalUsers || 0}</p>
        </div>
        <div className="card">
          <FiTrendingUp className="text-4xl text-yellow-600 mb-4" />
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">New Users (30d)</h3>
          <p className="text-3xl font-bold">{analytics?.newUsers || 0}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>
        <div className="space-y-2">
          {analytics?.popularMovies?.map((movie, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span>{movie.movie?.title || 'Unknown'}</span>
              <span className="font-bold">{movie.count} bookings</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;


