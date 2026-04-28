import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      );
      const response = await axios.get('/movies', { params: cleanFilters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movies');
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/movies/${id}`);
      return response.data.movie;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movie');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'movies/toggleWishlist',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/movies/${movieId}/wishlist`, {});
      return { movieId, inWishlist: response.data.inWishlist };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    currentMovie: null,
    loading: false,
    error: null,
    filters: {
      genre: '',
      language: '',
      search: '',
      nowShowing: true,
      comingSoon: false,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies || action.payload || [];
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentMovie } = movieSlice.actions;
export default movieSlice.reducer;
