import React from 'react'
import { motion } from 'framer-motion'
import { FaFlag, FaHeart, FaGlobe } from 'react-icons/fa'
import './Footer.css'

const Footer = ({ darkMode }) => {
  return (
    <footer className={`footer ${darkMode ? 'dark' : ''}`}>
      <div className="footer-container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="footer-brand">
            <FaFlag className="footer-icon" />
            <h3>Tư tưởng Hồ Chí Minh về Đoàn kết Quốc tế</h3>
            <p>
              "Làm bạn với tất cả các nước dân chủ và không gây thù chuốc oán với một ai"
            </p>
          </div>
          
          <div className="footer-quote">
            <FaHeart className="quote-icon" />
            <blockquote>
              "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công."
            </blockquote>
            <cite>- Hồ Chí Minh</cite>
          </div>
        </motion.div>
        
        <div className="footer-bottom">
          <p>
            <FaGlobe /> Xây dựng hình ảnh Việt Nam là thành viên có trách nhiệm trong cộng đồng quốc tế
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
