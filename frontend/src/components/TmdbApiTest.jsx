import React, { useState, useEffect } from 'react';
import { getTop10Today } from '../services/tmdbService';

const TmdbApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing TMDb API directly...');
        const result = await getTop10Today();
        console.log('TMDb API Test Result:', result);
        setTestResult({
          success: true,
          count: result.length,
          movies: result.slice(0, 2), // Show first 2 movies
        });
      } catch (err) {
        console.error('TMDb API Test Error:', err);
        setTestResult({
          success: false,
          error: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-600 text-white">
        <h3 className="font-bold">Testing TMDb API...</h3>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-600 text-white">
      <h3 className="font-bold text-lg mb-2">TMDb API Test Results</h3>
      {testResult.success ? (
        <div>
          <p className="text-green-300">✅ API Working! Found {testResult.count} movies</p>
          <div className="mt-2 space-y-1">
            {testResult.movies.map((movie, i) => (
              <div key={i} className="text-sm">
                <span className="font-bold">{movie.rank}.</span> {movie.title}
                <br />
                <span className="text-xs text-blue-200">Poster: {movie.poster ? 'Available' : 'Missing'}</span>
                <br />
                <span className="text-xs text-blue-200">URL: {movie.poster}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-red-300">❌ API Failed: {testResult.error}</p>
        </div>
      )}
    </div>
  );
};

export default TmdbApiTest;
