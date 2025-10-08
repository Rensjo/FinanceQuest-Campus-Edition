import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Import performance tests (available in console during development)
if (import.meta.env.DEV) {
  import('./utils/performanceTests').then(module => {
    console.log('🎯 Performance tests loaded. Run: window.performanceTests.runAll()');
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<App />
</React.StrictMode>
)