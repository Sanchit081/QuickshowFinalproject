import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCommentAlt, FaLightbulb, FaBug, FaHeart, FaPaperPlane, FaCheckCircle, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('general');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { id: 'general', name: 'General Feedback', icon: FaCommentAlt, color: 'purple' },
    { id: 'bug', name: 'Bug Report', icon: FaBug, color: 'red' },
    { id: 'feature', name: 'Feature Request', icon: FaLightbulb, color: 'blue' },
    { id: 'complaint', name: 'Complaint', icon: FaHeart, color: 'orange' }
  ];

  const recentFeedback = [
    {
      type: 'General Feedback',
      comment: 'Love the new seat selection feature! So intuitive and easy to use.',
      rating: 5,
      date: '2024-03-20',
      user: 'Sarah M.',
      status: 'Reviewed'
    },
    {
      type: 'Feature Request',
      comment: 'Would love to see a "watch later" feature for movies coming soon.',
      rating: 4,
      date: '2024-03-19',
      user: 'Mike R.',
      status: 'In Progress'
    },
    {
      type: 'Bug Report',
      comment: 'App crashes when selecting seats in the back row on mobile.',
      rating: 3,
      date: '2024-03-18',
      user: 'Lisa K.',
      status: 'Fixed'
    },
    {
      type: 'General Feedback',
      comment: 'The payment process is so smooth now! Great improvement.',
      rating: 5,
      date: '2024-03-17',
      user: 'John D.',
      status: 'Reviewed'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setFeedbackType('general');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <PremiumNavbar />
      
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center space-x-3 px-4 py-2 bg-purple-100 rounded-full"
              >
                <FaCommentAlt className="text-purple-600" />
                <span className="text-purple-900 font-medium">Your Feedback Matters</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Help Us Improve QuickShow
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Your feedback helps us create a better cinema booking experience. 
                Share your thoughts, report issues, or suggest new features.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Feedback Form */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {submitted ? (
                <div className="text-center py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <FaCheckCircle className="text-green-600 text-4xl" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Thank You for Your Feedback!
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    We appreciate your input and will review your feedback carefully.
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <FaThumbsUp className="text-green-600" />
                      <span className="text-gray-700">Feedback submitted successfully</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Feedback Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        What type of feedback would you like to share?
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {feedbackTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFeedbackType(type.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              feedbackType === type.id
                                ? `border-${type.color}-600 bg-${type.color}-50`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <type.icon className={`text-${type.color}-600 text-2xl mb-2`} />
                            <p className="font-medium text-gray-900">{type.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        How would you rate your experience?
                      </label>
                      <div className="flex items-center justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="transition-all duration-200"
                          >
                            <FaStar
                              className={`text-3xl ${
                                star <= (hoveredStar || rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-sm text-gray-500 mt-2">
                        {rating === 0 ? 'Select a rating' : `${rating} star${rating !== 1 ? 's' : ''}`}
                      </p>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Brief summary of your feedback"
                      />
                    </div>

                    {/* Detailed Feedback */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Feedback *
                      </label>
                      <textarea
                        rows={6}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Please share your detailed feedback, suggestions, or report issues..."
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name (Optional)
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={rating === 0}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                      >
                        <FaPaperPlane />
                        <span>Submit Feedback</span>
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Rating is required to submit feedback
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Recent Feedback */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Recent Feedback
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See what others are saying and how we're responding
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {recentFeedback.map((feedback, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-2">
                        {feedback.type}
                      </span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      feedback.status === 'Fixed' ? 'bg-green-100 text-green-700' :
                      feedback.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{feedback.comment}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                      <span>{feedback.user}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(feedback.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Your Feedback Makes a Difference
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how your feedback is helping us improve QuickShow
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: '15,234', label: 'Feedback Received', color: 'purple' },
                { number: '89%', label: 'Issues Resolved', color: 'green' },
                { number: '47', label: 'Features Added', color: 'blue' },
                { number: '4.8/5', label: 'Average Rating', color: 'orange' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-4xl lg:text-5xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <PremiumFooter />
    </div>
  );
};

export default Feedback;
