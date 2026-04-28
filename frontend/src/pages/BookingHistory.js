import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchBookings } from '../store/slices/bookingSlice';
import { FiCalendar, FiClock, FiMapPin, FiFileText } from 'react-icons/fi';

const BookingHistory = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="shimmer h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="card text-center py-12">
            <FiFileText className="mx-auto text-6xl text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No bookings yet</p>
            <Link to="/movies" className="btn-primary inline-block mt-4">
              Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {booking.showId?.movieId?.title}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FiMapPin />
                        <span>{booking.showId?.cinemaId?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FiCalendar />
                        <span>{new Date(booking.showId?.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FiClock />
                        <span>{booking.showId?.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">Seats: </span>
                        <span>{booking.seats.map(s => `${s.row}${s.number}`).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-8 text-right">
                    <p className="text-2xl font-bold mb-2">₹{booking.amountPaid}</p>
                    <p className={`text-sm font-semibold ${
                      booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {booking.paymentStatus.toUpperCase()}
                    </p>
                    <Link
                      to={`/ticket/${booking._id}`}
                      className="btn-secondary mt-2 inline-block"
                    >
                      View Ticket
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingHistory;

