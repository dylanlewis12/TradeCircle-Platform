//import { StrictMode } from 'react'
import React from "react";
//import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx';
import ContextProvider from './context/ContextProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContextProvider>
      <Router>
        <App />
      </Router>
    </ContextProvider>
  </React.StrictMode>,
)
