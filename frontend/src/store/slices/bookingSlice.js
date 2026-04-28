import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await axios.get(`${API_URL}/bookings`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to fetch bookings');
      }
      
      return response.data.bookings || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to fetch bookings';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('Authentication required. Please login again.');
      }

      // Validate booking data
      if (!bookingData.showId || !bookingData.seats || bookingData.seats.length === 0) {
        return rejectWithValue('Invalid booking data');
      }

      const response = await axios.post(
        `${API_URL}/bookings`,
        bookingData,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 15000 // 15 seconds timeout
        }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to create booking');
      }

      return response.data.booking;
    } catch (error) {
      let errorMessage = 'Failed to create booking';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  bookings: [],
  currentBooking: null,
  selectedSeats: [],
  loading: false,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  lastFetched: null
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
      state.error = null; // Clear any previous errors when seats are updated
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
    resetBookingState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.bookings = action.payload || [];
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch bookings';
      })
      
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.currentBooking = action.payload;
        // Add the new booking to the bookings list
        if (action.payload) {
          state.bookings = [action.payload, ...state.bookings];
        }
        state.selectedSeats = []; // Clear selected seats after successful booking
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || 'Failed to create booking';
      });
  },
});

// Export actions
export const { 
  setSelectedSeats, 
  clearSelectedSeats, 
  setCurrentBooking, 
  clearBookingError,
  resetBookingState 
} = bookingSlice.actions;

// Selectors
export const selectAllBookings = (state) => state.bookings.bookings;
export const selectCurrentBooking = (state) => state.bookings.currentBooking;
export const selectSelectedSeats = (state) => state.bookings.selectedSeats;
export const selectBookingStatus = (state) => ({
  status: state.bookings.status,
  loading: state.bookings.loading,
  error: state.bookings.error,
  lastFetched: state.bookings.lastFetched
});

export default bookingSlice.reducer;

