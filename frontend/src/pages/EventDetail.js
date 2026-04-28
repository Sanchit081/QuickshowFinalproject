import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../utils/axios';
import { FiCalendar, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState('regular');
  const [quantity, setQuantity] = useState(1);
  const [personalSecurity, setPersonalSecurity] = useState(false);
  const navigate = useNavigate();

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(`/events/${id}`);
      setEvent(response.data.event);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch event:', error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

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
    };
  }, [event, area, quantity, personalSecurity, isConcert]);

  const handleBookNow = () => {
    if (!event) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book this event');
      navigate('/login');
      return;
    }

    navigate('/event-checkout', {
      state: {
        event,
        area,
        quantity,
        personalSecurity,
      },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="shimmer h-96 rounded-xl" />
      </div>
    );
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-8">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Hero Section */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-8">
          <img
            src={event.banner || event.image || 'https://via.placeholder.com/1200x400'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-purple-600 rounded-full">{event.category}</span>
              <span className="flex items-center space-x-1">
                <FiCalendar />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FiClock />
                <span>{event.time}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">About</h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {/* Venue Details */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Venue Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Venue</p>
                  <p className="font-semibold text-lg text-gray-900">{event.venue?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Address</p>
                  <p className="font-semibold text-gray-900">{event.venue?.address}</p>
                  <p className="text-gray-600">{event.venue?.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Trailers Grid */}
          <div className="md:col-span-2">
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Trailer 1 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ&controls=0&showinfo=0&rel=0"
                    title="Video 1"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 2 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/hYcw5zf_d-w?autoplay=1&mute=1&loop=1&playlist=hYcw5zf_d-w&controls=0&showinfo=0&rel=0"
                    title="Video 2"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 3 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&mute=1&loop=1&playlist=9bZkp7q19f0&controls=0&showinfo=0&rel=0"
                    title="Video 3"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 4 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&loop=1&playlist=ScMzIvxBSi4&controls=0&showinfo=0&rel=0"
                    title="Video 4"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 5 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1&mute=1&loop=1&playlist=3JZ_D3ELwOQ&controls=0&showinfo=0&rel=0"
                    title="Video 5"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Trailer 6 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/4q2qntJ5-uA?autoplay=1&mute=1&loop=1&playlist=4q2qntJ5-uA&controls=0&showinfo=0&rel=0"
                    title="Video 6"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Book Your Experience</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(event.date).toLocaleDateString()} • {event.time}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Select Area</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {['regular', 'vip', 'vvip'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setArea(tier)}
                        className={`rounded-lg px-2 py-3 border text-center capitalize transition-colors ${
                          area === tier
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-gray-100 border-gray-300 text-gray-800'
                        }`}
                      >
                        <span className="block font-semibold text-sm">{tier}</span>
                        <span className="block text-[10px] text-gray-200 dark:text-gray-300 mt-1">
                          ₹{pricing.tiers?.[tier] || 0}/ticket
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Tickets</p>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg font-semibold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {isConcert && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          Personal Security (optional)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Add on-site personal security assistance for your group during the concert.
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold">+₹{pricing.securityFee || 0}</p>
                        <label className="inline-flex items-center mt-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={personalSecurity}
                            onChange={(e) => setPersonalSecurity(e.target.checked)}
                            className="mr-1 rounded border-gray-400"
                          />
                          <span>Include</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tickets ({quantity}×)</span>
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
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 text-lg font-bold">
                    <span>Total</span>
                    <span>₹{pricing.total}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBookNow}
                className="btn-primary w-full mt-4 py-3"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default EventDetail;

