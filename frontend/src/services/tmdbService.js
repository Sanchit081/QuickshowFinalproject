import axios from 'axios';

// TMDb API Configuration - Using hardcoded credentials for reliability
const TMDB_API_KEY = '2b9653794598f8e20159cf6d64827b84';
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjk2NTM3OTQ1OThmOGUyMDE1OWNmNmQ2NDgyN2I4NCIsIm5iZiI6MTc3NzM1MDk4NC43NzEwMDAxLCJzdWIiOiI2OWYwMzk0OGZjM2U2ZjE1ZTRkNzdkZjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.OB0bWFNxLA6lEs4VWUqnEpVFN-Hr604N45tbZ7Q7Zww';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// CORS Proxy - Use a public proxy to avoid CORS issues
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Create axios instance for TMDb API with API key authentication and CORS handling
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Alternative instance with Bearer token (for testing)
const tmdbApiWithToken = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  params: {
    language: 'en-US',
  },
  timeout: 10000,
});

// Fallback instance using CORS proxy
const tmdbApiWithProxy = axios.create({
  baseURL: CORS_PROXY + TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Mock data for when all API calls fail
const mockTrendingMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster: `${TMDB_IMAGE_BASE}q6y0Go1tsGEsmt99ryr3DGF6tBN.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}6vcRkQyUmiiJK6Co4uV6Nt9bq0h.jpg`,
    rating: "9.3",
    releaseDate: "1994-09-23",
    rank: 1,
    overview: "Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency.",
    popularity: 100.0,
    voteCount: 25000,
  },
  {
    id: 2,
    title: "The Godfather",
    poster: `${TMDB_IMAGE_BASE}rPdtLWNrsZsMoqMk7bOXN5GxT3p.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}3qbkAqiXE3tnRdwhkZ8Zb2Mn9J4.jpg`,
    rating: "9.2",
    releaseDate: "1972-03-24",
    rank: 2,
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    popularity: 95.0,
    voteCount: 18000,
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster: `${TMDB_IMAGE_BASE}qJ2tW6WMUDux9Ur57bVIoyZjTUI.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}hmcFJYNhVWc3Lz2jO6n903wB0Y.jpg`,
    rating: "9.0",
    releaseDate: "2008-07-18",
    rank: 3,
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    popularity: 90.0,
    voteCount: 22000,
  },
  {
    id: 4,
    title: "Pulp Fiction",
    poster: `${TMDB_IMAGE_BASE}d5iIlFn5s0I3z9SUXQuS2RDRcJW.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}s7HEpVll2h6JcBof3h4VmfuWQ3F.jpg`,
    rating: "8.9",
    releaseDate: "1994-10-14",
    rank: 4,
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    popularity: 85.0,
    voteCount: 19000,
  },
  {
    id: 5,
    title: "Forrest Gump",
    poster: `${TMDB_IMAGE_BASE}saHP97XM6NjLszmTRWQJYKhsMtf.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}6xKHIgZ5kaqSvssXYw6cGs9tBdQ.jpg`,
    rating: "8.8",
    releaseDate: "1994-07-06",
    rank: 5,
    overview: "The presidencies of Kennedy and Johnson, the Vietnam War, and the Watergate scandal unfold from the perspective of an Alabama man with an IQ of 75.",
    popularity: 80.0,
    voteCount: 20000,
  },
  {
    id: 6,
    title: "Inception",
    poster: `${TMDB_IMAGE_BASE}9gk7adGLqYpV0OL4hjgQvmUdaTy.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}s3TBrRGB1iav7gWOncsJ09lFj.jpg`,
    rating: "8.7",
    releaseDate: "2010-07-16",
    rank: 6,
    overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    popularity: 75.0,
    voteCount: 21000,
  },
  {
    id: 7,
    title: "The Matrix",
    poster: `${TMDB_IMAGE_BASE}fiUWCsd6Csya8obd6WdW1xrK4b.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}hEGN2hmzNBeHy8vxJ4VHFfuKxYp.jpg`,
    rating: "8.7",
    releaseDate: "1999-03-31",
    rank: 7,
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    popularity: 70.0,
    voteCount: 17000,
  },
  {
    id: 8,
    title: "Goodfellas",
    poster: `${TMDB_IMAGE_BASE}a2vcnlrAyP9vcpZxGpnYwUg0JG4.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}s6CCpflcBfZwX1Zy8Xqy9sEqeK2.jpg`,
    rating: "8.7",
    releaseDate: "1990-09-19",
    rank: 8,
    overview: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.",
    popularity: 65.0,
    voteCount: 13000,
  },
  {
    id: 9,
    title: "The Silence of the Lambs",
    poster: `${TMDB_IMAGE_BASE}pGmQw6S8IY9sDB2wJpZiGcnrXJg.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}lH10nqEEWw2Lb8wz7u5I9zZfKfE.jpg`,
    rating: "8.6",
    releaseDate: "1991-02-14",
    rank: 9,
    overview: "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
    popularity: 60.0,
    voteCount: 15000,
  },
  {
    id: 10,
    title: "Schindler's List",
    poster: `${TMDB_IMAGE_BASE}sF1U4EUQS8YHGFjU6yUCuJh60Fu.jpg`,
    backdrop: `${TMDB_IMAGE_BASE}sNKXlybBdKsZ8Hh9WqgQGqA4t4E.jpg`,
    rating: "8.9",
    releaseDate: "1993-12-15",
    rank: 10,
    overview: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.",
    popularity: 55.0,
    voteCount: 12000,
  },
];

