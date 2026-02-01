import React from 'react'
import { motion } from 'framer-motion'
import { FaMoon, FaSun } from 'react-icons/fa'
import './DarkModeToggle.css'

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <motion.button
      className={`dark-mode-toggle ${darkMode ? 'dark' : ''}`}
      onClick={() => setDarkMode(!darkMode)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        className="toggle-icon"
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </motion.div>
    </motion.button>
  )
}

export default DarkModeToggle
