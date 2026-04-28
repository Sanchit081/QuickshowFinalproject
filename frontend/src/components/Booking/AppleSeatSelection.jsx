import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';
import { API_URL } from '../../config/api';

const DEFAULT_PRICING = {
  platinum: 400,
  gold: 250,
  silver: 180
};

const DEFAULT_ROWS = ['A', 'B', 'C'];
const PENDING_BOOKING_KEY = 'quickshow-pending-booking';

const buildSeatKey = (row = '', number = 0) => `${String(row).toUpperCase()}-${Number(number)}`;

const inferSeatClassFromRow = (rowLabel = '') => {
  const row = String(rowLabel).toUpperCase();
  // With only 3 rows: A is front (cheaper), B is middle, C is back (more expensive)
  if (row === 'A') return 'silver';
  if (row === 'B') return 'gold';
  return 'platinum';
};

const normalizeSeat = (seat = {}) => {
  const row = String(seat.row || '').toUpperCase();
  let seatClass = seat.class || inferSeatClassFromRow(row);
  seatClass = String(seatClass).toLowerCase();
  
  return {
    row: row,
    number: Number(seat.number),
    class: seatClass,
    status: seat.status || 'available',
    isLockedByCurrentUser: Boolean(seat.isLockedByCurrentUser),
    lockedUntil: seat.lockedUntil || null
  };
};

const generateFallbackSeats = () => {
  const seats = [];
  DEFAULT_ROWS.forEach((row, rowIndex) => {
    for (let number = 1; number <= 20; number += 1) {
      // With only 3 rows: A (silver), B (gold), C (platinum)
      let seatClass = 'silver';
      if (rowIndex === 1) seatClass = 'gold';
      else if (rowIndex === 2) seatClass = 'platinum';
      
      seats.push({
        row,
        number,
        class: seatClass,
        status: 'available'
      });
    }
  });
  return seats;
};

const socketBaseUrl = API_URL.replace(/\/api$/, '');

const AppleSeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [show, setShow] = useState(null);
  const [seatMap, setSeatMap] = useState({});
  const [selectedSeatKeys, setSelectedSeatKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lockingSeatKeys, setLockingSeatKeys] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition] = useState({ x: 0, y: 0 });

  const syncShowState = useCallback((showPayload) => {
    if (!showPayload) return;

    const showData = showPayload.show || showPayload;
    const rawSeats = showData.seats?.length ? showData.seats : generateFallbackSeats();
    const nextSeatMap = {};

    rawSeats.forEach((seat) => {
      const normalized = normalizeSeat(seat);
      nextSeatMap[buildSeatKey(normalized.row, normalized.number)] = normalized;
    });

    setShow(showData);
    setSeatMap(nextSeatMap);
    // Keep locally selected seats unless they've become booked / held by someone else.
    // This prevents "unselecting" when the show refreshes via socket updates.
    setSelectedSeatKeys((prev) => prev.filter((key) => {
      const seat = nextSeatMap[key];
      if (!seat) return false;
      if (seat.status === 'booked') return false;
      if (seat.status === 'locked' && !seat.isLockedByCurrentUser) return false;
      return true;
    }));
  }, []);

  const fetchShowData = useCallback(async () => {
    try {
      const response = await axios.get(`/shows/${showId}`);
      syncShowState(response.data.show);
    } catch (error) {
      console.error('Error fetching show data:', error);
      toast.error(error.response?.data?.message || 'Failed to load show data');
    } finally {
      setLoading(false);
    }
  }, [showId, syncShowState]);

  useEffect(() => {
    fetchShowData();
  }, [fetchShowData]);

  useEffect(() => {
    const socket = io(socketBaseUrl, {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-show', { showId });
    });

    socket.on('show-seats-updated', (payload) => {
      if (payload?.showId === showId) {
        fetchShowData();
      }
    });

    return () => {
      socket.emit('leave-show', { showId });
      socket.disconnect();
    };
  }, [fetchShowData, showId]);

  useEffect(() => {
    const releaseHeldSeats = async () => {
      if (!selectedSeatKeys.length) return;

      try {
        await axios.post('/bookings/release', {
          showId,
          seats: selectedSeatKeys.map((key) => {
            const seat = seatMap[key];
            return { row: seat.row, number: seat.number };
          })
        });
      } catch (error) {
        console.error('Failed to release seats on unmount:', error);
      }
    };

    return () => {
      if (sessionStorage.getItem(PENDING_BOOKING_KEY)) return;
      releaseHeldSeats();
    };
  }, [seatMap, selectedSeatKeys, showId]);

  const selectedSeats = useMemo(() => (
    selectedSeatKeys
      .map((key) => seatMap[key])
      .filter(Boolean)
  ), [seatMap, selectedSeatKeys]);

  const handleSeatToggle = useCallback(async (seat) => {
    const normalizedSeat = normalizeSeat(seat);
    const seatKey = buildSeatKey(normalizedSeat.row, normalizedSeat.number);
    const isCurrentlySelected = selectedSeatKeys.includes(seatKey);
    
    // Check if seat is already booked
    if (seatMap[seatKey]?.status === 'booked') {
      toast.error('This seat is already booked');
      return;
    }

    // If seat is locked by another user, block selection
    if (seatMap[seatKey]?.status === 'locked' && !seatMap[seatKey]?.isLockedByCurrentUser) {
      toast.error('This seat is currently held by another user');
      return;
    }

    if (lockingSeatKeys.includes(seatKey)) return;

    setLockingSeatKeys((prev) => [...prev, seatKey]);
    try {
      if (isCurrentlySelected) {
        await axios.post('/bookings/release', {
          showId,
          seats: [{ row: normalizedSeat.row, number: normalizedSeat.number }]
        });
        setSelectedSeatKeys((prev) => prev.filter((key) => key !== seatKey));
      } else {
        await axios.post('/bookings/hold', {
          showId,
          seats: [{ row: normalizedSeat.row, number: normalizedSeat.number, class: normalizedSeat.class }]
        });
        setSelectedSeatKeys((prev) => (prev.includes(seatKey) ? prev : [...prev, seatKey]));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update seat lock');
      fetchShowData();
    } finally {
      setLockingSeatKeys((prev) => prev.filter((key) => key !== seatKey));
    }
  }, [fetchShowData, lockingSeatKeys, seatMap, selectedSeatKeys, showId]);

  const amountSummary = useMemo(() => {
    const pricing = show?.seatPricing || DEFAULT_PRICING;
    const baseAmount = selectedSeats.reduce((total, seat) => total + (pricing[seat.class] || 0), 0);
    const convenienceFee = Math.round(baseAmount * 0.02);
    const gst = Math.round(baseAmount * 0.18);

    return {
      baseAmount,
      convenienceFee,
      gst,
      total: baseAmount + convenienceFee + gst,
      seatCount: selectedSeats.length
    };
  }, [selectedSeats, show]);

  const handleProceed = useCallback(async () => {
    if (!selectedSeats.length) {
      toast.error('Please select at least one seat');
      return;
    }

    setSubmitting(true);

    try {
      // Lock all selected seats on backend before proceeding
      const lockResponse = await axios.post('/bookings/hold', {
        showId,
        seats: selectedSeats.map(seat => ({
          row: seat.row,
          number: seat.number,
          class: seat.class
        }))
      });

      if (!lockResponse.data.success) {
        throw new Error(lockResponse.data.message || 'Failed to lock seats');
      }

      // Use the updated show data from the lock response
      const bookingData = {
        showId,
        show: lockResponse.data.show || show,
        selectedSeats,
        amountSummary,
        timestamp: new Date().toISOString()
      };

      sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(bookingData));
      navigate('/checkout', { state: bookingData });
    } catch (error) {
      console.error('Booking init error:', error);
      toast.error(error.response?.data?.message || 'Failed to lock seats for booking');
    } finally {
      setSubmitting(false);
    }
  }, [amountSummary, navigate, selectedSeats, show, showId]);

  const seatsByRow = useMemo(() => {
    const grouped = {};
    Object.values(seatMap).forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });

    return Object.entries(grouped)
      .sort(([rowA], [rowB]) => rowA.localeCompare(rowB))
      .map(([row, seats]) => [row, seats.sort((a, b) => a.number - b.number)]);
  }, [seatMap]);

  if (loading) {
    return (
      <div className="min-h-screen bg-apple-black flex items-center justify-center">
        <div className="loading-apple w-64 h-64 apple-card-glass" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-apple-black">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="apple-nav px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-apple-primary">Select Seats</h1>
            <p className="text-apple-muted text-sm mt-1">
              {show?.movieId?.title} • {show?.cinemaId?.name}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))}
              className="w-8 h-8 rounded-lg apple-button flex items-center justify-center"
              aria-label="Zoom out"
            >
              <FiZoomOut className="text-apple-secondary" />
            </button>
            <span className="text-apple-muted text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 2))}
              className="w-8 h-8 rounded-lg apple-button flex items-center justify-center"
              aria-label="Zoom in"
            >
              <FiZoomIn className="text-apple-secondary" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="apple-card-glass p-6 rounded-2xl">
                <div className="mb-8 text-center">
                  <div className="inline-block px-6 py-2 bg-apple-medium rounded-lg">
                    <span className="text-apple-muted text-xs uppercase tracking-[0.3em]">Screen This Side</span>
                  </div>
                </div>

                <div
                  className="seat-grid overflow-hidden rounded-xl border-apple-thin"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  {seatsByRow.map(([row, seats]) => (
                    <motion.div
                      key={row}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-1 sm:gap-1.5 mb-4"
                    >
                      <span className="w-6 sm:w-8 text-apple-muted text-xs sm:text-sm font-semibold">{row}</span>
                      <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
                        {seats.map((seat, seatIndex) => {
                          const seatKey = buildSeatKey(seat.row, seat.number);
                          const isSelected = selectedSeatKeys.includes(seatKey);
                          const isBooked = seat.status === 'booked';
                          const isLockedByOther = seat.status === 'locked' && !seat.isLockedByCurrentUser;
                          const isLockedByMe = seat.status === 'locked' && seat.isLockedByCurrentUser;
                          const isLocking = lockingSeatKeys.includes(seatKey);
                          const pricing = show?.seatPricing || DEFAULT_PRICING;
                          const seatPrice = pricing[seat.class] || 0;
                          
                          // Calculate curved position for cinema effect
                          const totalSeats = seats.length;
                          const centerIndex = (totalSeats - 1) / 2;
                          const offsetFromCenter = seatIndex - centerIndex;
                          const curveIntensity = 8;
                          const translateY = Math.abs(offsetFromCenter) * curveIntensity;
                          const translateX = offsetFromCenter * 2;
                          const rotate = offsetFromCenter * 0.5;

                          return (
                            <motion.button
                              key={seatKey}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: isBooked ? 1 : 1.05 }}
                              whileTap={{ scale: isBooked ? 1 : 0.95 }}
                              onClick={() => handleSeatToggle(seat)}
                              disabled={isBooked || isLockedByOther || isLocking}
                              className={`seat transition-all duration-200 ${
                                isBooked
                                  ? 'seat-booked cursor-not-allowed'
                                  : isLockedByOther
                                    ? 'cursor-not-allowed opacity-60'
                                  : isLocking
                                    ? 'opacity-70 cursor-wait'
                                  : isSelected
                                    ? 'seat-selected'
                                    : (isLockedByMe
                                        ? 'ring-2 ring-red-300'
                                        : '') || (seat.class === 'platinum'
                                        ? 'seat-available seat-platinum'
                                        : seat.class === 'gold'
                                          ? 'seat-available seat-gold'
                                          : 'seat-available seat-silver'
                                      )
                              }`}
                              style={{
                                transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`
                              }}
                              title={`${seat.row}${seat.number} • ${seat.class} • ₹${seatPrice}${isLockedByOther ? ' • Held' : ''}`}
                            >
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-xs sm:text-sm font-semibold">{seat.number}</span>
                                {!isSelected && <span className="text-[8px] sm:text-[10px] font-medium opacity-80">₹{seatPrice}</span>}
                              </div>
                              {isSelected && <FiCheck className="text-xs absolute top-0 right-0" />}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs text-apple-muted">
                  <div>Tap a seat to hold it for checkout.</div>
                  <div>Dim seats are held by another user (auto-release after a short time).</div>
                  <div>Booked seats stay unavailable for everyone.</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="apple-card p-6 rounded-2xl space-y-6 sticky top-6">
                <h2 className="text-xl font-bold text-apple-primary mb-6">Booking Summary</h2>

                <div className="space-y-2">
                  <p className="text-apple-secondary text-sm">Selected Seats</p>
                  <div className="bg-apple-medium rounded-lg p-3">
                    <p className="font-semibold text-apple-primary">
                      {selectedSeats.length
                        ? selectedSeats.map((seat) => `${seat.row}${seat.number}`).join(', ')
                        : 'No seats selected'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-apple-dark rounded-lg p-3">
                      <p className="text-apple-muted text-xs">Ticket Price</p>
                      <p className="font-semibold text-apple-primary">₹{amountSummary.baseAmount}</p>
                    </div>
                    <div className="bg-apple-dark rounded-lg p-3">
                      <p className="text-apple-muted text-xs">Convenience Fee</p>
                      <p className="font-semibold text-apple-primary">₹{amountSummary.convenienceFee}</p>
                    </div>
                  </div>

                  <div className="bg-apple-dark rounded-lg p-3">
                    <p className="text-apple-muted text-xs">GST (18%)</p>
                    <p className="font-semibold text-apple-primary">₹{amountSummary.gst}</p>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <p className="text-red-700 text-xs font-semibold">Total Payable</p>
                    <p className="text-lg font-bold text-gray-900">₹{amountSummary.total}</p>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!selectedSeats.length || submitting}
                  className="w-full apple-button-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span>{submitting ? 'Preparing Checkout...' : 'Proceed to Payment'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppleSeatSelection;
