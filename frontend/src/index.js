import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/globals.css';
import './styles/responsive.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </Provider>
  </React.StrictMode>
);