/**
 * Fetch top 10 trending movies of the day
 * @returns {Promise<Array>} Array of top 10 trending movies with rankings
 */
export const getTop10Today = async () => {
  try {
    const response = await tmdbApi.get('/trending/movie/day');
    const movies = response.data.results || [];
    
    // Take only top 10 and add ranking
    const top10Movies = movies.slice(0, 10).map((movie, index) => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}` : null,
      rating: movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A',
      releaseDate: movie.release_date,
      rank: index + 1,
      overview: movie.overview,
      popularity: movie.popularity,
      voteCount: movie.vote_count,
    }));

    return top10Movies;
  } catch (error) {
    console.warn('Primary API failed, trying Bearer token...');
    
    // Try with Bearer token as fallback
    try {
      const response = await tmdbApiWithToken.get('/trending/movie/day');
      const movies = response.data.results || [];
      
      const top10Movies = movies.slice(0, 10).map((movie, index) => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}` : null,
        rating: movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A',
        releaseDate: movie.release_date,
        rank: index + 1,
        overview: movie.overview,
        popularity: movie.popularity,
        voteCount: movie.vote_count,
      }));

      return top10Movies;
    } catch (tokenError) {
      console.warn('Bearer token failed, trying CORS proxy...');
      
      // Try with CORS proxy as final fallback
      try {
        const response = await tmdbApiWithProxy.get('/trending/movie/day');
        const movies = response.data.results || [];
        
        const top10Movies = movies.slice(0, 10).map((movie, index) => ({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
          backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}` : null,
          rating: movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A',
          releaseDate: movie.release_date,
          rank: index + 1,
          overview: movie.overview,
          popularity: movie.popularity,
          voteCount: movie.vote_count,
        }));

        return top10Movies;
      } catch (proxyError) {
        console.warn('CORS proxy failed, using mock data...');
        
        // Return mock data as final fallback
        console.log('Using mock data for trending movies');
        return mockTrendingMovies;
      }
    }
  }
};

/**
 * Fetch movie details by ID
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie details
 */
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    try {
      const response = await tmdbApiWithToken.get(`/movie/${movieId}`);
      return response.data;
    } catch (fallbackError) {
      throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
  }
};

/**
 * Search movies by query
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Search results
 */
export const searchMovies = async (query, page = 1) => {
  try {
    console.log('TMDb Service: Searching movies with query:', query, 'page:', page);
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    console.log('TMDb Service: Search successful, results:', response.data.results?.length || 0);
    return response.data;
  } catch (error) {
    console.warn('TMDb Service: Primary search failed, trying Bearer token...');
    try {
      const response = await tmdbApiWithToken.get('/search/movie', {
        params: { query, page },
      });
      console.log('TMDb Service: Bearer token search successful, results:', response.data.results?.length || 0);
      return response.data;
    } catch (fallbackError) {
      console.warn('TMDb Service: Bearer token also failed, trying CORS proxy...');
      try {
        const response = await tmdbApiWithProxy.get('/search/movie', {
          params: { query, page },
        });
        console.log('TMDb Service: CORS proxy search successful, results:', response.data.results?.length || 0);
        return response.data;
      } catch (proxyError) {
        console.error('TMDb Service: All search methods failed:', { primary: error, token: fallbackError, proxy: proxyError });
        
        // Return mock search results as fallback
        console.log('TMDb Service: Using mock search results as fallback');
        return {
          results: mockTrendingMovies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 5),
          page: 1,
          total_pages: 1,
          total_results: mockTrendingMovies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
          ).length,
        };
      }
    }
  }
};

/**
 * Get movie trailer URL
 * @param {number} movieId - Movie ID
 * @returns {Promise<string|null>} YouTube trailer URL or null
 */
export const getMovieTrailer = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    const videos = response.data.results || [];
    
    // Find YouTube trailer
    const trailer = videos.find(video => 
      video.site === 'YouTube' && 
      video.type === 'Trailer' && 
      video.official === true
    );

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (error) {
    try {
      const response = await tmdbApiWithToken.get(`/movie/${movieId}/videos`);
      const videos = response.data.results || [];
      
      const trailer = videos.find(video => 
        video.site === 'YouTube' && 
        video.type === 'Trailer' && 
        video.official === true
      );

      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (fallbackError) {
      return null;
    }
  }
};

export default tmdbApi;
