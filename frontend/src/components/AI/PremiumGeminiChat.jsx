import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaMagic, FaFilm, FaHeart, FaStar, FaCrown, FaGem } from 'react-icons/fa';
import axios from 'axios';

const PremiumGeminiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Premium welcome message
      setMessages([
        {
          type: 'bot',
          text: "Welcome to your exclusive AI Cinema Concierge! I'm here to provide personalized movie recommendations, help you discover hidden gems, and create the perfect cinematic experience just for you.",
          suggestions: ["What's trending in premium cinema?", "Find award-winning movies", "Surprise me with something special", "Movies like Inception"],
          isPremium: true
        }
      ]);
      
      // Premium quick actions
      setQuickActions([
        { text: "Premium Picks", icon: FaCrown, prompt: "Show me your premium movie recommendations", variant: 'gold' },
        { text: "Award Winners", icon: FaGem, prompt: "Find award-winning and critically acclaimed movies", variant: 'platinum' },
        { text: "Hidden Gems", icon: FaMagic, prompt: "Surprise me with exceptional hidden gems", variant: 'cosmic' },
        { text: "Date Night", icon: FaHeart, prompt: "Suggest perfect movies for a romantic evening", variant: 'default' }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: 'user',
      text: messageText,
      timestamp: new Date(),
      isPremium: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/gemini/chat`,
        {
          message: messageText,
          context: {
            previousMessages: messages.slice(-5),
            timestamp: new Date().toISOString(),
            isPremium: true
          }
        }
      );

      const botMessage = {
        type: 'bot',
        text: response.data.response,
        suggestions: response.data.suggestions || [],
        movieRecommendations: response.data.movieRecommendations || [],
        timestamp: new Date(),
        isPremium: true
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Premium Gemini Chat Error:', error);
      
      // Premium fallback response
      const fallbackMessage = {
        type: 'bot',
        text: "I apologize for the momentary delay. As your cinema concierge, let me suggest some exceptional films that are currently captivating audiences:",
        suggestions: ["Show me premium picks", "Find award-winning films", "Discover hidden gems"],
        movieRecommendations: [],
        timestamp: new Date(),
        isPremium: true
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action.prompt);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 right-12 w-24 h-24 rounded-full luxury-card-gold border-luxury flex items-center justify-center z-[60] glow-luxury group"
      >
        <div className="text-center">
          <FaRobot className="text-3xl text-gradient-gold mb-1" />
          <span className="text-xs font-bold text-gradient-gold">AI</span>
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-400 rounded-full animate-pulse border-3 border-white shadow-lg" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-yellow-400/30"
        />
        <div className="absolute -bottom-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-white luxury-card-gold px-3 py-2 rounded-full text-gradient-gold">
            Premium AI
          </span>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50, rotate: 5 }}
      className="fixed bottom-12 right-12 w-[420px] h-[700px] luxury-card-gold border-luxury rounded-3xl shadow-2xl z-[60] flex flex-col glow-luxury"
    >
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-yellow-400/20 to-purple-400/20 text-white p-6 rounded-t-3xl border-b border-yellow-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaRobot className="text-3xl text-gradient-gold" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 text-3xl opacity-30"
              >
                <FaRobot className="text-gradient-gold" />
              </motion.div>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gradient-gold">AI Cinema Concierge</h3>
              <p className="text-xs opacity-90 flex items-center space-x-2">
                <span>Powered by Gemini</span>
                <FaCrown className="text-yellow-400 text-xs" />
                <span>Premium</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
      </div>

      {/* Enhanced Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white luxury-card-platinum'
                    : 'luxury-card-gold border-luxury text-white'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                
                {/* Enhanced Movie Recommendations */}
                {message.movieRecommendations && message.movieRecommendations.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.movieRecommendations.map((movie, idx) => (
                      <div key={idx} className="luxury-card-platinum border-platinum p-3 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <img src={movie.poster} alt={movie.title} className="w-12 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gradient-platinum">{movie.title}</p>
                            <p className="text-xs opacity-75">{movie.genres?.join(', ')}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <FaStar className="text-yellow-400 text-xs" />
                              <span className="text-xs">{movie.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Enhanced Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(suggestion)}
                        className="text-xs px-3 py-2 rounded-full luxury-card-platinum border-platinum hover:scale-105 transition-transform text-gradient-platinum"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
                  <p className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {message.isPremium && (
                    <div className="flex items-center space-x-1">
                      <FaCrown className="text-yellow-400 text-xs" />
                      <span className="text-xs text-yellow-400">Premium</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="luxury-card-gold border-luxury p-4 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-400 mb-4 font-medium">Premium Quick Actions:</p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className={`flex items-center space-x-2 text-xs p-3 rounded-xl transition-all hover:scale-105 ${
                  action.variant === 'gold' 
                    ? 'luxury-card-gold border-luxury text-gradient-gold'
                    : action.variant === 'platinum'
                    ? 'luxury-card-platinum border-platinum text-gradient-platinum'
                    : 'luxury-card text-white hover:bg-white/20'
                }`}
              >
                <action.icon className="text-sm" />
                <span className="font-medium">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Premium Input */}
      <div className="p-6 border-t border-yellow-400/30">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your premium AI concierge..."
            className="flex-1 px-4 py-3 luxury-card-gold border-luxury rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isTyping || !inputMessage.trim()}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 glow-luxury"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumGeminiChat;
