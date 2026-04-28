import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserSecret, FaDatabase, FaEye, FaHandshake } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const PrivacyPolicy = () => {
  const lastUpdated = 'March 15, 2024';

  const sections = [
    {
      icon: FaUserSecret,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, make a booking, or contact us. This includes your name, email address, phone number, payment information, and preferences.'
    },
    {
      icon: FaDatabase,
      title: 'How We Use Your Information',
      content: 'We use your information to provide and improve our services, process bookings, send booking confirmations, communicate with you, personalize your experience, and analyze usage patterns to enhance our platform.'
    },
    {
      icon: FaLock,
      title: 'Data Security',
      content: 'We implement industry-standard security measures including SSL encryption, secure servers, regular security audits, and access controls to protect your personal information from unauthorized access.'
    },
    {
      icon: FaEye,
      title: 'Information Sharing',
      content: 'We do not sell your personal information. We only share information with cinema partners for booking fulfillment, payment processors for transactions, and when required by law or to protect our rights.'
    },
    {
      icon: FaShieldAlt,
      title: 'Your Rights',
      content: 'You have the right to access, update, delete, and port your personal information. You can also opt-out of marketing communications and manage your privacy settings in your account.'
    },
    {
      icon: FaHandshake,
      title: 'Children\'s Privacy',
      content: 'Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete it.'
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
                <FaShieldAlt className="text-purple-600" />
                <span className="text-purple-900 font-medium">Privacy Policy</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Your Privacy Matters
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                We're committed to protecting your personal information and being transparent 
                about how we collect, use, and share your data.
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

        {/* Privacy Overview */}
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
                  Our Privacy Commitment
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  At QuickShow, we believe that privacy is a fundamental right. We are committed 
                  to protecting your personal information and giving you control over how it's used. 
                  This privacy policy explains what information we collect, how we use it, and your 
                  rights regarding your data.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Detailed Sections */}
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

        {/* Detailed Policy Sections */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto space-y-16">
              {/* Information Collection */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Name, email address, phone number</li>
                      <li>• Date of birth (for age verification)</li>
                      <li>• Payment information (processed securely)</li>
                      <li>• Booking history and preferences</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Technical Information</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• IP address and device information</li>
                      <li>• Browser type and version</li>
                      <li>• Usage patterns and interactions</li>
                      <li>• Location data (with your consent)</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Data Usage */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <ul className="space-y-3 text-gray-600">
                    <li>• Process and fulfill your movie bookings</li>
                    <li>• Send booking confirmations and reminders</li>
                    <li>• Provide customer support and respond to inquiries</li>
                    <li>• Personalize your experience and recommendations</li>
                    <li>• Analyze usage patterns to improve our services</li>
                    <li>• Send marketing communications (with your consent)</li>
                    <li>• Detect and prevent fraud or abuse</li>
                    <li>• Comply with legal obligations</li>
                  </ul>
                </div>
              </motion.div>

              {/* Data Sharing */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing</h2>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-600 mb-4">
                    We may share your information in the following circumstances:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li>• <strong>Cinema Partners:</strong> To process your bookings</li>
                    <li>• <strong>Payment Processors:</strong> To handle transactions securely</li>
                    <li>• <strong>Service Providers:</strong> For analytics and customer support</li>
                    <li>• <strong>Legal Requirements:</strong> When required by law</li>
                    <li>• <strong>Business Transfers:</strong> In case of merger or acquisition</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    We never sell your personal information to third parties.
                  </p>
                </div>
              </motion.div>

              {/* Your Rights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <ul className="space-y-3 text-gray-600">
                    <li>• <strong>Access:</strong> Request a copy of your personal information</li>
                    <li>• <strong>Correction:</strong> Update inaccurate or incomplete information</li>
                    <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li>• <strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li>• <strong>Objection:</strong> Object to certain uses of your information</li>
                    <li>• <strong>Restriction:</strong> Limit processing of your information</li>
                  </ul>
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
                Questions About Your Privacy?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                If you have questions about this privacy policy or how we handle your information, 
                please contact our privacy team.
              </p>
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Privacy Contact</h3>
                    <p className="text-gray-600">privacy@quickshow.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h3>
                    <p className="text-gray-600">dpo@quickshow.com</p>
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

export default PrivacyPolicy;
