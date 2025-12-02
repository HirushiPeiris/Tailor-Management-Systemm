import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import axios from 'axios';

// Configure axios
 axios.defaults.baseURL = 'https://tailorbackend.dockyardsoftware.com';
// axios.defaults.baseURL = 'http://localhost:60748';
//axios.defaults.headers.common['Content-Type'] = 'application/json';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

