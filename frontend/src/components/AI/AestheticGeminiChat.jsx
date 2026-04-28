import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaMagic, FaFilm, FaHeart, FaStar } from 'react-icons/fa';
import axios from 'axios';

const AestheticGeminiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Aesthetic welcome message
      setMessages([
        {
          type: 'bot',
          text: "Welcome to your AI Cinema Assistant! I'm here to help you discover amazing movies, provide personalized recommendations, and create the perfect movie experience for you.",
          suggestions: ["What's trending now?", "Find romantic movies", "Surprise me!", "Movies like Inception"],
          isAesthetic: true
        }
      ]);
      
      // Aesthetic quick actions
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

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: 'user',
      text: messageText,
      timestamp: new Date(),
      isAesthetic: true
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
            isAesthetic: true
          }
        }
      );

      const botMessage = {
        type: 'bot',
        text: response.data.response,
        suggestions: response.data.suggestions || [],
        movieRecommendations: response.data.movieRecommendations || [],
        timestamp: new Date(),
        isAesthetic: true
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Aesthetic Gemini Chat Error:', error);
      
      // Aesthetic fallback response
      const fallbackMessage = {
        type: 'bot',
        text: "I'm having trouble connecting right now. Here are some popular movies you might enjoy:",
        suggestions: ["What's trending?", "Find romantic movies", "Surprise me!"],
        timestamp: new Date(),
        isAesthetic: true
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
        className="fixed bottom-12 right-12 w-20 h-20 rounded-full textured-card-accent border-accent flex items-center justify-center z-[60] glow-accent group"
      >
        <div className="text-center">
          <FaRobot className="text-3xl text-accent mb-1" />
          <span className="text-xs font-bold text-accent">AI</span>
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full animate-pulse border-3 border-white shadow-lg" />
        <div className="absolute -bottom-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-primary textured-card px-3 py-2 rounded-full text-accent">
            AI Chat
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
      className="fixed bottom-12 right-12 w-[420px] h-[700px] textured-card-accent border-accent rounded-3xl shadow-2xl z-[60] flex flex-col glow-accent"
    >
      {/* Aesthetic Header */}
      <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 text-primary p-6 rounded-t-3xl border-b border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaRobot className="text-3xl text-accent" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 text-3xl opacity-30"
              >
                <FaRobot className="text-accent" />
              </motion.div>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gradient-accent">AI Cinema Assistant</h3>
              <p className="text-xs opacity-90 flex items-center space-x-2">
                <span>Powered by Gemini</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-primary hover:bg-red-100 p-2 rounded-full transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
      </div>

      {/* Enhanced Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/90">
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
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white textured-card'
                    : 'textured-card-accent border-accent text-primary'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                
                {/* Enhanced Movie Recommendations */}
                {message.movieRecommendations && message.movieRecommendations.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.movieRecommendations.map((movie, idx) => (
                      <div key={idx} className="textured-card p-3 rounded-xl bg-white/90">
                        <div className="flex items-center space-x-3">
                          <img src={movie.poster} alt={movie.title} className="w-12 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-sm text-accent">{movie.title}</p>
                            <p className="text-xs opacity-75">{movie.genres?.join(', ')}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <FaStar className="text-red-500 text-xs" />
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
                        className="text-xs px-3 py-2 rounded-full textured-card-accent border-accent hover:scale-105 transition-transform text-accent"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-red-200">
                  <p className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {message.isAesthetic && (
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
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
            <div className="textured-card-accent border-accent p-4 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4 bg-white/90">
          <p className="text-xs text-secondary mb-4 font-medium">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="flex items-center space-x-2 text-xs p-3 rounded-xl transition-all hover:scale-105 textured-card hover:border-accent"
              >
                <action.icon className="text-sm text-accent" />
                <span className="font-medium text-primary">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Aesthetic Input */}
      <div className="p-6 border-t border-red-200 bg-white/90">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about movies..."
            className="flex-1 px-4 py-3 textured-card border-accent rounded-full text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-red-400/50 text-sm"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isTyping || !inputMessage.trim()}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AestheticGeminiChat;
