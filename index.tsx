
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Colordle: Initializing application...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Colordle: Could not find root element to mount to");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Colordle: Successfully mounted");
  } catch (error) {
    console.error("Colordle: Critical failure during mount:", error);
  }
}
