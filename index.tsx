
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Fatal Error: Could not find root element with id 'root'. Check your index.html.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Application failed to start:", err);
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: sans-serif; text-align: center;">
        <h2>Uygulama başlatılamadı</h2>
        <p>Lütfen sayfayı yenileyin veya konsol hatalarını kontrol edin.</p>
        <pre style="text-align: left; background: #eee; padding: 1rem; display: inline-block;">${err}</pre>
      </div>
    `;
  }
}
