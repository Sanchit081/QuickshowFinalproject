import axios from '../utils/axios';

export const adminApi = {
  // Movies
  listMovies: async () => axios.get('/movies'),
  createMovie: async (formData) =>
    axios.post('/admin/movies', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateMovie: async (movieId, formData) =>
    axios.put(`/admin/movies/${movieId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteMovie: async (movieId) => axios.delete(`/admin/movies/${movieId}`),
  createShowsForMovie: async (movieId) => axios.post(`/admin/movies/${movieId}/create-shows`),
  createShowsForAll: async () => axios.post('/admin/movies/create-all-shows'),

  // Cinemas
  listCinemas: async () => axios.get('/cinemas'),
  createCinema: async (payload) => axios.post('/admin/cinemas', payload),
  deleteCinema: async (cinemaId) => axios.delete(`/admin/cinemas/${cinemaId}`),

  // Shows
  listShows: async () => axios.get('/shows'),
  createShow: async (payload) => axios.post('/admin/shows', payload),
  updateShow: async (showId, payload) => axios.put(`/admin/shows/${showId}`, payload),
  deleteShow: async (showId) => axios.delete(`/admin/shows/${showId}`),

  // Bookings
  listBookings: async () => axios.get('/admin/bookings'),
  cancelBooking: async (bookingId) => axios.put(`/admin/bookings/${bookingId}/cancel`),

  // Users
  listUsers: async () => axios.get('/admin/users'),
  toggleBlockUser: async (userId) => axios.put(`/admin/users/${userId}/block`),

  // Analytics
  getAnalytics: async () => axios.get('/admin/analytics'),
};

