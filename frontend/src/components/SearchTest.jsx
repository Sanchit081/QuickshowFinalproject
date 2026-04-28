import React, { useState } from 'react';
import { searchMovies } from '../services/tmdbService';

const SearchTest = () => {
  const [query, setQuery] = useState('batman');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const testSearch = async () => {
    setLoading(true);
    try {
      console.log('SearchTest: Testing search for:', query);
      const data = await searchMovies(query, 1);
      console.log('SearchTest: Search results:', data);
      setResults(data);
    } catch (error) {
      console.error('SearchTest: Search failed:', error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-yellow-600 text-white mb-4">
      <h3 className="font-bold text-lg mb-4">TMDb Search Test</h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="px-3 py-2 bg-yellow-700 text-white rounded flex-1"
        />
        <button
          onClick={testSearch}
          disabled={loading}
          className="px-4 py-2 bg-yellow-800 rounded disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results && (
        <div className="mt-4">
          {results.error ? (
            <div className="text-red-200">
              <p>❌ Error: {results.error}</p>
            </div>
          ) : (
            <div>
              <p className="text-green-200">✅ Found {results.results?.length || 0} movies</p>
              <div className="mt-2 space-y-1">
                {results.results?.slice(0, 3).map((movie) => (
                  <div key={movie.id} className="text-sm">
                    <span className="font-bold">{movie.title}</span> ({new Date(movie.release_date).getFullYear()}) - ⭐ {movie.vote_average}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-yellow-200">
        <p>💡 Open browser console (F12) to see detailed logs</p>
        <p>Try searching for: "batman", "action", "2023"</p>
      </div>
    </div>
  );
};

export default SearchTest;
