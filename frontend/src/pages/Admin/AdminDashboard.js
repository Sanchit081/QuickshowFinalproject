import React from 'react';
import { Link } from 'react-router-dom';
import { FiFilm, FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/movies" className="card hover:scale-105 transition-transform">
          <FiFilm className="text-4xl text-blue-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">Movies</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage movies and showtimes</p>
        </Link>
        <Link to="/admin/cinemas" className="card hover:scale-105 transition-transform">
          <FiMapPin className="text-4xl text-purple-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">Cinemas</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage cinema locations</p>
        </Link>
        <Link to="/admin/shows" className="card hover:scale-105 transition-transform">
          <FiCalendar className="text-4xl text-green-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">Shows</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage show schedules</p>
        </Link>
        <Link to="/admin/bookings" className="card hover:scale-105 transition-transform">
          <FiDollarSign className="text-4xl text-yellow-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">Bookings</h2>
          <p className="text-gray-600 dark:text-gray-400">View and manage bookings</p>
        </Link>
        <Link to="/admin/users" className="card hover:scale-105 transition-transform">
          <FiUsers className="text-4xl text-red-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage user accounts</p>
        </Link>
        <Link to="/admin/analytics" className="card hover:scale-105 transition-transform">
          <FiTrendingUp className="text-4xl text-indigo-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">View reports and insights</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

