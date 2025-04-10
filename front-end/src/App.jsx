import './App.css'
import { Routes, Route } from 'react-router-dom'
import FoosballMatchTracker from './screens/FoosballMatchTracker'
import FoosballTrackerHome from './screens/FoosballTrackerHome'

import React from 'react'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<FoosballMatchTracker />} />
        <Route path='home' element={<FoosballTrackerHome />} />
      </Routes>
    </>
  )
}

export default App
