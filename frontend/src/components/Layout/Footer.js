import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="glass mt-auto border-t border-apple-hairline">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-apple-primary mb-4">🎬 QuickShow</h3>
            <p className="text-apple-secondary mb-4">
              Your one-stop destination for movie tickets and event bookings.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-apple-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/movies" className="text-apple-secondary hover:text-apple-primary transition-colors">Movies</Link></li>
              <li><Link to="/events" className="text-apple-secondary hover:text-apple-primary transition-colors">Events</Link></li>
              <li><Link to="/bookings" className="text-apple-secondary hover:text-apple-primary transition-colors">My Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-apple-primary">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/search" className="text-apple-secondary hover:text-apple-primary transition-colors">Help Center</Link></li>
              <li><Link to="/profile" className="text-apple-secondary hover:text-apple-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/signup" className="text-apple-secondary hover:text-apple-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-apple-primary">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-apple-secondary hover:text-apple-primary transition-colors"><FiFacebook size={24} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-apple-secondary hover:text-apple-primary transition-colors"><FiTwitter size={24} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-apple-secondary hover:text-apple-primary transition-colors"><FiInstagram size={24} /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-apple-secondary hover:text-apple-primary transition-colors"><FiYoutube size={24} /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-apple-hairline mt-8 pt-8 text-center text-apple-muted">
        <p>&copy; 2024 QuickShow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

