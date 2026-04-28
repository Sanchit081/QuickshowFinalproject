import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const EventCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!state || !state.event) {
      navigate('/events');
    }
  }, [state, navigate]);

  const { event, area, quantity, personalSecurity } = state || {};
  const isConcert = event?.category === 'concert';

  const pricing = useMemo(() => {
    if (!event) {
      return {
        tiers: { regular: 0, vip: 0, vvip: 0 },
        baseAmount: 0,
        securityFee: 0,
        convenienceFee: 0,
        gst: 0,
        total: 0,
      };
    }

    const min = event.price?.min || 1000;
    const max = event.price?.max || min * 2;
    const mid = Math.round((min + max) / 2);

    const tiers = isConcert
      ? {
          regular: min,
          vip: Math.round(mid * 1.5),
          vvip: Math.round(max * 2),
        }
      : {
          regular: min,
          vip: mid,
          vvip: max,
        };

    const safeArea = tiers[area] ? area : 'regular';
    const qty = Math.max(parseInt(quantity, 10) || 1, 1);

    const perTicket = tiers[safeArea];
    const baseAmount = perTicket * qty;

    let securityFee = 0;
    if (isConcert && personalSecurity) {
      const baseSecurity = 1500;
      const perPerson = 300;
      securityFee = baseSecurity + perPerson * Math.max(qty - 1, 0);
    }

    const convenienceFee = Math.round(baseAmount * 0.02);
    const gst = Math.round((baseAmount + securityFee + convenienceFee) * 0.18);
    const total = baseAmount + securityFee + convenienceFee + gst;

    return {
      tiers,
      baseAmount,
      securityFee,
      convenienceFee,
      gst,
      total,
      perTicket,
      qty,
      safeArea,
    };
  }, [event, area, quantity, personalSecurity, isConcert]);

  const handleConfirm = async () => {
    if (!event) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book this event');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/event-bookings`,
        {
          eventId: event._id,
          area,
          quantity,
          personalSecurity: isConcert && personalSecurity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        toast.success('Event booking confirmed!');
        navigate('/bookings');
      } else {
        toast.error(response.data?.message || 'Failed to confirm event booking');
      }
    } catch (error) {
      console.error('Event booking confirm failed:', error);
      const msg = error.response?.data?.message || 'Failed to confirm event booking';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8"
      >
        {/* Left: Event Summary */}
        <div className="md:col-span-2 space-y-4">
          <div className="card flex gap-4">
            <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={event.banner || event.image || 'https://via.placeholder.com/300x300'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{event.title}</h1>
              <p className="text-sm text-gray-600 mb-2 capitalize">
                {event.category}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                {new Date(event.date).toLocaleDateString()} • {event.time}
              </p>
              <p className="text-sm text-gray-700">
                {event.venue?.name}, {event.venue?.city}
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Your Selection</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Area</span>
                <span className="capitalize">{pricing.safeArea}</span>
              </div>
              <div className="flex justify-between">
                <span>Tickets</span>
                <span>
                  {pricing.qty} × ₹{pricing.perTicket}
                </span>
              </div>
              {isConcert && (
                <div className="flex justify-between">
                  <span>Personal Security</span>
                  <span>{personalSecurity ? 'Included' : 'Not added'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Price Summary */}
        <div className="card h-max">
          <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <div className="flex justify-between">
              <span>Tickets ({pricing.qty}×)</span>
              <span>₹{pricing.baseAmount}</span>
            </div>
            {pricing.securityFee > 0 && (
              <div className="flex justify-between">
                <span>Personal Security</span>
                <span>₹{pricing.securityFee}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Convenience Fee</span>
              <span>₹{pricing.convenienceFee}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{pricing.gst}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 text-lg font-bold">
              <span>Total Payable</span>
              <span>₹{pricing.total}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? 'Confirming...' : 'Confirm Booking'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-2 w-full text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-800"
          >
            Back to event
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EventCheckout;
