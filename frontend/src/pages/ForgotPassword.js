import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEnvelope, FaFilm, FaArrowLeft } from 'react-icons/fa';
import axios from '../utils/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [otpPreview, setOtpPreview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setOtpPreview('');

    try {
      const response = await axios.post('/auth/forgot-password', { email });
      setSubmitted(true);

      if (response.data?.otp) {
        setOtpPreview(response.data.otp);
      }

      toast.success(response.data?.message || 'Reset instructions sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to start password reset');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl shadow-lg">
              <FaFilm />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h1>
            <p className="text-gray-600">
              Enter the email address linked to your QuickShow account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-900">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {submitted && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Reset initiation completed. Check your email for the next step.
                {otpPreview && (
                  <div className="mt-2 font-semibold">
                    Development OTP preview: {otpPreview}
                  </div>
                )}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending...' : 'Send reset code'}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <FaArrowLeft className="text-xs" />
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
