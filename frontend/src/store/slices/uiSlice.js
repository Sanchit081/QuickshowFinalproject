import { createSlice } from '@reduxjs/toolkit';
import { readStorage, writeStorage } from '../../utils/storage';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: readStorage('darkMode') === 'true',
    city: readStorage('city', 'Mumbai'),
    sidebarOpen: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      writeStorage('darkMode', String(state.darkMode));
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', state.darkMode);
      }
    },
    setCity: (state, action) => {
      state.city = action.payload;
      writeStorage('city', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { toggleDarkMode, setCity, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;

