import React, { useState } from 'react'
import { motion } from 'framer-motion'
import './InteractiveCard.css'

const InteractiveCard = ({ icon, title, description, color, delay, inView, darkMode }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`interactive-card ${darkMode ? 'dark' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -10 }}
      style={{
        '--card-color': color
      }}
    >
      <motion.div
        className="card-icon"
        animate={isHovered ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ color }}
      >
        {icon}
      </motion.div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <motion.div
        className="card-glow"
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`
        }}
      />
    </motion.div>
  )
}

export default InteractiveCard
