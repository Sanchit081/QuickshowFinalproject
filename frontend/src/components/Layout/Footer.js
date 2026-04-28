import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="glass mt-auto border-t border-apple-hairline">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-black mb-4">🎬 QuickShow</h3>
            <p className="text-gray-700 mb-4">
              Your one-stop destination for movie tickets and event bookings.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-black">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/movies" className="text-gray-700 hover:text-black transition-colors">Movies</Link></li>
              <li><Link to="/events" className="text-gray-700 hover:text-black transition-colors">Events</Link></li>
              <li><Link to="/bookings" className="text-gray-700 hover:text-black transition-colors">My Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-black">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/search" className="text-gray-700 hover:text-black transition-colors">Help Center</Link></li>
              <li><Link to="/profile" className="text-gray-700 hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link to="/signup" className="text-gray-700 hover:text-black transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-black">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-700 hover:text-black transition-colors"><FiFacebook size={24} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-700 hover:text-black transition-colors"><FiTwitter size={24} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-700 hover:text-black transition-colors"><FiInstagram size={24} /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-gray-700 hover:text-black transition-colors"><FiYoutube size={24} /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-apple-hairline mt-8 pt-8 text-center text-gray-600">
        <p>&copy; 2024 QuickShow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

