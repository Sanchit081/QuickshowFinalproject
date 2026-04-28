import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaBuilding, FaUsers, FaHeadset, FaPaperPlane } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const ContactUs = () => {
  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email Support',
      value: 'support@quickshow.com',
      description: 'Get help via email - we respond within 24 hours',
      color: 'purple'
    },
    {
      icon: FaPhone,
      title: 'Phone Support',
      value: '1-800-QUICKSHOW',
      description: 'Call us for immediate assistance',
      color: 'blue'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Headquarters',
      value: '123 Cinema Street, Hollywood, CA 90028',
      description: 'Visit our main office',
      color: 'green'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      value: '24/7 Support Available',
      description: 'We\'re always here to help',
      color: 'orange'
    }
  ];

  const offices = [
    {
      city: 'Hollywood, CA',
      address: '123 Cinema Street, Hollywood, CA 90028',
      phone: '+1 (555) 123-4567',
      email: 'hollywood@quickshow.com',
      image: 'https://picsum.photos/seed/office1/400/300'
    },
    {
      city: 'New York, NY',
      address: '456 Broadway, New York, NY 10013',
      phone: '+1 (555) 987-6543',
      email: 'newyork@quickshow.com',
      image: 'https://picsum.photos/seed/office2/400/300'
    },
    {
      city: 'Chicago, IL',
      address: '789 Michigan Ave, Chicago, IL 60611',
      phone: '+1 (555) 456-7890',
      email: 'chicago@quickshow.com',
      image: 'https://picsum.photos/seed/office3/400/300'
    },
    {
      city: 'San Francisco, CA',
      address: '321 Market St, San Francisco, CA 94105',
      phone: '+1 (555) 234-5678',
      email: 'sanfrancisco@quickshow.com',
      image: 'https://picsum.photos/seed/office4/400/300'
    }
  ];

  const teamContacts = [
    {
      name: 'Customer Support',
      email: 'support@quickshow.com',
      phone: '1-800-QUICKSHOW',
      description: 'General inquiries, booking issues, account help'
    },
    {
      name: 'Partnerships',
      email: 'partnerships@quickshow.com',
      phone: '+1 (555) 111-2222',
      description: 'Cinema partnerships, business collaborations'
    },
    {
      name: 'Press & Media',
      email: 'media@quickshow.com',
      phone: '+1 (555) 333-4444',
      description: 'Press inquiries, interview requests'
    },
    {
      name: 'Technical Support',
      email: 'tech@quickshow.com',
      phone: '+1 (555) 555-6666',
      description: 'App issues, website problems, technical assistance'
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
                <FaEnvelope className="text-purple-600" />
                <span className="text-purple-900 font-medium">Contact Us</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Get in Touch
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                We're here to help! Whether you have questions, feedback, or need support, 
                our team is ready to assist you every step of the way.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Ways to Reach Us
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the method that works best for you
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 bg-${info.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <info.icon className={`text-${info.color}-600 text-2xl`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-900 font-medium mb-1">{info.value}</p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
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
                  Send Us a Message
                </h2>
                <p className="text-xl text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Customer Support</option>
                      <option>Partnerships</option>
                      <option>Press & Media</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={6}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="text-red-500">*</span> Required fields
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-purple-600 text-gray-800 rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium flex items-center space-x-2"
                    >
                      <FaPaperPlane />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Contacts */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Department Contacts
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Reach out to the right team for faster assistance
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {teamContacts.map((team, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaUsers className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                      <p className="text-gray-600 text-sm">{team.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-purple-600" />
                      <span className="text-gray-700">{team.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-purple-600" />
                      <span className="text-gray-700">{team.phone}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Our Office Locations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Visit us at one of our offices worldwide
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {offices.map((office, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={office.image}
                    alt={office.city}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{office.city}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <FaMapMarkerAlt className="text-purple-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{office.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaPhone className="text-purple-600" />
                        <span className="text-gray-600">{office.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaEnvelope className="text-purple-600" />
                        <span className="text-gray-600">{office.email}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-red-50 p-8 rounded-2xl border border-red-200">
                <div className="text-center">
                  <FaHeadset className="text-red-600 text-4xl mx-auto mb-4" />
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Emergency Support
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    For urgent matters related to existing bookings or account security
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-red-600" />
                      <span className="font-bold text-gray-900">1-800-URGENT-QS</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-red-600" />
                      <span className="font-bold text-gray-900">urgent@quickshow.com</span>
                    </div>
                  </div>
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

export default ContactUs;
