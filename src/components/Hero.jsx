import React from 'react'
import { motion } from 'framer-motion'
import { FaGlobe, FaHandshake, FaPeace } from 'react-icons/fa'
import './Hero.css'

const Hero = ({ darkMode }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="hero" className={`hero ${darkMode ? 'dark' : ''}`}>
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-badge">
          <FaGlobe /> Diễn đàn Nghị sĩ trẻ toàn cầu
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="hero-title">
          Tư tưởng Hồ Chí Minh về
          <span className="gradient-text"> Đoàn kết Quốc tế</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="hero-subtitle">
          "Làm bạn với tất cả các nước dân chủ và không gây thù chuốc oán với một ai"
        </motion.p>
        
        <motion.div variants={itemVariants} className="hero-stats">
          <div className="stat-card">
            <FaHandshake className="stat-icon" />
            <div>
              <h3>Đoàn kết</h3>
              <p>Mục tiêu chiến lược</p>
            </div>
          </div>
          <div className="stat-card">
            <FaPeace className="stat-icon" />
            <div>
              <h3>Hòa bình</h3>
              <p>Bền vững lâu dài</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span>Cuộn xuống để khám phá</span>
          <div className="scroll-arrow">↓</div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
