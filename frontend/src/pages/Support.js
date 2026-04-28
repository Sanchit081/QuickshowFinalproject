import React from 'react';
import { motion } from 'framer-motion';
import { FaHeadset, FaPhone, FaEnvelope, FaClock, FaQuestionCircle, FaBook, FaVideo, FaComments } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const Support = () => {
  const supportOptions = [
    {
      icon: FaPhone,
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      contact: '1-800-QUICKSHOW',
      hours: '24/7 Available',
      color: 'purple'
    },
    {
      icon: FaEnvelope,
      title: 'Email Support',
      description: 'Get detailed help via email',
      contact: 'support@quickshow.com',
      hours: 'Response within 24 hours',
      color: 'blue'
    },
    {
      icon: FaComments,
      title: 'Live Chat',
      description: 'Instant help from our team',
      contact: 'Chat with us now',
      hours: '9 AM - 9 PM EST',
      color: 'green'
    },
    {
      icon: FaVideo,
      title: 'Video Call',
      description: 'Screen sharing for complex issues',
      contact: 'Schedule a call',
      hours: 'By appointment',
      color: 'orange'
    }
  ];

  const commonIssues = [
    {
      category: 'Booking Issues',
      issues: [
        { title: 'Payment not processing', solution: 'Check your payment method and try again' },
        { title: 'Seat selection not working', solution: 'Clear your browser cache and try again' },
        { title: 'Booking confirmation not received', solution: 'Check your spam folder' }
      ]
    },
    {
      category: 'Account Issues',
      issues: [
        { title: 'Can\'t log in', solution: 'Use the "Forgot Password" option' },
        { title: 'Profile not updating', solution: 'Refresh the page and try again' },
        { title: 'Subscription not active', solution: 'Check your payment status' }
      ]
    },
    {
      category: 'Technical Issues',
      issues: [
        { title: 'App not loading', solution: 'Check your internet connection' },
        { title: 'Videos not playing', solution: 'Update your browser or app' },
        { title: 'Slow performance', solution: 'Clear your browser cache' }
      ]
    }
  ];

  const faqCategories = [
    {
      title: 'Getting Started',
      questions: [
        { q: 'How do I create an account?', a: 'Click the Sign Up button and follow the registration process' },
        { q: 'Is QuickShow free to use?', a: 'Yes, browsing and searching movies is free. Booking fees apply to ticket purchases.' },
        { q: 'How do I find movies?', a: 'Use the search bar or browse through our curated categories' }
      ]
    },
    {
      title: 'Booking & Tickets',
      questions: [
        { q: 'How do I book tickets?', a: 'Select a movie, choose showtime, pick seats, and complete payment' },
        { q: 'Can I cancel my booking?', a: 'Yes, you can cancel up to 2 hours before showtime' },
        { q: 'How do I get my tickets?', a: 'Tickets are sent to your email and available in the app' }
      ]
    },
    {
      title: 'Payment & Refunds',
      questions: [
        { q: 'What payment methods are accepted?', a: 'We accept credit cards, debit cards, and digital wallets' },
        { q: 'How do I get a refund?', a: 'Refunds are processed according to our refund policy' },
        { q: 'Is my payment information secure?', a: 'Yes, we use industry-standard encryption' }
      ]
    }
  ];

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
                <FaHeadset className="text-purple-600" />
                <span className="text-purple-900 font-medium">Customer Support</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                We're Here to Help
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Our dedicated support team is available 24/7 to assist you with any questions or concerns. 
                Get the help you need, when you need it.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                How Can We Help You?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the support option that works best for you
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {supportOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 text-center"
                >
                  <div className={`w-16 h-16 bg-${option.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <option.icon className={`text-${option.color}-600 text-2xl`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">{option.contact}</p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <FaClock className="text-purple-600" />
                      <span>{option.hours}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Issues */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Common Issues & Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quick fixes for the most frequently encountered problems
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {commonIssues.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{category.category}</h3>
                  <div className="space-y-4">
                    {category.issues.map((issue, issueIndex) => (
                      <div key={issueIndex} className="bg-white p-4 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">{issue.title}</h4>
                        <p className="text-gray-600 text-sm">{issue.solution}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about QuickShow
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto space-y-8">
              {faqCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{category.title}</h3>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="bg-white p-6 rounded-2xl border border-gray-200">
                        <div className="flex items-start space-x-3">
                          <FaQuestionCircle className="text-purple-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                            <p className="text-gray-600">{faq.a}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Still Need Help?
                </h2>
                <p className="text-xl text-gray-600">
                  Send us a message and we'll get back to you as soon as possible
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe your issue in detail..."
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      We'll respond within 24 hours
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <PremiumFooter />
    </div>
  );
};

export default Support;
