/**
 * điểm khởi đầu (entry point) của ứng dụng frontend
 * gắn kết app component vào thẻ div #root trong file index.html
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

