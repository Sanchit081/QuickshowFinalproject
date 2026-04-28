import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaMagic, FaFilm, FaHeart, FaStar } from 'react-icons/fa';
import axios from '../../utils/axios';
import { buildMediaUrl } from '../../config/api';

const GeminiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          type: 'bot',
          text: "Hi! I'm your AI cinema assistant. I can help you discover movies, find showtimes, or suggest films based on your mood. How can I help you today?",
          suggestions: ["What's trending?", "Find romantic movies", "Surprise me!", "Movies like Inception"]
        }
      ]);
      
      // Set quick actions
      setQuickActions([
        { text: "Trending Movies", icon: FaStar, prompt: "What are the trending movies right now?" },
        { text: "Romantic Movies", icon: FaHeart, prompt: "Show me some romantic movies" },
        { text: "AI Picks", icon: FaMagic, prompt: "Give me your top AI movie recommendations" },
        { text: "Surprise Me", icon: FaFilm, prompt: "Surprise me with a great movie recommendation" }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText) => {
    const textToSend = String(messageText || '').trim();
    if (!textToSend) return;

    const userMessage = {
      type: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post('/gemini/chat', {
        message: textToSend,
        context: {
          previousMessages: messages.slice(-5).map((m) => ({ type: m.type, text: m.text })),
          timestamp: new Date().toISOString()
        }
      });

      const botMessage = {
        type: 'bot',
        text: response.data.response || "I'm here to help. What kind of movies do you like?",
        suggestions: response.data.suggestions || [],
        movieRecommendations: (response.data.movieRecommendations || []).map((m) => ({
          ...m,
          poster: buildMediaUrl(m.poster) || m.poster
        })),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Gemini Chat Error:', error);
      
      const fallbackMessage = {
        type: 'bot',
        text: "I can help you find movies! Try asking me about action movies, romantic films, or what's trending.",
        suggestions: ["Action movies", "Romantic movies", "Thriller movies", "What's trending?"],
        movieRecommendations: [
          {
            _id: '1',
            title: 'Action Blockbuster',
            poster: 'https://via.placeholder.com/300x450/3b82f6/ffffff?text=Action',
            genres: ['Action', 'Adventure'],
            rating: 8.5
          },
          {
            _id: '2',
            title: 'Romantic Comedy',
            poster: 'https://via.placeholder.com/300x450/ec4899/ffffff?text=Romance',
            genres: ['Romance', 'Comedy'],
            rating: 7.8
          }
        ],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action.prompt);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full glass-card flex items-center justify-center z-[60] neon-glow group"
      >
        <FaRobot className="text-2xl text-gray-800" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
        <div className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-gray-800 whitespace-nowrap glass-card px-2 py-1 rounded">
            Ask AI
          </span>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-8 right-8 w-96 h-[600px] glass-card rounded-2xl shadow-2xl z-[60] flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-gray-800 p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaRobot className="text-xl" />
          <div>
            <h3 className="font-semibold">AI Cinema Assistant</h3>
            <p className="text-xs opacity-90">Powered by Gemini</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-800 hover:bg-white/20 p-1 rounded transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-gray-800'
                    : 'glass-card text-gray-800'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                
                {/* Movie Recommendations */}
                {message.movieRecommendations && message.movieRecommendations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.movieRecommendations.map((movie, idx) => (
                      <div key={idx} className="p-2 glass-card rounded-lg">
                        <div className="flex items-center space-x-2">
                          <img src={movie.poster} alt={movie.title} className="w-8 h-12 rounded object-cover" />
                          <div className="flex-1">
                            <p className="font-semibold text-xs">{movie.title}</p>
                            <p className="text-xs opacity-75">{movie.genres?.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(suggestion)}
                        className="text-xs px-2 py-1 rounded-full glass-card hover:bg-white/20 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs opacity-70 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass-card p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="flex items-center space-x-2 text-xs glass-card hover:bg-white/20 text-gray-800 p-2 rounded-lg transition-colors"
              >
                <action.icon className="text-sm" />
                <span>{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about movies..."
            className="flex-1 px-4 py-2 glass-card rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={isTyping || !inputMessage.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-gray-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GeminiChat;
