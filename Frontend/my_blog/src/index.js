//index.js
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="686521550446-illa4q43u6c9pobe9ij1fp0nnf64ula9.apps.googleusercontent.com">
      <App/>
      </GoogleOAuthProvider>
  </React.StrictMode>
);


