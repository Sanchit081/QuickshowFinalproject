import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const DebugAPI = () => {
  const [testResults, setTestResults] = useState([]);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results = [];

    // Test 1: Health Check
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      results.push({ test: 'Health Check', status: response.status, data: JSON.stringify(data), success: response.ok });
    } catch (error) {
      results.push({ test: 'Health Check', error: error.message, success: false });
    }

    // Test 2: Movies
    try {
      const response = await fetch(`${API_URL}/movies`, { credentials: 'include' });
      const data = await response.json();
      results.push({ test: 'Movies', status: response.status, data: Array.isArray(data) ? data.length : data.movies?.length || 0, success: response.ok });
    } catch (error) {
      results.push({ test: 'Movies', error: error.message, success: false });
    }

    // Test 3: Login
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@gmail.com', password: '123456' }),
        credentials: 'include'
      });
      const data = await response.json();
      results.push({ test: 'Login', status: response.status, success: response.ok, hasToken: !!data.token });
    } catch (error) {
      results.push({ test: 'Login', error: error.message, success: false });
    }

    setTestResults(results);
  };

  return (
    <div className="fixed top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">API Debug</h3>
      <p className="text-xs mb-2">API URL: {API_URL}</p>
      <p className="text-xs mb-2">Auth: {isAuthenticated ? 'Yes' : 'No'}</p>
      {user && <p className="text-xs mb-2">User: {user.email}</p>}
      
      <div className="space-y-1">
        {testResults.map((result, i) => (
          <div key={i} className={`text-xs p-1 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <strong>{result.test}:</strong> {result.status || 'Error'} 
            {result.data !== undefined && <span> ({result.data})</span>}
            {result.hasToken && <span> ✅</span>}
            {result.error && <span className="text-red-600"> {result.error}</span>}
          </div>
        ))}
      </div>
      
      <button 
        onClick={runTests}
        className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
      >
        Retest
      </button>
    </div>
  );
};

export default DebugAPI;
