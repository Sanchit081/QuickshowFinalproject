import React from 'react';
import { motion } from 'framer-motion';
import { FaCookie, FaShieldAlt, FaEye, FaCog, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const CookiePolicy = () => {
  const lastUpdated = 'March 15, 2024';

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      required: true,
      description: 'These cookies are necessary for the website to function and cannot be disabled.',
      examples: ['Authentication', 'Security', 'Load balancing']
    },
    {
      name: 'Performance Cookies',
      required: false,
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: ['Analytics', 'Performance monitoring', 'User behavior tracking']
    },
    {
      name: 'Functional Cookies',
      required: false,
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: ['Language preferences', 'Remembered settings', 'Personalized content']
    },
    {
      name: 'Marketing Cookies',
      required: false,
      description: 'These cookies are used to deliver advertisements relevant to you.',
      examples: ['Targeted ads', 'Social media integration', 'Cross-site tracking']
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
                <FaCookie className="text-purple-600" />
                <span className="text-purple-900 font-medium">Cookie Policy</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Cookie Policy
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Learn about how QuickShow uses cookies to enhance your experience and 
                protect your privacy while using our cinema booking platform.
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

        {/* Cookie Overview */}
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
                  What Are Cookies?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Cookies are small text files stored on your device when you visit websites. 
                  They help us remember your preferences, understand how you use our site, and 
                  provide personalized experiences. This policy explains how we use cookies 
                  and your choices regarding them.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cookie Types */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Types of Cookies We Use
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We use different types of cookies for various purposes
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{cookie.name}</h3>
                    {cookie.required ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <FaCheckCircle className="text-sm" />
                        <span className="text-sm font-medium">Required</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-400">
                        <FaCog className="text-sm" />
                        <span className="text-sm font-medium">Optional</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{cookie.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Examples:</h4>
                    <ul className="space-y-1">
                      {cookie.examples.map((example, i) => (
                        <li key={i} className="text-sm text-gray-600">• {example}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Use Cookies */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">How We Use Cookies</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaEye className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Analytics & Performance</h3>
                      <p className="text-gray-600 text-sm">
                        We use cookies to understand how visitors interact with our website, 
                        which helps us improve our services and user experience.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCog className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Personalization</h3>
                      <p className="text-gray-600 text-sm">
                        Cookies help us remember your preferences and provide personalized 
                        content, such as your favorite genres or cinema locations.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaShieldAlt className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                      <p className="text-gray-600 text-sm">
                        Essential cookies help protect your account and prevent unauthorized 
                        access to your personal information.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCookie className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Marketing</h3>
                      <p className="text-gray-600 text-sm">
                        We use marketing cookies to show you relevant advertisements and 
                        measure the effectiveness of our marketing campaigns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Managing Your Cookie Preferences</h2>
              
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Cookie Consent Banner</h3>
                  <p className="text-gray-600 mb-4">
                    When you first visit QuickShow, you'll see a cookie consent banner where you can:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Accept all cookies</li>
                    <li>• Reject non-essential cookies</li>
                    <li>• Customize your cookie preferences</li>
                  </ul>
                </div>
                
                <div className="bg-white p-8 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Browser Settings</h3>
                  <p className="text-gray-600 mb-4">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Block all cookies</li>
                    <li>• Allow only first-party cookies</li>
                    <li>• Delete existing cookies</li>
                    <li>• Set notifications when cookies are stored</li>
                  </ul>
                  <p className="text-gray-600 mt-4 text-sm">
                    Note: Blocking essential cookies may affect your ability to use our services.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Third-Party Cookies</h2>
              
              <div className="bg-gray-50 p-8 rounded-2xl">
                <p className="text-gray-600 mb-6">
                  We use third-party services that may place cookies on your device:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Processors</h4>
                    <p className="text-gray-600 text-sm">
                      Secure payment processing partners (Stripe, PayPal) use cookies for transaction security.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Analytics Services</h4>
                    <p className="text-gray-600 text-sm">
                      Google Analytics and similar services help us understand website usage patterns.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
                    <p className="text-gray-600 text-sm">
                      Social media platforms may place cookies when you use their features on our site.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Updates & Contact */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions About Cookies?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                If you have questions about our cookie policy or how we use cookies, 
                please contact our privacy team.
              </p>
              
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Privacy Contact</h3>
                    <p className="text-gray-600">privacy@quickshow.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Technical Support</h3>
                    <p className="text-gray-600">support@quickshow.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-sm text-gray-500">
                <p>This policy may be updated from time to time. We will notify you of significant changes.</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <PremiumFooter />
    </div>
  );
};

export default CookiePolicy;
