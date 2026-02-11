
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Fatal error during React mount:", error);
  rootElement.innerHTML = `<div style="color: white; padding: 20px; font-family: sans-serif;">
    <h2>The Hall has collapsed.</h2>
    <p>A magical error occurred during initialization. Please check the browser console for details.</p>
  </div>`;
}
