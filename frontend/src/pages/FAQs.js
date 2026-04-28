import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaPlus, FaMinus, FaSearch, FaTicketAlt, FaUser, FaCreditCard, FaMobileAlt, FaShieldAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const FAQs = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories', icon: FaQuestionCircle, color: 'purple' },
    { id: 'booking', name: 'Booking & Tickets', icon: FaTicketAlt, color: 'blue' },
    { id: 'account', name: 'Account & Profile', icon: FaUser, color: 'green' },
    { id: 'payment', name: 'Payment & Billing', icon: FaCreditCard, color: 'orange' },
    { id: 'mobile', name: 'Mobile App', icon: FaMobileAlt, color: 'red' },
    { id: 'security', name: 'Security & Privacy', icon: FaShieldAlt, color: 'indigo' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'booking',
      question: 'How do I book movie tickets on QuickShow?',
      answer: 'Booking tickets is easy! Simply search for your preferred movie, select a showtime, choose your seats, and complete the payment process. You\'ll receive a confirmation email with your e-ticket.',
      helpful: 234
    },
    {
      id: 2,
      category: 'booking',
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Yes, you can cancel or reschedule your booking up to 2 hours before the showtime. Go to "My Bookings" in your profile, select the booking, and choose the cancel or reschedule option.',
      helpful: 189
    },
    {
      id: 3,
      category: 'booking',
      question: 'How do I select my seats?',
      answer: 'During the booking process, you\'ll see an interactive seating chart. Click on available seats to select them, and they\'ll be highlighted. You can see the seat numbers and pricing before confirming.',
      helpful: 156
    },
    {
      id: 4,
      category: 'booking',
      question: 'What if my preferred seats are not available?',
      answer: 'If your preferred seats are taken, you can choose from other available seats or select a different showtime. Our system shows real-time seat availability.',
      helpful: 98
    },
    {
      id: 5,
      category: 'account',
      question: 'How do I create a QuickShow account?',
      answer: 'Click the "Sign Up" button on our homepage or app. Enter your email, create a password, and fill in your basic information. You\'ll receive a confirmation email to verify your account.',
      helpful: 267
    },
    {
      id: 6,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
      helpful: 198
    },
    {
      id: 7,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Log in to your account, go to "Profile Settings," and you can update your name, email, phone number, and other personal information. Don\'t forget to save your changes!',
      helpful: 145
    },
    {
      id: 8,
      category: 'account',
      question: 'Can I delete my QuickShow account?',
      answer: 'Yes, you can delete your account from "Profile Settings." Please note that this action is permanent and will remove all your booking history and saved preferences.',
      helpful: 67
    },
    {
      id: 9,
      category: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, Apple Pay, Google Pay, and various digital wallets.',
      helpful: 312
    },
    {
      id: 10,
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Absolutely! We use industry-standard SSL encryption to protect your payment information. We are PCI DSS compliant and never store your card details on our servers.',
      helpful: 289
    },
    {
      id: 11,
      category: 'payment',
      question: 'How do I get a refund?',
      answer: 'Refunds are processed according to our refund policy. For eligible bookings, go to "My Bookings" and request a refund. Refunds typically take 5-7 business days to process.',
      helpful: 176
    },
    {
      id: 12,
      category: 'payment',
      question: 'Can I use gift cards or promo codes?',
      answer: 'Yes! You can apply gift cards and promo codes during the payment process. Enter the code in the designated field to see your discount applied.',
      helpful: 134
    },
    {
      id: 13,
      category: 'mobile',
      question: 'Is there a QuickShow mobile app?',
      answer: 'Yes! QuickShow is available for both iOS and Android. Download it from the App Store or Google Play Store for the best mobile experience.',
      helpful: 245
    },
    {
      id: 14,
      category: 'mobile',
      question: 'How do I download my tickets on the mobile app?',
      answer: 'Your tickets are automatically available in the app. Go to "My Bookings," select your booking, and you can view or download your e-ticket. You can also add it to your wallet app.',
      helpful: 189
    },
    {
      id: 15,
      category: 'mobile',
      question: 'Does the mobile app support all features?',
      answer: 'Yes! The mobile app supports all features including booking, seat selection, payment, and profile management. Some advanced features may be easier on the desktop version.',
      helpful: 156
    },
    {
      id: 16,
      category: 'security',
      question: 'How does QuickShow protect my personal information?',
      answer: 'We use advanced encryption, secure servers, and strict data protection policies. Your information is never shared with third parties without your consent, except as required by law.',
      helpful: 267
    },
    {
      id: 17,
      category: 'security',
      question: 'Is QuickShow safe for children to use?',
      answer: 'QuickShow is designed for users 13 and above. We recommend parental supervision for minors and have implemented safety measures to protect young users.',
      helpful: 98
    },
    {
      id: 18,
      category: 'security',
      question: 'How can I report suspicious activity?',
      answer: 'If you notice any suspicious activity on your account, contact our security team immediately at security@quickshow.com or use the "Report Issue" feature in the app.',
      helpful: 76
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
                <FaQuestionCircle className="text-purple-600" />
                <span className="text-purple-900 font-medium">Frequently Asked Questions</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                How Can We Help You?
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Find answers to common questions about QuickShow. Can't find what you're looking for? 
                Our support team is here to help.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pr-12 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-purple-600 hover:text-purple-700">
                    <FaSearch className="text-xl" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? `bg-${category.color}-600 text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="inline mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <FaQuestionCircle className="text-gray-400 text-5xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse all categories</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <FaQuestionCircle className="text-purple-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-900">{faq.question}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">{faq.helpful} found helpful</span>
                          {expandedFAQ === faq.id ? (
                            <FaMinus className="text-purple-600" />
                          ) : (
                            <FaPlus className="text-purple-600" />
                          )}
                        </div>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-4"
                        >
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Was this helpful? {faq.helpful} people found this helpful
                            </span>
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                                Yes
                              </button>
                              <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                                No
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Popular Topics */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Popular Topics
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quick links to the most frequently asked questions
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: FaTicketAlt, title: 'Booking Process', count: 15 },
                { icon: FaCreditCard, title: 'Payment Issues', count: 12 },
                { icon: FaUser, title: 'Account Setup', count: 10 },
                { icon: FaMobileAlt, title: 'Mobile App Help', count: 8 },
                { icon: FaShieldAlt, title: 'Security Concerns', count: 6 },
                { icon: FaCalendarAlt, title: 'Showtimes & Schedule', count: 9 }
              ].map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <topic.icon className="text-purple-600 text-xl" />
                    <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{topic.count} articles</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="bg-purple-50 p-12 rounded-3xl">
                <FaQuestionCircle className="text-purple-600 text-5xl mx-auto mb-6" />
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Can't find the answer you're looking for? Our support team is here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium">
                    Contact Support
                  </button>
                  <button className="px-6 py-3 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-300 font-medium">
                    Browse Help Center
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <PremiumFooter />
    </div>
  );
};

export default FAQs;
