import React, { useState } from 'react';
import axios from '../utils/axios';

const GeminiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testGeminiEndpoints = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Basic chat endpoint
      console.log('Testing /gemini/chat endpoint...');
      const chatResponse = await axios.post('/gemini/chat', {
        message: 'Hello, can you recommend some movies?',
        context: {
          previousMessages: [],
          timestamp: new Date().toISOString()
        }
      });
      results.chat = {
        success: true,
        data: chatResponse.data,
        status: chatResponse.status
      };
      console.log('Chat endpoint response:', chatResponse.data);
    } catch (chatError) {
      results.chat = {
        success: false,
        error: chatError.message,
        status: chatError.response?.status,
        statusText: chatError.response?.statusText
      };
      console.error('Chat endpoint error:', chatError);
    }

    try {
      // Test 2: Recommendations endpoint
      console.log('Testing /gemini/recommendations endpoint...');
      const recResponse = await axios.post('/gemini/recommendations', {
        userInput: 'action movies'
      });
      results.recommendations = {
        success: true,
        data: recResponse.data,
        status: recResponse.status
      };
      console.log('Recommendations endpoint response:', recResponse.data);
    } catch (recError) {
      results.recommendations = {
        success: false,
        error: recError.message,
        status: recError.response?.status,
        statusText: recError.response?.statusText
      };
      console.error('Recommendations endpoint error:', recError);
    }

    try {
      // Test 3: Movies endpoint (for catalog fallback)
      console.log('Testing /movies endpoint...');
      const moviesResponse = await axios.get('/movies', {
        params: { nowShowing: true }
      });
      results.movies = {
        success: true,
        count: moviesResponse.data.movies?.length || 0,
        status: moviesResponse.status
      };
      console.log('Movies endpoint response:', moviesResponse.data);
    } catch (moviesError) {
      results.movies = {
        success: false,
        error: moviesError.message,
        status: moviesError.response?.status,
        statusText: moviesError.response?.statusText
      };
      console.error('Movies endpoint error:', moviesError);
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-purple-600 text-white mb-4">
      <h3 className="font-bold text-lg mb-4">Gemini API Test</h3>
      
      <button
        onClick={testGeminiEndpoints}
        disabled={loading}
        className="px-4 py-2 bg-purple-800 rounded disabled:opacity-50 mb-4"
      >
        {loading ? 'Testing...' : 'Test Gemini Endpoints'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-3">
          {Object.entries(testResults).map(([endpoint, result]) => (
            <div key={endpoint} className="p-3 bg-purple-700 rounded">
              <h4 className="font-medium mb-1">
                /gemini/{endpoint} 
                <span className={`ml-2 text-sm ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                  {result.success ? '✅ Working' : '❌ Failed'}
                </span>
              </h4>
              
              {result.success ? (
                <div className="text-sm">
                  <p>Status: {result.status}</p>
                  {endpoint === 'movies' && (
                    <p>Movies found: {result.count}</p>
                  )}
                  {endpoint !== 'movies' && (
                    <p className="text-xs text-purple-200 mt-1">
                      {JSON.stringify(result.data, null, 2).substring(0, 200)}...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-sm text-red-200">
                  <p>Error: {result.error}</p>
                  <p>Status: {result.status} {result.statusText}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-purple-200">
        <p>💡 Open browser console (F12) to see detailed logs</p>
        <p>This will test all Gemini API endpoints and identify issues</p>
      </div>
    </div>
  );
};

export default GeminiTest;
