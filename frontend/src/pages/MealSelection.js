import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const DEFAULT_PRICING = {
  platinum: 400,
  gold: 250,
  silver: 180,
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

const parseStoredBooking = () => {
  try {
    const stored = sessionStorage.getItem(PENDING_BOOKING_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to parse stored booking:', error);
    return null;
  }
};

const inferSeatClassFromRow = (rowLabel = '') => {
  const row = rowLabel.toUpperCase();
  if (['A', 'B'].includes(row)) return 'platinum';
  if (['C', 'D', 'E'].includes(row)) return 'gold';
  return 'silver';
};

const MealSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;

  const [bookingData, setBookingData] = useState(() => locationState || parseStoredBooking());
  const [showDetails, setShowDetails] = useState(locationState?.show || null);
  const [initializing, setInitializing] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState({});

  useEffect(() => {
    if (locationState) {
      setBookingData(locationState);
      sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(locationState));
    }
  }, [locationState]);

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
        const response = await fetch(`${API_URL}/shows/${bookingData.showId}`);
        const data = await response.json();
        if (data.success && data.show) {
          setShowDetails(data.show);
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
      class: seat.class || inferSeatClassFromRow(seat.row),
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
      total: baseAmount + convenienceFee + gst,
    };
  }, [normalizedSeats, show]);

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
    return (amountSummary.total || 0) + (mealSummary.total || 0);
  }, [amountSummary.total, mealSummary.total]);

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
    navigate('/checkout', { state: bookingData });
  };

  const handleContinue = () => {
    navigate('/checkout', { state: bookingData });
  };

  if (!bookingData || initializing || !show) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="shimmer h-96 rounded-xl" />
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
        <h1 className="text-3xl font-bold mb-8">Meals & Snacks</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Movie</p>
                  <p className="font-semibold text-lg">{show.movieId?.title}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Cinema</p>
                  <p className="font-semibold">{show.cinemaId?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {show.cinemaId?.address}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Date & Time</p>
                  <p className="font-semibold">
                    {new Date(show.date).toLocaleDateString()} • {show.time}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Seats</p>
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
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
                >
                  Skip
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Choose from our combos and snacks. All orders include <span className="font-semibold">on-seat delivery</span>
                {' '}if you add the delivery service.
              </p>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {MEAL_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold text-sm md:text-base">{item.name}</p>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                      <p className="text-sm font-semibold mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateMealQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {selectedMeals[item.id] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateMealQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-blue-600 text-gray-800 flex items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {mealSummary.items.length > 0 && (
                <div className="mt-4 border-t pt-3 text-sm text-gray-700 dark:text-gray-300">
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
            <h2 className="text-2xl font-bold mb-4">Bill Summary</h2>
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
                <span>Tickets Total</span>
                <span>₹{amountSummary.total}</span>
              </div>
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
              {mealSummary.total === 0 && (
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total Bill</span>
                  <span>₹{amountSummary.total}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="btn-primary w-full"
            >
              Continue to Payment
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              You can review coupon and final payment details on the next step.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MealSelection;
