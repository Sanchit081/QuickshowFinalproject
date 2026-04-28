import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from '../utils/axios';
import { buildMediaUrl } from '../config/api';
const DEFAULT_PRICING = {
  platinum: 400,
  gold: 250,
  silver: 180
};
const PENDING_BOOKING_KEY = 'quickshow-pending-booking';

const MEAL_ITEMS = [
  {
    id: 'combo1',
    name: 'Classic Combo',
    description: 'Popcorn (medium) + Cold Drink',
    price: 250,
    type: 'combo',
  },
  {
    id: 'combo2',
    name: 'Family Combo',
    description: 'Large Popcorn + 2 Cold Drinks + Nachos',
    price: 480,
    type: 'combo',
  },
  {
    id: 'burger',
    name: 'Cheese Burger',
    description: 'Grilled burger with cheese and fries',
    price: 220,
    type: 'single',
  },
  {
    id: 'pizza',
    name: 'Margherita Pizza',
    description: '8" classic cheese pizza',
    price: 320,
    type: 'single',
  },
  {
    id: 'cold_drink',
    name: 'Cold Drink',
    description: '500ml chilled beverage',
    price: 90,
    type: 'single',
  },
  {
    id: 'on_seat_delivery',
    name: 'On-seat Delivery Service',
    description: 'Have your order delivered directly to your seat',
    price: 40,
    type: 'service',
  },
];

const AVAILABLE_COUPONS = [
  {
    code: 'NEWBIE100',
    type: 'percent',
    value: 100,
    description: '100% off for new users on first booking'
  }
];

const inferSeatClassFromRow = (rowLabel = '') => {
  const row = rowLabel.toUpperCase();
  if (['A', 'B'].includes(row)) return 'platinum';
  if (['C', 'D', 'E'].includes(row)) return 'gold';
  return 'silver';
};

