import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Section1 from './components/Section1'
import Section2 from './components/Section2'
import Section3 from './components/Section3'
import Footer from './components/Footer'
import DarkModeToggle from './components/DarkModeToggle'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Navbar darkMode={darkMode} />
      <Hero darkMode={darkMode} />
      <Section1 darkMode={darkMode} />
      <Section2 darkMode={darkMode} />
      <Section3 darkMode={darkMode} />
      <Footer darkMode={darkMode} />
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  )
}

export default App
