import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../utils/axios';
import { FiCalendar, FiMapPin, FiDollarSign } from 'react-icons/fi';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
  });

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/events?${params}`);
      setEvents(response.data.events || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8"
      >
        Events
      </motion.h1>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="concert">Concert</option>
              <option value="standup">Stand-up</option>
              <option value="workshop">Workshop</option>
              <option value="theater">Theater</option>
              <option value="sports">Sports</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">City</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="input-field"
            >
              <option value="">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shimmer h-64 rounded-xl" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/events/${event._id}`}>
                <div className="card overflow-hidden group cursor-pointer">
                  <div className="relative h-48">
                    <img
                      src={event.image || 'https://via.placeholder.com/400x300'}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                    <div className="absolute top-2 right-2 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <FiCalendar />
                        <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiMapPin />
                        <span>{event.venue?.name}, {event.venue?.city}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiDollarSign />
                        <span>₹{event.price?.min} - ₹{event.price?.max}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">No events found</p>
        </div>
      )}
    </div>
  );
};

export default Events;

