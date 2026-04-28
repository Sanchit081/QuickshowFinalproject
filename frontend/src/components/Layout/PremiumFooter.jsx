import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFilm,
  FaTicketAlt,
  FaShieldAlt,
  FaUsers,
  FaHeart
} from 'react-icons/fa';

const PremiumFooter = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Prevent default form submission
    console.log('Newsletter subscription - feature coming soon');
    // You can add actual newsletter logic here
  };

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Feedback', href: '/feedback' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Refund Policy', href: '/refund' },
      ]
    },
    {
      title: 'Connect',
      links: [
        { name: 'Facebook', href: 'https://facebook.com', icon: FaFacebook },
        { name: 'Twitter', href: 'https://twitter.com', icon: FaTwitter },
        { name: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
        { name: 'YouTube', href: 'https://youtube.com', icon: FaYoutube },
        { name: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedin },
      ]
    }
  ];

  const features = [
    { icon: FaFilm, title: 'HD Movies', description: 'Latest blockbusters in stunning HD' },
    { icon: FaTicketAlt, title: 'Easy Booking', description: 'Book tickets in seconds' },
    { icon: FaShieldAlt, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: FaUsers, title: 'Customer Support', description: '24/7 assistance' },
  ];

  return (
    <footer className="relative bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 border-b border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                >
                  <feature.icon className="text-white text-xl" />
                </motion.div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <FaFilm className="text-white text-xl" />
                </motion.div>
                <span className="text-2xl font-bold text-gray-900">QuickShow</span>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                Your premium cinema booking experience. Discover the latest movies, book tickets instantly, and enjoy unforgettable moments at the theater.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <FaEnvelope className="text-purple-600" />
                  <span>support@quickshow.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <FaPhone className="text-purple-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <FaMapMarkerAlt className="text-purple-600" />
                  <span>123 Cinema Street, Hollywood, CA 90028</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {footerSections[3].links.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {footerSections.slice(0, 3).map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                  >
                    <h3 className="text-gray-900 font-semibold text-lg mb-6">{section.title}</h3>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.href}
                            className="text-gray-600 hover:text-purple-600 transition-colors duration-300 flex items-center group"
                          >
                            <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                              {link.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-12 border-t border-gray-200"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-6">
              Get the latest movie updates, exclusive offers, and early access to tickets.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © {currentYear} QuickShow. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaHeart className="text-red-500" />
              </motion.div>
              <span>for movie lovers</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-600 text-sm">
              <Link to="/privacy" className="hover:text-purple-600 transition-colors duration-300">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-purple-600 transition-colors duration-300">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-purple-600 transition-colors duration-300">
                Cookies
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default PremiumFooter;
