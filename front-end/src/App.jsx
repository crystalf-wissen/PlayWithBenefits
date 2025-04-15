import './App.css'
import { Routes, Route } from 'react-router-dom'
import FoosballMatchTracker from './screens/FoosballMatchTracker'
import FoosballTrackerHome from './screens/FoosballTrackerHome'

import React, { useState } from 'react'
import Navbar from './components/Navbar'

function App() {
  const [isLive, setIsLive] = useState(false);

  return (
    <div className='p-4 lg:px-20 bg-[#030712]'>
      <Navbar isLive={isLive}/>
      <Routes>
        <Route path="/" element={<FoosballMatchTracker setIsLive={setIsLive} />} />
        <Route path='home' element={<FoosballTrackerHome />} />
      </Routes>
    </div>
  )
}

export default App
