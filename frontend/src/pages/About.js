import React from 'react';
import { motion } from 'framer-motion';
import { FaFilm, FaUsers, FaAward, FaGlobe, FaHeart, FaRocket } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <PremiumNavbar />
      
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5"></div>
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="inline-flex items-center space-x-3 px-4 py-2 bg-purple-100 rounded-full">
                  <FaFilm className="text-purple-600" />
                  <span className="text-purple-900 font-medium">About QuickShow</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Revolutionizing Cinema Booking Since 2020
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  QuickShow is transforming the movie-going experience by bringing cinema lovers closer to their favorite films through innovative technology and exceptional service.
                </p>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <FaUsers className="text-purple-600 text-xl" />
                    <span className="text-gray-700 font-medium">5M+ Happy Customers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaGlobe className="text-purple-600 text-xl" />
                    <span className="text-gray-700 font-medium">500+ Cities</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaFilm className="text-purple-600 text-xl" />
                    <span className="text-gray-700 font-medium">10,000+ Screens</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative">
                  <div className="w-full h-96 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl flex items-center justify-center">
                    <FaRocket className="text-white text-8xl" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-30 blur-xl"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                  Our Mission: Making Cinema Accessible to Everyone
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We believe that great movies should be accessible to everyone, everywhere. Our mission is to bridge the gap between cinema lovers and their favorite movies through cutting-edge technology, seamless user experience, and unparalleled customer service.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  From blockbuster hits to indie gems, we're committed to bringing you the best cinema experience possible, right at your fingertips.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-2 gap-6"
              >
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-2xl shadow-lg border border-purple-200">
                  <FaHeart className="text-purple-600 text-3xl mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Customer First</h3>
                  <p className="text-gray-600">Your satisfaction is our top priority</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-2xl shadow-lg border border-blue-200">
                  <FaAward className="text-blue-600 text-3xl mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Award Winning</h3>
                  <p className="text-gray-600">Recognized for excellence in service</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-8 rounded-2xl shadow-lg border border-emerald-200">
                  <FaRocket className="text-green-600 text-3xl mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation Driven</h3>
                  <p className="text-gray-600">Always pushing boundaries</p>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-8 rounded-2xl shadow-lg border border-orange-200">
                  <FaGlobe className="text-orange-600 text-3xl mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
                  <p className="text-gray-600">Serving cinema lovers worldwide</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                QuickShow by the Numbers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're proud of our impact on the cinema industry and the communities we serve
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: '5M+', label: 'Active Users', color: 'purple' },
                { number: '50M+', label: 'Tickets Booked', color: 'blue' },
                { number: '1000+', label: 'Partner Cinemas', color: 'green' },
                { number: '99.9%', label: 'Uptime', color: 'orange' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-4xl lg:text-6xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Meet Our Leadership Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The passionate individuals driving QuickShow's mission forward
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'CEO & Founder',
                  image: 'https://picsum.photos/seed/sarah/300/300',
                  bio: 'Visionary leader with 15+ years in tech and entertainment'
                },
                {
                  name: 'Michael Rodriguez',
                  role: 'CTO',
                  image: 'https://picsum.photos/seed/michael/300/300',
                  bio: 'Tech innovator specializing in scalable cinema solutions'
                },
                {
                  name: 'Emily Johnson',
                  role: 'CFO',
                  image: 'https://picsum.photos/seed/emily/300/300',
                  bio: 'Financial strategist driving sustainable growth'
                },
                {
                  name: 'David Kim',
                  role: 'COO',
                  image: 'https://picsum.photos/seed/david/300/300',
                  bio: 'Operations expert ensuring seamless customer experiences'
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <FaUsers className="text-white text-sm" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
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

export default About;
