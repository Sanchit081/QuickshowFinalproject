import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { readStorage, removeStorage, writeStorage } from '../../utils/storage';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      writeStorage('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      writeStorage('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = readStorage('token');
      if (!token) {
        return rejectWithValue('UNAUTHENTICATED');
      }
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = readStorage('token');
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: readStorage('token'),
    isAuthenticated: false,
    loading: Boolean(readStorage('token')),
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeStorage('token', 'user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (action.payload.user) {
          writeStorage('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload);
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (action.payload.user) {
          writeStorage('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload);
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        if (action.payload) {
          writeStorage('user', JSON.stringify(action.payload));
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload === 'UNAUTHENTICATED'
          ? null
          : typeof action.payload === 'string'
            ? action.payload
            : JSON.stringify(action.payload);
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        removeStorage('token', 'user');
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        writeStorage('user', JSON.stringify(action.payload));
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
