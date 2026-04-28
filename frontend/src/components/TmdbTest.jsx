import React, { useState, useEffect } from 'react';
import { getTop10Today } from '../services/tmdbService';

const TmdbTest = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        console.log('Testing TMDb API...');
        const result = await getTop10Today();
        console.log('TMDb API Test Result:', result);
        setMovies(result);
        setError(null);
      } catch (err) {
        console.error('TMDb API Test Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-8 bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">TMDb API Test</h2>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-600 p-4 rounded mb-4">
          <p className="font-bold">Error: {error}</p>
          <p className="text-sm mt-2">Check browser console for detailed error information</p>
        </div>
      )}
      
      {movies.length > 0 && (
        <div>
          <p className="text-green-400 mb-4">✅ API Working! Found {movies.length} movies</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-gray-800 p-2 rounded">
                <div className="text-lg font-bold text-red-500">#{movie.rank}</div>
                <div className="text-sm">{movie.title}</div>
                <div className="text-xs text-yellow-400">⭐ {movie.rating}</div>
                {movie.poster && (
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-32 object-cover mt-2 rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TmdbTest;
