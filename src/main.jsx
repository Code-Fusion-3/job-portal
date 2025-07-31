import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n.js' // Import i18n configuration
import App from './App.jsx'

// Starting application initialization

try {
  // Check if root element exists
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.');
  }

  // Root element found, creating React root
  
  const root = createRoot(rootElement);
  
  // Rendering App component
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  // App component rendered successfully
} catch (error) {
  console.error('main.jsx: Fatal error during app initialization:', error);
  
  // Show error in the DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f3f4f6;
        font-family: system-ui, -apple-system, sans-serif;
        padding: 1rem;
      ">
        <div style="
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          max-width: 500px;
          width: 100%;
        ">
          <h1 style="
            color: #dc2626;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
          ">Application Failed to Load</h1>
          <p style="
            color: #4b5563;
            margin-bottom: 1rem;
          ">The application encountered an error during initialization. Please check the browser console for more details.</p>
          <details style="
            font-size: 0.875rem;
            color: #6b7280;
          ">
            <summary style="cursor: pointer; margin-bottom: 0.5rem;">Error details</summary>
            <pre style="
              margin-top: 0.5rem;
              padding: 0.5rem;
              background-color: #f3f4f6;
              border-radius: 0.25rem;
              font-size: 0.75rem;
              overflow: auto;
              white-space: pre-wrap;
            ">${error.toString()}</pre>
          </details>
          <button 
            onclick="window.location.reload()"
            style="
              margin-top: 1rem;
              padding: 0.5rem 1rem;
              background-color: #dc2626;
              color: white;
              border: none;
              border-radius: 0.25rem;
              cursor: pointer;
              font-size: 0.875rem;
            "
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}
