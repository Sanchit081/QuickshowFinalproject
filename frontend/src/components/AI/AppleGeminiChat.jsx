import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import axios from '../../utils/axios';
import { buildMediaUrl } from '../../config/api';
import { normalizeGenres } from '../../utils/movie';

const AppleGeminiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Clean welcome message
      setMessages([
        {
          type: 'bot',
          text: "Hello! I'm your AI cinema assistant. How can I help you discover the perfect movie today?",
          suggestions: ["What's trending?", "Find romantic movies", "Surprise me", "Movies like Inception"]
        }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isRecommendationQuery = (text) =>
    /(recommend|suggest|movies like|similar to|what should i watch|trending|top movies|surprise me)/i.test(text);

  const buildCatalogFallback = async (messageText) => {
    const keyword = String(messageText || '').toLowerCase();
    const genreMap = [
      'action', 'comedy', 'romance', 'romantic', 'thriller', 'horror', 'sci-fi', 'drama'
    ];
    const matchedGenre = genreMap.find((g) => keyword.includes(g));
    
    console.log('Gemini Chat: Building catalog fallback for:', messageText);
    console.log('Gemini Chat: Matched genre:', matchedGenre);
    
    try {
      const moviesResponse = await axios.get('/movies', {
        params: matchedGenre ? { genre: matchedGenre, nowShowing: true } : { nowShowing: true }
      });
      const movies = (moviesResponse.data.movies || []).slice(0, 5);
      console.log('Gemini Chat: Catalog fallback movies:', movies);
      
      return {
        response: matchedGenre
          ? `Here are popular ${matchedGenre} picks from QuickShow.`
          : 'Here are trending picks from QuickShow.',
        suggestions: ['Show more like this', 'Different genre', 'What is best for tonight?'],
        movieRecommendations: movies
      };
    } catch (catalogError) {
      console.error('Gemini Chat: Catalog fallback error:', catalogError);
      return {
        response: "I'm having trouble accessing our movie catalog right now. Please try again later.",
        suggestions: ["What's trending?", "Find romantic movies", "Surprise me"],
        movieRecommendations: []
      };
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    console.log('Gemini Chat: Sending message:', messageText);

    const userMessage = {
      type: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      console.log('Gemini Chat: Calling /gemini/chat endpoint...');
      let response = await axios.post('/gemini/chat', {
        message: messageText,
        context: {
          previousMessages: messages.slice(-5),
          timestamp: new Date().toISOString()
        }
      });

      console.log('Gemini Chat: Primary response:', response.data);

      // If chat reply has no recommendations for a recommendation query, call recommendation endpoint.
      if (isRecommendationQuery(messageText) && !(response.data.movieRecommendations || []).length) {
        console.log('Gemini Chat: No recommendations found, calling /gemini/recommendations...');
        try {
          const recResponse = await axios.post('/gemini/recommendations', { userInput: messageText });
          console.log('Gemini Chat: Recommendations response:', recResponse.data);
          const recs = recResponse.data.recommendations || [];
          if (recs.length) {
            const catalogRes = await axios.get('/movies', { params: { nowShowing: true } });
            const catalog = catalogRes.data.movies || [];
            const mapped = recs
              .map((r) => catalog.find((m) => m.title?.toLowerCase() === String(r.title || '').toLowerCase()))
              .filter(Boolean)
              .slice(0, 5);

            if (mapped.length) {
              response = {
                data: {
                  response: recResponse.data.response || response.data.response,
                  suggestions: recResponse.data.suggestions || response.data.suggestions || [],
                  movieRecommendations: mapped
                }
              };
            } else {
              console.log('Gemini Chat: No matching movies found in catalog, using fallback');
              response = { data: await buildCatalogFallback(messageText) };
            }
          } else {
            console.log('Gemini Chat: No recommendations returned, using fallback');
            response = { data: await buildCatalogFallback(messageText) };
          }
        } catch (recError) {
          console.error('Gemini Chat: Recommendation endpoint failed:', recError);
          response = { data: await buildCatalogFallback(messageText) };
        }
      }

      const botMessage = {
        type: 'bot',
        text: response.data.response || 'Here are some movie picks for you.',
        suggestions: response.data.suggestions || [],
        movieRecommendations: (response.data.movieRecommendations || []).map((movie) => ({
          ...movie,
          poster: buildMediaUrl(movie.poster) || movie.poster,
          genres: normalizeGenres(movie.genres)
        })),
        timestamp: new Date()
      };

      console.log('Gemini Chat: Final bot message:', botMessage);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Apple Gemini Chat Error:', error);
      console.error('Gemini Chat: Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Clean fallback response
      const fallbackMessage = {
        type: 'bot',
        text: "I'm having trouble connecting right now. Here are some popular movies you might enjoy:",
        suggestions: ["What's trending?", "Find romantic movies", "Surprise me"]
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

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-apple-primary/90 backdrop-blur-md flex items-center justify-center z-[60] shadow-apple-lg border-apple-hairline group"
      >
        <FaRobot className="text-black text-xl" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-apple-primary/95 backdrop-blur-xl rounded-3xl border-apple-hairline shadow-apple-xl z-[60] flex flex-col"
    >
      {/* Clean Header */}
      <div className="flex items-center justify-between p-4 border-b border-apple-hairline">
        <div className="flex items-center space-x-3">
          <FaRobot className="text-black text-lg" />
          <span className="text-gray-700 font-medium">AI Assistant</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-600 hover:text-black transition-colors p-1"
        >
          <FaTimes className="text-lg" />
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
                    ? 'bg-apple-primary text-gray-800'
                    : 'bg-apple-dark text-black border-apple-hairline'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                
                {/* Movie Recommendations */}
                {message.movieRecommendations && message.movieRecommendations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.movieRecommendations.map((movie, idx) => (
                      <div key={idx} className="bg-apple-medium p-2 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <img src={movie.poster} alt={movie.title} className="w-8 h-12 rounded object-cover" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-black">{movie.title}</p>
                            <p className="text-xs text-gray-600">{movie.genres?.join(', ')}</p>
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
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-2 py-1 rounded-lg bg-apple-medium hover:bg-apple-light text-xs text-gray-700 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="bg-apple-dark p-3 rounded-2xl border-apple-hairline">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-apple-muted rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-apple-muted rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-apple-muted rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Clean Input */}
      <div className="p-4 border-t border-apple-hairline">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about movies..."
            className="flex-1 px-3 py-2 bg-apple-medium border-apple-hairline rounded-xl text-black placeholder-apple-muted focus:outline-none focus:border-apple-thin focus:bg-apple-light transition-all"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isTyping || !inputMessage.trim()}
            className="w-10 h-10 rounded-xl bg-apple-primary text-gray-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-apple-secondary"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AppleGeminiChat;
