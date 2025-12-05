import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import StartPage from './components/startpage/StartPage.jsx' 
import Level1 from './components/level1/Level1.jsx' 
import Level1Game from './components/level1/Level1Game.jsx' 
import Level2 from './components/level2/Level2.jsx'
import AdminPage from './components/level1/AdminPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/level1" element={<Level1 />} />
        <Route path="/level1Game" element={<Level1Game />} />
        <Route path="/admin-secret" element={<AdminPage />} />
        <Route path="/level2" element={<Level2 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)