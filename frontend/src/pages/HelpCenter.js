import React from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaSearch, FaBook, FaVideo, FaHeadset, FaTools, FaShieldAlt, FaCreditCard, FaTicketAlt, FaUser, FaLock, FaMobileAlt, FaDesktop } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const HelpCenter = () => {
  const helpCategories = [
    {
      icon: FaTicketAlt,
      title: 'Booking & Tickets',
      description: 'Everything about booking tickets, selecting seats, and managing your reservations',
      color: 'purple',
      articles: 24
    },
    {
      icon: FaUser,
      title: 'Account Management',
      description: 'Profile settings, password changes, and account security',
      color: 'blue',
      articles: 18
    },
    {
      icon: FaCreditCard,
      title: 'Payment & Billing',
      description: 'Payment methods, refunds, and billing inquiries',
      color: 'green',
      articles: 15
    },
    {
      icon: FaMobileAlt,
      title: 'Mobile App',
      description: 'Using QuickShow on your mobile device',
      color: 'orange',
      articles: 12
    },
    {
      icon: FaShieldAlt,
      title: 'Security & Privacy',
      description: 'How we protect your data and privacy',
      color: 'red',
      articles: 8
    },
    {
      icon: FaTools,
      title: 'Technical Support',
      description: 'Troubleshooting and technical issues',
      color: 'indigo',
      articles: 20
    }
  ];

  const popularArticles = [
    {
      title: 'How to Book Movie Tickets',
      category: 'Booking & Tickets',
      views: 15420,
      helpful: 1423
    },
    {
      title: 'Reset Your Password',
      category: 'Account Management',
      views: 12350,
      helpful: 1156
    },
    {
      title: 'Payment Methods Accepted',
      category: 'Payment & Billing',
      views: 10890,
      helpful: 987
    },
    {
      title: 'Cancel Your Booking',
      category: 'Booking & Tickets',
      views: 9876,
      helpful: 876
    },
    {
      title: 'Download Mobile App',
      category: 'Mobile App',
      views: 8765,
      helpful: 765
    },
    {
      title: 'Update Profile Information',
      category: 'Account Management',
      views: 7654,
      helpful: 654
    }
  ];

  const videoTutorials = [
    {
      title: 'Getting Started with QuickShow',
      duration: '3:45',
      thumbnail: 'https://picsum.photos/seed/video1/320/180',
      views: 45678
    },
    {
      title: 'How to Book Your First Movie',
      duration: '2:30',
      thumbnail: 'https://picsum.photos/seed/video2/320/180',
      views: 34256
    },
    {
      title: 'Using the Mobile App',
      duration: '4:15',
      thumbnail: 'https://picsum.photos/seed/video3/320/180',
      views: 28907
    },
    {
      title: 'Managing Your Account',
      duration: '3:20',
      thumbnail: 'https://picsum.photos/seed/video4/320/180',
      views: 23456
    }
  ];

  const quickGuides = [
    {
      icon: FaTicketAlt,
      title: 'Complete Booking Guide',
      description: 'Step-by-step guide to booking movie tickets',
      time: '5 min read'
    },
    {
      icon: FaUser,
      title: 'Account Setup Guide',
      description: 'Create and configure your QuickShow account',
      time: '3 min read'
    },
    {
      icon: FaMobileAlt,
      title: 'Mobile App Guide',
      description: 'Get started with the QuickShow mobile app',
      time: '4 min read'
    },
    {
      icon: FaCreditCard,
      title: 'Payment Setup Guide',
      description: 'Add and manage payment methods',
      time: '2 min read'
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
                <FaQuestionCircle className="text-purple-600" />
                <span className="text-purple-900 font-medium">Help Center</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                How Can We Help You Today?
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Find answers to your questions, learn how to use QuickShow features, and get the most out of your cinema experience.
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
                    placeholder="Search for help articles, videos, or guides..."
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

        {/* Help Categories */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Browse Help Categories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find the help you need by exploring our organized categories
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {helpCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-${category.color}-100 rounded-full flex items-center justify-center mb-4`}>
                    <category.icon className={`text-${category.color}-600 text-2xl`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{category.articles} articles</span>
                    <span className="text-purple-600 hover:text-purple-700 font-medium">
                      Explore →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Popular Help Articles
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The most viewed and helpful articles from our help center
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaBook className="text-purple-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span>{article.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">{article.helpful.toLocaleString()} found this helpful</span>
                        <button className="text-purple-600 hover:text-purple-700 font-medium">
                          Read →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Video Tutorials
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Watch step-by-step video guides to learn QuickShow features
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoTutorials.map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative mb-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <FaVideo className="text-purple-600 text-xl ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-500">{video.views.toLocaleString()} views</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Guides */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Quick Guides
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started quickly with our step-by-step guides
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickGuides.map((guide, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <guide.icon className="text-purple-600 text-2xl mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{guide.time}</span>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      Start →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="bg-purple-50 p-12 rounded-3xl">
                <FaHeadset className="text-purple-600 text-5xl mx-auto mb-6" />
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Still Need Help?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our support team is available 24/7 to help you with any questions or issues
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium">
                    Contact Support
                  </button>
                  <button className="px-6 py-3 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-300 font-medium">
                    Live Chat
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

export default HelpCenter;
