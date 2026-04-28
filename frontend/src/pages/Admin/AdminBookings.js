import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/adminApi';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminApi.listBookings();
      setBookings(response.data.bookings || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking? This will mark it as refunded and release seats.')) return;
    try {
      setActionLoading(bookingId);
      await adminApi.cancelBooking(bookingId);
      toast.success('Booking cancelled');
      await fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bookings Management</h1>
      {loading ? (
        <div className="shimmer h-64 rounded-xl" />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{booking.showId?.movieId?.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {booking.showId?.cinemaId?.name} • {new Date(booking.showId?.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {booking.userId?.name ? `${booking.userId.name} • ` : ''}{booking.userId?.email || ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{booking.amountPaid}</p>
                  <p className={`text-sm ${
                    booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {booking.paymentStatus}
                  </p>
                  {booking.paymentStatus === 'completed' && (
                    <button
                      type="button"
                      disabled={actionLoading === booking._id}
                      onClick={() => handleCancel(booking._id)}
                      className="mt-3 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {actionLoading === booking._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;


