import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import DarkModeToggle from './DarkModeToggle'
import './Layout.css'

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Navbar darkMode={darkMode} />
      <Outlet context={{ darkMode }} />
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  )
}

export default Layout
