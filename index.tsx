
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical: Could not find root element '#root' in DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error: any) {
    console.error("Fatal error during React mount:", error);
    rootElement.innerHTML = `
      <div style="background: #050505; color: #ef4444; padding: 40px; font-family: 'Cinzel', serif; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
        <h1 style="color: #f59e0b; margin-bottom: 20px;">The Hall has collapsed.</h1>
        <p style="color: #71717a; max-width: 400px; font-family: sans-serif; line-height: 1.6;">
          A magical error occurred during initialization.<br/>
          <code style="display: block; background: #18181b; padding: 10px; margin-top: 20px; border-radius: 8px; color: #f87171; font-size: 12px; font-family: monospace;">
            ${error?.message || "Unknown Resolution Error"}
          </code>
        </p>
        <button onclick="window.location.reload()" style="margin-top: 30px; background: #27272a; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">Try Again</button>
      </div>
    `;
  }
}
