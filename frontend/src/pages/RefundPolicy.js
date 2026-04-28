import React from 'react';
import { motion } from 'framer-motion';
import {FaCreditCard, FaClock, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaMoneyBillWave, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const RefundPolicy = () => {
  const lastUpdated = 'March 15, 2024';

  const refundScenarios = [
    {
      title: 'Standard Cancellation',
      timeframe: 'More than 2 hours before showtime',
      refund: 'Full refund',
      fee: 'No cancellation fee',
      icon: FaCheckCircle,
      color: 'green'
    },
    {
      title: 'Late Cancellation',
      timeframe: 'Less than 2 hours before showtime',
      refund: 'No refund',
      fee: 'Full amount charged',
      icon: FaTimesCircle,
      color: 'red'
    },
    {
      title: 'Show Cancellation',
      timeframe: 'Cinema cancels the show',
      refund: 'Full refund',
      fee: 'No charges',
      icon: FaCheckCircle,
      color: 'green'
    },
    {
      title: 'Technical Issues',
      timeframe: 'Booking system errors',
      refund: 'Full refund',
      fee: 'No charges',
      icon: FaCheckCircle,
      color: 'green'
    }
  ];

  const refundProcess = [
    {
      step: 1,
      title: 'Go to My Bookings',
      description: 'Log in to your account and navigate to "My Bookings" section'
    },
    {
      step: 2,
      title: 'Select Booking',
      description: 'Find the booking you want to cancel and click on it'
    },
    {
      step: 3,
      title: 'Request Cancellation',
      description: 'Click the "Cancel Booking" button and confirm your choice'
    },
    {
      step: 4,
      title: 'Receive Confirmation',
      description: 'Get instant confirmation and refund details via email'
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
                <FaMoneyBillWave className="text-purple-600" />
                <span className="text-purple-900 font-medium">Refund Policy</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Fair & Transparent Refunds
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Our refund policy is designed to be fair and transparent. 
                Learn about our cancellation terms, refund process, and exceptions.
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

        {/* Refund Overview */}
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
                  Our Refund Commitment
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We understand that plans change. That's why we've created a refund policy 
                  that balances flexibility with fairness to both customers and our cinema partners. 
                  Our policy is designed to be clear, transparent, and easy to understand.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Refund Scenarios */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Refund Scenarios
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Different situations have different refund policies
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {refundScenarios.map((scenario, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 bg-${scenario.color}-100 rounded-full flex items-center justify-center`}>
                      <scenario.icon className={`text-${scenario.color}-600 text-xl`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{scenario.title}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-purple-600" />
                      <span className="text-gray-600">{scenario.timeframe}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaMoneyBillWave className="text-purple-600" />
                      <span className="text-gray-600">{scenario.refund}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCreditCard className="text-purple-600" />
                      <span className="text-gray-600">{scenario.fee}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund Process */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                How to Request a Refund
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple 4-step process to cancel your booking and get a refund
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {refundProcess.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-purple-600">{step.step}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Policy */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              {/* Cancellation Policy */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cancellation Policy</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaCheckCircle className="text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Standard Cancellation</h3>
                      <p className="text-gray-600">
                        Cancel your booking up to 2 hours before showtime for a full refund. 
                        No cancellation fees apply.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaTimesCircle className="text-red-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Late Cancellation</h3>
                      <p className="text-gray-600">
                        Cancellations less than 2 hours before showtime are not eligible for refunds.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaInfoCircle className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">No-Show Policy</h3>
                      <p className="text-gray-600">
                        If you don't arrive for your booking, no refund will be provided.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Timeline */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Timeline</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
                      <p className="text-gray-600">
                        Refunds are typically processed within 5-7 business days.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCreditCard className="text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Refund Method</h3>
                      <p className="text-gray-600">
                        Refunds are issued to the original payment method used for booking.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Confirmation</h3>
                      <p className="text-gray-600">
                        You'll receive email confirmation when your refund is processed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exceptions */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Exceptions & Special Cases</h2>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Cinema Cancellations</h3>
                    <p className="text-gray-600">
                      If the cinema cancels the show, you'll receive a full refund automatically.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Technical Issues</h3>
                    <p className="text-gray-600">
                      Full refunds for booking system errors or payment processing issues.
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Medical Emergencies</h3>
                    <p className="text-gray-600">
                      Contact support for medical emergency exceptions (documentation required).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need Help with Refunds?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our support team is here to help you with any refund-related questions.
              </p>
              
              <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
                    <p className="text-gray-600">support@quickshow.com</p>
                    <p className="text-gray-600">1-800-QUICKSHOW</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Refund Department</h3>
                    <p className="text-gray-600">refunds@quickshow.com</p>
                    <p className="text-gray-600">Response within 24 hours</p>
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

export default RefundPolicy;