const parseStoredBooking = () => {
  try {
    const stored = sessionStorage.getItem(PENDING_BOOKING_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to parse stored booking:', error);
    return null;
  }
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;

  const [bookingData, setBookingData] = useState(() => locationState || parseStoredBooking());
  const [showDetails, setShowDetails] = useState(locationState?.show || null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState({}); // { [mealId]: quantity }

  useEffect(() => {
    if (locationState) {
      setBookingData(locationState);
      sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(locationState));
    }
  }, [locationState]);

  useEffect(() => {
    return () => {
      const stored = parseStoredBooking();
      if (!stored?.showId || !stored?.selectedSeats?.length) return;

      axios.post('/bookings/release', {
        showId: stored.showId,
        seats: stored.selectedSeats.map((seat) => ({
          row: seat.row,
          number: seat.number
        }))
      }).catch((error) => {
        console.error('Failed to release seats from checkout:', error);
      });
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (!bookingData?.showId || !bookingData?.selectedSeats?.length) {
      toast.error('Please select seats first');
      navigate('/movies');
    }
  }, [bookingData, navigate]);

  useEffect(() => {
    const fetchShowDetails = async () => {
      if (showDetails || !bookingData?.showId) return;
      setInitializing(true);
      try {
        const response = await axios.get(`/shows/${bookingData.showId}`);
        if (response.data.success && response.data.show) {
          setShowDetails(response.data.show);
        } else {
          toast.error('Failed to load show details');
          navigate('/movies');
        }
      } catch (error) {
        console.error('Failed to load show details:', error);
        toast.error('Failed to load show details');
        navigate('/movies');
      } finally {
        setInitializing(false);
      }
    };

    fetchShowDetails();
  }, [bookingData, showDetails, navigate]);

  const show = showDetails || bookingData?.show || null;

  const normalizedSeats = useMemo(() => {
    if (!bookingData?.selectedSeats) return [];
    return bookingData.selectedSeats.map((seat) => ({
      ...seat,
      class: seat.class || inferSeatClassFromRow(seat.row)
    }));
  }, [bookingData]);

  const amountSummary = useMemo(() => {
    if (!normalizedSeats.length) {
      return { baseAmount: 0, convenienceFee: 0, gst: 0, total: 0 };
    }
    const pricing = show?.seatPricing || DEFAULT_PRICING;
    const baseAmount = normalizedSeats.reduce((total, seat) => {
      const seatClass = (seat.class || inferSeatClassFromRow(seat.row)).toLowerCase();
      return total + (pricing[seatClass] || 0);
    }, 0);
    const convenienceFee = Math.round(baseAmount * 0.02);
    const gst = Math.round(baseAmount * 0.18);
    return {
      baseAmount,
      convenienceFee,
      gst,
      total: baseAmount + convenienceFee + gst
    };
  }, [normalizedSeats, show]);

  const { discountAmount, finalTotal } = useMemo(() => {
    if (!appliedCoupon || !amountSummary.total) {
      return { discountAmount: 0, finalTotal: amountSummary.total };
    }

    if (appliedCoupon.type === 'percent') {
      const discount = Math.round((amountSummary.total * appliedCoupon.value) / 100);
      return {
        discountAmount: Math.min(discount, amountSummary.total),
        finalTotal: Math.max(amountSummary.total - discount, 0)
      };
    }

    if (appliedCoupon.type === 'flat') {
      return {
        discountAmount: Math.min(appliedCoupon.value, amountSummary.total),
        finalTotal: Math.max(amountSummary.total - appliedCoupon.value, 0)
      };
    }

    return { discountAmount: 0, finalTotal: amountSummary.total };
  }, [appliedCoupon, amountSummary.total]);

  const mealSummary = useMemo(() => {
    const items = [];
    let total = 0;

    Object.entries(selectedMeals || {}).forEach(([id, qty]) => {
      if (!qty) return;
      const item = MEAL_ITEMS.find((m) => m.id === id);
      if (!item) return;
      const lineTotal = item.price * qty;
      total += lineTotal;
      items.push({ ...item, quantity: qty, lineTotal });
    });

    return { items, total };
  }, [selectedMeals]);

  const grandTotal = useMemo(() => {
    return (finalTotal || 0) + (mealSummary.total || 0);
  }, [finalTotal, mealSummary.total]);

  const updateMealQuantity = (id, delta) => {
    setSelectedMeals((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(current + delta, 0);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[id];
      } else {
        updated[id] = next;
      }
      return updated;
    });
  };

  const handleSkipMeals = () => {
    setSelectedMeals({});
  };

  const handleApplyCoupon = () => {
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) {
      toast.error('Please enter a coupon code');
      return;
    }

    const found = AVAILABLE_COUPONS.find((c) => c.code === trimmed);
    if (!found) {
      toast.error('Invalid coupon code');
      setAppliedCoupon(null);
      return;
    }

    if (!amountSummary.total) {
      toast.error('Nothing to apply coupon on');
      return;
    }

    setAppliedCoupon(found);
    toast.success(`Coupon ${found.code} applied!`);
  };

  const handlePayment = async () => {
    if (!bookingData?.showId || !normalizedSeats.length) {
      toast.error('Missing booking details. Please select seats again.');
      navigate('/movies');
      return;
    }

    setLoading(true);
    try {
      // Lock seats before creating booking to prevent 409 conflicts
      const lockResponse = await axios.post('/bookings/hold', {
        showId: bookingData.showId,
        seats: normalizedSeats
      });

      if (!lockResponse.data.success) {
        throw new Error(lockResponse.data.message || 'Failed to lock seats');
      }

      const bookingResponse = await axios.post('/bookings', {
        showId: bookingData.showId,
        seats: normalizedSeats
      });

      const booking = bookingResponse.data.booking;
      if (!booking?._id) {
        throw new Error(bookingResponse.data.message || 'Failed to create booking');
      }

      const paymentResponse = await axios.post('/payments/create-order', {
        bookingId: booking._id
      });

      if (!paymentResponse.data.success) {
        throw new Error(paymentResponse.data.message || 'Failed to create payment order');
      }

      const paymentId = paymentResponse.data.paymentResult?.paymentId;
      const paymentOrderId = paymentResponse.data.paymentResult?.paymentOrderId;

      const confirmResponse = await axios.put(`/bookings/${booking._id}/confirm`, {
        paymentId,
        paymentOrderId
      });

      if (!confirmResponse.data.success) {
        throw new Error(confirmResponse.data.message || 'Booking confirmation failed');
      }

      sessionStorage.removeItem(PENDING_BOOKING_KEY);
      toast.success('Booking confirmed successfully!');
      navigate(`/ticket/${booking._id}`);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData || initializing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="shimmer h-96 rounded-xl" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Unable to load booking details.</p>
          <button onClick={() => navigate('/movies')} className="btn-primary mt-4">
            Go to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-gray-600 mt-1">Review seats, add snacks, and confirm your booking.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Back
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-4">
              <div>
                <p className="text-gray-600">Movie</p>
                <p className="font-semibold text-lg">{show.movieId?.title}</p>
              </div>
              {!!show.movieId?.poster && (
                <img
                  src={buildMediaUrl(show.movieId.poster)}
                  alt={show.movieId?.title}
                  className="w-full h-44 object-cover rounded-2xl border border-gray-200"
                  loading="lazy"
                />
              )}
              <div>
                <p className="text-gray-600">Cinema</p>
                <p className="font-semibold">{show.cinemaId?.name}</p>
                <p className="text-sm text-gray-600">
                  {show.cinemaId?.address}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Date & Time</p>
                <p className="font-semibold">
                  {new Date(show.date).toLocaleDateString()} • {show.time}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Seats</p>
                <p className="font-semibold">
                  {normalizedSeats.map((seat) => `${seat.row}${seat.number}`).join(', ')}
                </p>
              </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Add Meals & Snacks</h2>
                <button
                  type="button"
                  onClick={handleSkipMeals}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Skip
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Choose from our combos and snacks. All orders include <span className="font-semibold">on-seat delivery</span>
                {' '}if you add the delivery service.
              </p>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {MEAL_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold text-sm md:text-base">{item.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {item.description}
                      </p>
                      <p className="text-sm font-semibold mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateMealQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {selectedMeals[item.id] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateMealQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-red-600 text-gray-800 flex items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {mealSummary.items.length > 0 && (
                <div className="mt-4 border-t pt-3 text-sm text-gray-700">
                  <p className="font-semibold mb-1">Selected Items:</p>
                  <ul className="space-y-1">
                    {mealSummary.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{item.lineTotal}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between mt-2 font-semibold">
                    <span>Food & Beverages Total</span>
                    <span>₹{mealSummary.total}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>

            <div className="mb-4 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code (e.g. NEWBIE100)"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="btn-secondary whitespace-nowrap"
                >
                  Apply Coupon
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Sample coupon: <span className="font-semibold">NEWBIE100</span>
                {' '} (100% off for new users on this booking).
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Ticket Price</span>
                <span>₹{amountSummary.baseAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience Fee</span>
                <span>₹{amountSummary.convenienceFee}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{amountSummary.gst}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{amountSummary.total}</span>
              </div>
              {appliedCoupon && (
                <>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Payable (Tickets)</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </>
              )}
              {mealSummary.total > 0 && (
                <>
                  <div className="border-t pt-3 flex justify-between">
                    <span>Food & Beverages</span>
                    <span>₹{mealSummary.total}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total Bill</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </>
              )}
              {mealSummary.total === 0 && !appliedCoupon && (
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total Bill</span>
                  <span>₹{amountSummary.total}</span>
                </div>
              )}
              {mealSummary.total === 0 && appliedCoupon && (
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total Bill</span>
                  <span>₹{finalTotal}</span>
                </div>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Note: Payment gateway integration is running in test mode.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
