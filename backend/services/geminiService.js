const { GoogleGenerativeAI } = require('@google/generative-ai');
const Movie = require('../models/Movie');
const User = require('../models/User');

class GeminiService {
  constructor() {
    console.log('GeminiService: Initializing with API key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || 'gemini-pro';
    console.log('GeminiService: Using model:', modelName);
    
    try {
      this.model = this.genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 700
        }
      });
      console.log('GeminiService: Model initialized successfully');
    } catch (error) {
      console.error('GeminiService: Failed to initialize model:', error);
      throw error;
    }
    
    this.cache = new Map();
  }

  withTimeout(promise, ms = 12000) {
    let timeoutId;
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Gemini request timed out')), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
  }

  getCache(key) {
    const hit = this.cache.get(key);
    if (!hit) return null;
    if (hit.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return hit.value;
  }

  setCache(key, value, ttlMs = 5 * 60 * 1000) {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async generateMovieRecommendations(userInput, context = {}) {
    try {
      const cacheKey = `recs:${String(userInput).slice(0, 200)}:${JSON.stringify({
        city: context.city,
        genres: context.genres,
        languages: context.languages
      }).slice(0, 300)}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const prompt = this.buildRecommendationPrompt(userInput, context);
      const result = await this.withTimeout(this.model.generateContent(prompt));
      const response = await result.response;
      const text = response.text();

      const parsed = this.parseMovieRecommendations(text);
      this.setCache(cacheKey, parsed, 10 * 60 * 1000);
      return parsed;
    } catch (error) {
      console.error('Gemini Recommendation Error:', error?.message || error);
      return this.getFallbackRecommendations(userInput);
    }
  }

  async generateChatResponse(message, context = {}) {
    try {
      console.log('GeminiService: Generating chat response for:', message);
      const prompt = this.buildChatPrompt(message, context);
      console.log('GeminiService: Prompt built, calling API...');
      
      const result = await this.withTimeout(this.model.generateContent(prompt));
      const response = await result.response;
      const text = response.text();
      
      console.log('GeminiService: Got response, length:', text.length);
      return this.parseChatResponse(text);
    } catch (error) {
      console.error('Gemini Chat Error:', error?.message || error);
      console.error('Gemini Chat Error Details:', {
        name: error.name,
        status: error.status,
        statusText: error.statusText,
        stack: error.stack
      });
      
      // Check if it's a rate limit or quota error
      if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        console.log('GeminiService: Rate limit detected, using fallback');
        return this.getFallbackChatResponse(message);
      }
      
      return this.getFallbackChatResponse(message);
    }
  }

  async generateMovieSummary(movie) {
    try {
      const prompt = `Generate a compelling, concise summary (max 100 words) for this movie:
      
      Title: ${movie.title}
      Description: ${movie.description}
      Genres: ${movie.genres?.join(', ')}
      Rating: ${movie.rating}
      
      Make it exciting and engaging for a cinema audience.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text().trim();
    } catch (error) {
      console.error('Gemini Summary Error:', error);
      // Provide a fallback summary when API fails
      const genres = movie.genres?.slice(0, 2).join(', ') || 'drama';
      const rating = movie.rating || 'highly rated';
      return `Experience this ${rating} ${genres} film that delivers captivating entertainment. ${movie.title} offers an unforgettable cinematic journey with compelling performances and stunning visuals that will keep you engaged from start to finish.`;
    }
  }

  async generateMoodBasedRecommendations(mood) {
    try {
      const prompt = `Based on the mood "${mood}", suggest 5 movies that would be perfect. 
      Consider different genres and provide brief explanations for each suggestion.
      Format as a JSON array with title, reason, and mood_match fields.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseMoodRecommendations(text);
    } catch (error) {
      console.error('Gemini Mood Error:', error);
      return this.getFallbackMoodRecommendations(mood);
    }
  }

  buildRecommendationPrompt(userInput, context) {
    const contextInfo = context.previousMessages 
      ? `Previous conversation context: ${context.previousMessages
          .slice(-3)
          .map(m => `${m.type}: ${String(m.text || '').slice(0, 200)}`)
          .join('\n')}`
      : '';

    const availableMovies = Array.isArray(context.availableMovies) ? context.availableMovies : [];
    const availableList = availableMovies.length
      ? `\n\nAvailable movies in our catalog (prefer recommending from this list):\n${availableMovies
          .slice(0, 30)
          .map((m) => `- ${m.title}${m.genres ? ` (${Array.isArray(m.genres) ? m.genres.join(', ') : m.genres})` : ''}`)
          .join('\n')}`
      : '';

    return `You are a premium cinema recommendation assistant for QuickShow.

User input: "${userInput}"

${contextInfo}

Provide personalized movie recommendations. Consider:
- User preferences and viewing history if available
- Current trending movies
- Genre preferences
- Similar movies they might enjoy

Hard requirements:
- Recommend 4 to 6 movies.
- If availableMovies are provided, recommend ONLY from that list.
- Avoid repeating the same recommendations across turns when possible.
- Output MUST be valid JSON (no markdown).

Return JSON in this exact shape:
{
  "response": "1-3 sentences",
  "recommendations": [
    { "title": "Movie Title", "reason": "Why this matches (1 sentence)" }
  ],
  "suggestions": ["...","...","..."]
}

${availableList}
`;
  }

  buildChatPrompt(message, context = {}) {
    const contextInfo = context.previousMessages && context.previousMessages.length > 0
      ? `Previous conversation:\n${context.previousMessages.slice(-2).map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\n`
      : '';

    // Check if this is a movie recommendation request
    const isRecommendationRequest = /(recommend|suggest|movies like|similar to|what should i watch|find|looking for|show me|want to watch|romantic|action|comedy|drama|thriller|horror|sci-fi)/i.test(message);
    
    if (isRecommendationRequest) {
      return `You are a movie recommendation expert. The user is asking for movie suggestions.

${contextInfo}User message: "${message}"

IMPORTANT: Provide specific movie recommendations with:
1. 3-5 specific movie titles
2. Brief explanation for each recommendation
3. Why these movies match their request

Format your response like this:
"I'd recommend these movies:

1. [Movie Title] - [Brief reason why it's perfect for them]
2. [Movie Title] - [Brief reason why it's perfect for them]  
3. [Movie Title] - [Brief reason why it's perfect for them]

Each recommendation should be specific and match what they're looking for."`;
    }

    return `You are a helpful cinema assistant AI.

${contextInfo}User message: "${message}"

Provide helpful, friendly responses about movies, showtimes, and cinema experiences.
If they want recommendations, suggest specific movies with explanations.
Keep responses conversational and engaging.`;
  }

  parseMovieRecommendations(text) {
    // Prefer strict JSON output
    const trimmed = String(text || '').trim();
    try {
      const direct = JSON.parse(trimmed);
      if (direct && typeof direct === 'object') return direct;
    } catch {
      // fall through
    }

    // Try extracting the first JSON object
    try {
      const match = trimmed.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // fall through
    }

    return {
      response: trimmed || "Here are some picks you might enjoy.",
      recommendations: [],
      suggestions: ["What genre are you in the mood for?", "Any actors/directors you like?", "Want something trending?"]
    };
  }

  parseChatResponse(text) {
    return {
      response: text,
      suggestions: this.extractSuggestions(text),
      movieRecommendations: this.extractMovieMentions(text)
    };
  }

  parseMoodRecommendations(text) {
    try {
      // Try to parse as JSON first
      if (text.includes('[') && text.includes(']')) {
        const jsonMatch = text.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      
      // Fallback: extract recommendations manually
      return this.extractMoodRecommendationsManually(text);
    } catch (error) {
      return this.getFallbackMoodRecommendations('bored');
    }
  }

  extractSuggestions(text) {
    const suggestions = [];
    const sentences = text.split(/[.!?]/);
    
    for (const sentence of sentences) {
      if (sentence.includes('Would you like') || sentence.includes('How about') || sentence.includes('What about')) {
        suggestions.push(sentence.trim());
      }
    }
    
    return suggestions.slice(0, 3);
  }

  extractMovieMentions(text) {
    const movies = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      // Look for movie titles in quotes or capitalized titles
      const titleMatches = line.match(/"([^"]+)"/g) || line.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g);
      
      if (titleMatches) {
        for (const title of titleMatches) {
          const cleanTitle = title.replace(/"/g, '');
          if (cleanTitle.length > 2 && cleanTitle.length < 50) {
            movies.push({
              title: cleanTitle,
              context: line.trim()
            });
          }
        }
      }
    }
    
    return movies.slice(0, 3);
  }

  generateFollowUpSuggestions(text) {
    const suggestions = [
      "Tell me more about your preferences",
      "What genres do you enjoy?",
      "Any specific actors you like?",
      "What's your mood like today?",
      "Looking for something new or classic?"
    ];
    
    return suggestions.slice(0, 3);
  }

  extractMoodRecommendationsManually(text) {
    const recommendations = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('recommend') || line.includes('suggest')) {
        const titleMatch = line.match(/"([^"]+)"/);
        if (titleMatch) {
          recommendations.push({
            title: titleMatch[1],
            reason: line.trim(),
            mood_match: 0.8
          });
        }
      }
    }
    
    return recommendations.slice(0, 5);
  }

  getFallbackRecommendations(userInput) {
    const fallbacks = {
      'action': ['Fast & Furious', 'Mission Impossible', 'John Wick'],
      'romantic': ['The Notebook', 'La La Land', 'Before Sunrise'],
      'comedy': ['The Hangover', 'Superbad', 'Step Brothers'],
      'horror': ['The Conjuring', 'A Quiet Place', 'Get Out'],
      'default': ['The Shawshank Redemption', 'Inception', 'The Dark Knight']
    };

    const keywords = userInput.toLowerCase();
    let category = 'default';
    
    for (const [key, movies] of Object.entries(fallbacks)) {
      if (keywords.includes(key)) {
        category = key;
        break;
      }
    }

    return {
      response: `Based on your interest, here are some great movies I'd recommend: ${fallbacks[category].join(', ')}. These are popular choices that many viewers enjoy!`,
      recommendations: fallbacks[category].map(title => ({
        title,
        reason: 'Popular and well-regarded film',
        confidence: 0.7
      })),
      suggestions: ["Would you like more specific recommendations?", "What genres do you prefer?"]
    };
  }

  getFallbackChatResponse(message) {
    const keywords = message.toLowerCase();
    let movieRecommendations = [];
    let responseText = "";

    // Check for genre keywords and provide specific recommendations
    if (keywords.includes('romantic') || keywords.includes('romance')) {
      movieRecommendations = [
        { title: "The Notebook", reason: "A timeless romantic story that will make you believe in love" },
        { title: "La La Land", reason: "A beautiful musical romance with stunning visuals" },
        { title: "Before Sunrise", reason: "An intimate and realistic portrayal of modern romance" }
      ];
      responseText = "For romantic movies, I'd highly recommend these heartfelt films that capture the essence of love!";
    } else if (keywords.includes('action')) {
      movieRecommendations = [
        { title: "John Wick", reason: "Non-stop action with incredible choreography" },
        { title: "Mission: Impossible", reason: "Thrilling spy action with amazing stunts" },
        { title: "Mad Max: Fury Road", reason: "Intense post-apocalyptic action masterpiece" }
      ];
      responseText = "If you love action, these films deliver adrenaline-pumping excitement from start to finish!";
    } else if (keywords.includes('comedy')) {
      movieRecommendations = [
        { title: "The Hangover", reason: "Hilarious comedy that will have you laughing out loud" },
        { title: "Superbad", reason: "A perfect blend of awkward humor and genuine friendship" },
        { title: "Step Brothers", reason: "Absurd comedy with unforgettable comedic moments" }
      ];
      responseText = "For a good laugh, these comedies are guaranteed to entertain and brighten your day!";
    } else {
      // Default recommendations
      movieRecommendations = [
        { title: "The Shawshank Redemption", reason: "A powerful story of hope and friendship" },
        { title: "Inception", reason: "Mind-bending thriller with incredible visuals" },
        { title: "The Dark Knight", reason: "A masterpiece of superhero cinema" }
      ];
      responseText = "Here are some universally acclaimed films that are perfect for any movie lover!";
    }

    return {
      response: responseText,
      suggestions: ["What genres do you prefer?", "Any specific actors you like?", "Want something trending?"],
      movieRecommendations
    };
  }

  getFallbackMoodRecommendations(mood) {
    const moodMap = {
      'happy': ['La La Land', 'The Intouchables', 'Singin\' in the Rain'],
      'sad': ['The Shawshank Redemption', 'Inside Out', 'Up'],
      'bored': ['Pulp Fiction', 'The Matrix', 'Fight Club'],
      'romantic': ['Eternal Sunshine of the Spotless Mind', 'Before Sunrise', 'Her'],
      'excited': ['Mad Max: Fury Road', 'The Dark Knight', 'Inception']
    };

    const movies = moodMap[mood.toLowerCase()] || moodMap['bored'];

    return movies.map(title => ({
      title,
      reason: `Perfect for when you're feeling ${mood}`,
      mood_match: 0.7
    }));
  }
}

module.exports = new GeminiService();
