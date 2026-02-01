import React from 'react'
import { motion } from 'framer-motion'
import { FaCircle } from 'react-icons/fa'
import './Timeline.css'

const Timeline = ({ darkMode, inView }) => {
  const timelineItems = [
    {
      title: 'Sức mạnh dân tộc',
      description: 'Tinh thần tự lực cánh sinh, văn hóa và ý chí độc lập',
      position: 'left'
    },
    {
      title: 'Kết hợp',
      description: 'Hòa nhập nhưng không hòa tan',
      position: 'right'
    },
    {
      title: 'Sức mạnh thời đại',
      description: 'Xu thế hòa bình, khoa học kỹ thuật, sự ủng hộ quốc tế',
      position: 'left'
    },
    {
      title: 'Kết quả',
      description: 'Sức mạnh tổng hợp, giữ vững bản sắc, có vị thế quốc tế',
      position: 'right'
    }
  ]

  return (
    <div className={`timeline-container ${darkMode ? 'dark' : ''}`}>
      <h3 className="timeline-title">Quá trình kết hợp sức mạnh</h3>
      <div className="timeline">
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            className={`timeline-item ${item.position}`}
            initial={{ opacity: 0, x: item.position === 'left' ? -50 : 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="timeline-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
            <div className="timeline-marker">
              <FaCircle />
            </div>
          </motion.div>
        ))}
        <div className="timeline-line"></div>
      </div>
    </div>
  )
}

export default Timeline
