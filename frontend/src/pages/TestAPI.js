import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const TestAPI = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPI = async () => {
    setLoading(true);
    addLog('Starting API tests...');
    
    try {
      addLog(`Testing API URL: ${API_URL}`);
      
      // Test health endpoint
      addLog('Testing health endpoint...');
      const healthResponse = await fetch(`${API_URL}/health`);
      addLog(`Health status: ${healthResponse.status}`);
      const healthData = await healthResponse.json();
      addLog(`Health data: ${JSON.stringify(healthData)}`);
      
      // Test movies endpoint
      addLog('Testing movies endpoint...');
      const moviesResponse = await fetch(`${API_URL}/movies`, { credentials: 'include' });
      addLog(`Movies status: ${moviesResponse.status}`);
      const moviesData = await moviesResponse.json();
      addLog(`Movies count: ${Array.isArray(moviesData) ? moviesData.length : moviesData.movies?.length || 0}`);
      
      // Test login endpoint
      addLog('Testing login endpoint...');
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@gmail.com', password: '123456' }),
        credentials: 'include'
      });
      addLog(`Login status: ${loginResponse.status}`);
      const loginData = await loginResponse.json();
      addLog(`Login success: ${loginData.success}`);
      addLog(`Has token: ${!!loginData.token}`);
      
      if (loginData.token) {
        localStorage.setItem('token', loginData.token);
        addLog('Token saved to localStorage');
      }
      
    } catch (error) {
      addLog(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">API URL: <code className="bg-gray-100 px-2 py-1 rounded">{API_URL}</code></p>
              <p className="text-sm text-gray-600">Environment: {process.env.NODE_ENV}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={testAPI}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test API'}
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear Logs
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Test API" to start testing...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test Links</h2>
          <div className="space-y-2">
            <a href={`${API_URL}/health`} target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">
              GET {API_URL}/health
            </a>
            <a href={`${API_URL}/movies`} target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">
              GET {API_URL}/movies
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;
