import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract, FaUserCheck, FaCreditCard, FaShieldAlt, FaGavel, FaBalanceScale } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const TermsOfService = () => {
  const lastUpdated = 'March 15, 2024';

  const sections = [
    {
      icon: FaUserCheck,
      title: 'Acceptance of Terms',
      content: 'By using QuickShow, you agree to these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users of our platform.'
    },
    {
      icon: FaFileContract,
      title: 'Service Description',
      content: 'QuickShow is a cinema booking platform that allows users to browse movies, select showtimes, choose seats, and purchase tickets for participating cinemas. We act as an intermediary between users and cinema partners.'
    },
    {
      icon: FaCreditCard,
      title: 'Payment Terms',
      content: 'All payments are processed securely through our payment partners. Prices are displayed in your local currency and include all applicable taxes. Refunds are subject to our refund policy and cinema partner terms.'
    },
    {
      icon: FaShieldAlt,
      title: 'User Responsibilities',
      content: 'Users must provide accurate information, maintain account security, and use our services responsibly. Prohibited activities include fraud, harassment, copyright infringement, and violation of applicable laws.'
    },
    {
      icon: FaGavel,
      title: 'Intellectual Property',
      content: 'All content on QuickShow, including movie information, images, and trademarks, is owned by us or our partners and is protected by intellectual property laws.'
    },
    {
      icon: FaBalanceScale,
      title: 'Limitation of Liability',
      content: 'QuickShow is not liable for any damages arising from your use of our services, including but not limited to direct, indirect, or consequential damages.'
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
                <FaFileContract className="text-purple-600" />
                <span className="text-purple-900 font-medium">Terms of Service</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Terms of Service
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                These terms govern your use of QuickShow's cinema booking platform. 
                By using our services, you agree to these terms and conditions.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-sm text-gray-500"
              >
                Last updated: {lastUpdated}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Terms Overview */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200 mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Terms & Your Rights
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Service ("Terms") govern your access to and use of QuickShow, 
                  including any content, functionality, and services offered on or through our website 
                  and mobile applications. Please read these Terms carefully before using our services.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Sections */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <section.icon className="text-purple-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Terms */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto space-y-16">
              {/* Account Terms */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Terms</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Account Registration</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• You must be at least 13 years old to create an account</li>
                      <li>• You must provide accurate and complete information</li>
                      <li>• You are responsible for maintaining account security</li>
                      <li>• You may not share your account credentials</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Account Suspension</h3>
                    <p className="text-gray-600">
                      We reserve the right to suspend or terminate accounts that violate these terms 
                      or engage in prohibited activities. We will provide notice of suspension when possible.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Booking Terms */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking & Payment Terms</h2>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <ul className="space-y-3 text-gray-600">
                    <li>• <strong>Booking Confirmation:</strong> Bookings are confirmed upon successful payment</li>
                    <li>• <strong>Payment Processing:</strong> All payments are processed securely</li>
                    <li>• <strong>Price Changes:</strong> Prices may change without notice</li>
                    <li>• <strong>Ticket Validity:</strong> Tickets are valid only for the specified showtime</li>
                    <li>• <strong>Cancellation Policy:</strong> Cancellations are subject to cinema partner policies</li>
                    <li>• <strong>Refund Policy:</strong> Refunds are processed according to our refund policy</li>
                  </ul>
                </div>
              </motion.div>

              {/* User Conduct */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">User Conduct</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Using the service for illegal or unauthorized purposes</li>
                      <li>• Interfering with or disrupting the service</li>
                      <li>• Attempting to gain unauthorized access to our systems</li>
                      <li>• Harassing or abusing other users or staff</li>
                      <li>• Sharing false or misleading information</li>
                      <li>• Violating intellectual property rights</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Content Standards</h3>
                    <p className="text-gray-600">
                      Users must not post or share content that is offensive, illegal, or violates 
                      the rights of others. We reserve the right to remove such content.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Intellectual Property */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <ul className="space-y-3 text-gray-600">
                    <li>• <strong>QuickShow Content:</strong> All QuickShow content is protected by copyright</li>
                    <li>• <strong>Movie Information:</strong> Movie data is provided by our partners</li>
                    <li>• <strong>User Content:</strong> You retain rights to content you post</li>
                    <li>• <strong>Limited License:</strong> You grant us a license to use your content</li>
                    <li>• <strong>Trademarks:</strong> QuickShow and related marks are our trademarks</li>
                  </ul>
                </div>
              </motion.div>

              {/* Limitation of Liability */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-600 mb-4">
                    To the fullest extent permitted by law, QuickShow shall not be liable for any 
                    indirect, incidental, special, or consequential damages arising from your use of 
                    our services.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Service availability and performance</li>
                    <li>• Third-party content or services</li>
                    <li>• User conduct or content</li>
                    <li>• Technical issues or errors</li>
                  </ul>
                </div>
              </motion.div>

              {/* Termination */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Termination</h2>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-600 mb-4">
                    We may terminate or suspend your account and access to our services at any time, 
                    with or without cause, with or without notice.
                  </p>
                  <p className="text-gray-600">
                    Upon termination, your right to use the services ceases immediately. 
                    Certain provisions of these terms shall survive termination.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions About Our Terms?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                If you have questions about these Terms of Service, please contact our legal team.
              </p>
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Legal Department</h3>
                    <p className="text-gray-600">legal@quickshow.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Support Team</h3>
                    <p className="text-gray-600">support@quickshow.com</p>
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

export default TermsOfService;
