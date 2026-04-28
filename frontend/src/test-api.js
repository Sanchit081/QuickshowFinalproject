// Test API connection
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

console.log('Testing API connection to:', API_URL);

// Test login
fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@gmail.com',
    password: '123456'
  }),
  credentials: 'include'
})
.then(response => {
  console.log('Login response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Login response data:', data);
})
.catch(error => {
  console.error('Login error:', error);
});

// Test movies
fetch(`${API_URL}/movies`, {
  credentials: 'include'
})
.then(response => {
  console.log('Movies response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Movies response data length:', data.length || data.movies?.length);
})
.catch(error => {
  console.error('Movies error:', error);
});
