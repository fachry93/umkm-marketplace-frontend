import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ParallaxProvider } from 'react-scroll-parallax'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'


import '@fontsource/lora/400.css'
import '@fontsource/lora/400-italic.css'
import '@fontsource/lora/600.css'
import '@fontsource/lora/700.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ParallaxProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            background: '#1c1917',
            color: '#fafaf9',
            padding: '12px 16px'
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' }
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' }
          }
        }}
      />
    </ParallaxProvider>
  </React.StrictMode>
)
