const OpenAI = require('openai');
const natural = require('natural');
const compromise = require('compromise');
const config = require('../config/env');

class AIService {
  constructor() {
    this.openai = config.openAiKey
      ? new OpenAI({ apiKey: config.openAiKey })
      : null;
    this.tokenizer = new natural.WordTokenizer();
    this.sentiment = new natural.SentimentAnalyzer('English', 
      natural.PorterStemmer, 'afinn');
  }

  // Movie Recommendations based on user preferences
  async getMovieRecommendations(userPreferences, allMovies) {
    try {
      const { genres, languages, watchHistory, ratings } = userPreferences;
      
      // Create user profile from history
      const userProfile = this.createUserProfile(watchHistory, ratings);
      
      // Score movies based on user preferences
      const scoredMovies = allMovies.map(movie => {
        let score = 0;
        
        // Genre matching
        if (genres && genres.length > 0) {
          const genreMatch = movie.genres.filter(g => genres.includes(g)).length;
          score += genreMatch * 0.3;
        }
        
        // Language matching
        if (languages && languages.length > 0) {
          const langMatch = movie.languages.filter(l => languages.includes(l)).length;
          score += langMatch * 0.2;
        }
        
        // Rating consideration
        score += (movie.rating / 10) * 0.2;
        
        // Content similarity using NLP
        score += this.calculateContentSimilarity(userProfile, movie) * 0.3;
        
        return { ...movie.toObject(), aiScore: score };
      });
      
      // Sort by AI score and return top recommendations
      return scoredMovies
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 10);
    } catch (error) {
      console.error('AI Recommendation Error:', error);
      return allMovies.slice(0, 10); // Fallback to recent movies
    }
  }

  // Sentiment analysis for community chat moderation
  analyzeSentiment(text) {
    try {
      const tokens = this.tokenizer.tokenize(text.toLowerCase());
      const score = this.sentiment.getSentiment(tokens);
      
      // Classify sentiment
      if (score > 0.1) return { sentiment: 'positive', score };
      if (score < -0.1) return { sentiment: 'negative', score };
      return { sentiment: 'neutral', score };
    } catch (error) {
      return { sentiment: 'neutral', score: 0 };
    }
  }

  // Check for inappropriate content
  async moderateContent(text) {
    try {
      if (!this.openai) {
        return { flagged: false, categories: {} };
      }

      const moderation = await this.openai.moderations.create({
        input: text
      });
      
      return {
        flagged: moderation.results[0].flagged,
        categories: moderation.results[0].categories
      };
    } catch (error) {
      console.error('Content moderation error:', error);
      return { flagged: false, categories: {} };
    }
  }

  // AI-powered chatbot responses
  async generateChatResponse(userMessage, context = {}) {
    try {
      if (!this.openai) {
        return "I'm sorry, AI chat is not configured right now. Please try again later.";
      }

      const systemPrompt = `You are a helpful assistant for QuickShow, a movie and event booking platform. 
      Help users with booking tickets, finding movies, event information, and general inquiries.
      Be friendly, professional, and provide accurate information.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Chatbot error:', error);
      return "I'm sorry, I'm having trouble responding right now. Please try again later.";
    }
  }

  // Dynamic pricing based on demand and other factors
  calculateDynamicPrice(basePrice, factors = {}) {
    try {
      const { 
        demandLevel = 1, 
        showTime, 
        dayOfWeek, 
        isWeekend = false, 
        isHoliday = false,
        seatsAvailable 
      } = factors;

      let multiplier = 1;

      // Demand-based pricing
      if (demandLevel > 0.8) multiplier += 0.2;
      if (demandLevel > 0.9) multiplier += 0.1;

      // Time-based pricing
      if (isWeekend) multiplier += 0.15;
      if (isHoliday) multiplier += 0.25;

      // Show time pricing (prime time costs more)
      const hour = new Date(showTime).getHours();
      if (hour >= 18 && hour <= 22) multiplier += 0.1;

      // Availability-based pricing
      if (seatsAvailable < 20) multiplier += 0.1;
      if (seatsAvailable < 10) multiplier += 0.15;

      return Math.round(basePrice * multiplier);
    } catch (error) {
      return basePrice; // Fallback to base price
    }
  }

  // Natural language search enhancement
  async enhanceSearchQuery(query) {
    try {
      const doc = compromise(query);
      
      // Extract entities and intents
      const entities = {
        genres: doc.match('#Genre').out('array'),
        actors: doc.match('#Person').out('array'),
        time: doc.match('#Date').out('array'),
        location: doc.match('#Place').out('array')
      };

      // Expand query with synonyms
      const expandedQuery = this.expandWithSynonyms(query);

      return {
        originalQuery: query,
        expandedQuery,
        entities,
        intent: this.detectIntent(doc)
      };
    } catch (error) {
      return { originalQuery: query, expandedQuery: query };
    }
  }

  // Helper methods
  createUserProfile(watchHistory, ratings) {
    if (!watchHistory || watchHistory.length === 0) return '';
    
    return watchHistory
      .map(item => `${item.title} ${item.genres?.join(' ') || ''}`)
      .join(' ');
  }

  calculateContentSimilarity(userProfile, movie) {
    if (!userProfile) return 0;
    
    const movieText = `${movie.title} ${movie.description} ${movie.genres?.join(' ') || ''}`;
    const distance = natural.JaroWinklerDistance(userProfile, movieText);
    
    return distance;
  }

  expandWithSynonyms(query) {
    const synonyms = {
      'movie': ['film', 'cinema', 'picture'],
      'show': ['performance', 'event', 'screening'],
      'ticket': ['pass', 'entry', 'admission'],
      'book': ['reserve', 'purchase', 'buy']
    };

    let expanded = query.toLowerCase();
    Object.entries(synonyms).forEach(([word, syns]) => {
      if (expanded.includes(word)) {
        expanded += ` ${syns.join(' ')}`;
      }
    });

    return expanded;
  }

  detectIntent(doc) {
    if (doc.has('book #Movie')) return 'booking';
    if (doc.has('search #Movie')) return 'search';
    if (doc.has('showtime #Movie')) return 'showtimes';
    if (doc.has('price #Ticket')) return 'pricing';
    return 'general';
  }
}

module.exports = new AIService();
