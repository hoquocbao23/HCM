import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaFlag } from 'react-icons/fa'
import './Navbar.css'

const Navbar = ({ darkMode }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''} ${darkMode ? 'dark' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <motion.div
          className="navbar-logo"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFlag className="logo-icon" />
          <span>Tư tưởng Hồ Chí Minh</span>
        </motion.div>
        <div className="navbar-links">
          <button onClick={() => scrollToSection('hero')}>Trang chủ</button>
          <button onClick={() => scrollToSection('section1')}>Mục tiêu chiến lược</button>
          <button onClick={() => scrollToSection('section2')}>Bản sắc dân tộc</button>
          <button onClick={() => scrollToSection('section3')}>Trí thức trẻ</button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
