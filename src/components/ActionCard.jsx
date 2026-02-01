import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'
import './ActionCard.css'

const ActionCard = ({ 
  icon, 
  title, 
  description, 
  color, 
  details, 
  delay, 
  inView, 
  darkMode,
  isSelected,
  onSelect
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`action-card ${darkMode ? 'dark' : ''} ${isSelected ? 'selected' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      style={{
        '--card-color': color
      }}
    >
      <motion.div
        className="card-header"
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
      >
        <motion.div
          className="card-icon-wrapper"
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card-icon" style={{ color }}>
            {icon}
          </div>
        </motion.div>
        <h3 className="card-title">{title}</h3>
        <motion.div
          className="expand-icon"
          animate={{ rotate: isSelected ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown />
        </motion.div>
      </motion.div>
      
      <p className="card-description">{description}</p>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="card-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul>
              {details.map((detail, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {detail}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="card-glow"
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        style={{
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`
        }}
      />
    </motion.div>
  )
}

export default ActionCard
