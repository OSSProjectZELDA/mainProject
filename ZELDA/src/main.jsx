import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import StartPage from './components/startpage/StartPage.jsx' 
import Level1 from './components/level1/Level1.jsx' 
import Level1Game from './components/level1/Level1Game.jsx' 
import Level2Game from './components/level2/Level2Game.jsx'
import AdminPage from './components/level1/AdminPage.jsx'
import Level3 from './components/level3/Level3.jsx'
import Level3Game from './components/level3/Level3Game.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/level1" element={<Level1 />} />
        <Route path="/level1Game" element={<Level1Game />} />
        <Route path="/admin-secret" element={<AdminPage />} />
        <Route path="/level1" element={<Level2 />} />
        <Route path="/level2Game" element={<Level2Game />} />
        <Route path="/level3" element={<Level3 />} />
        <Route path="/level3Game" element={<Level3Game />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)