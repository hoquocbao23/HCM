import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaBullseye, FaHandshake, FaBalanceScale, FaShieldAlt } from 'react-icons/fa'
import InteractiveCard from './InteractiveCard'
import './Section1.css'

const Section1 = ({ darkMode }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const cards = [
    {
      icon: <FaBullseye />,
      title: 'Mục tiêu chiến lược',
      description: 'Không phải sách lược tạm thời mà là nguyên tắc nhất quán, xuất phát từ bản chất của chế độ ta',
      color: '#667eea'
    },
    {
      icon: <FaHandshake />,
      title: 'Bình đẳng và cùng có lợi',
      description: 'Tìm kiếm lợi ích kinh tế dựa trên nguyên tắc bình đẳng, không phải thực dụng đơn thuần',
      color: '#f093fb'
    },
    {
      icon: <FaBalanceScale />,
      title: 'Ngũ chi tương lân',
      description: 'Coi cách mạng Việt Nam là một bộ phận của cách mạng thế giới, không tách rời',
      color: '#4facfe'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Hòa bình bền vững',
      description: 'Hóa giải mâu thuẫn, tạo lập môi trường hòa bình để phát triển thay vì đối đầu',
      color: '#43e97b'
    }
  ]

  return (
    <section id="section1" ref={ref} className={`section section1 ${darkMode ? 'dark' : ''}`}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            Mục tiêu chiến lược hay sách lược tạm thời?
          </h2>
          <div className="section-divider"></div>
          <p className="section-intro">
            Khẳng định: <strong>Đây là một Mục tiêu chiến lược nhất quán</strong>, 
            không phải là một thủ thuật ngoại giao nhất thời.
          </p>
        </motion.div>

        <div className="cards-grid">
          {cards.map((card, index) => (
            <InteractiveCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              color={card.color}
              delay={index * 0.1}
              inView={inView}
              darkMode={darkMode}
            />
          ))}
        </div>

        <motion.div
          className="content-box"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="content-column">
            <h3>Lý luận cơ bản</h3>
            <ul>
              <li>
                <strong>Xuất phát từ bản chất:</strong> Một quốc gia yêu chuộng hòa bình, 
                lấy nhân nghĩa làm gốc
              </li>
              <li>
                <strong>Ngũ chi tương lân:</strong> Hồ Chí Minh quan niệm cách mạng Việt Nam 
                là một bộ phận của cách mạng thế giới
              </li>
              <li>
                <strong>Không phải thực dụng:</strong> Việc tìm kiếm lợi ích kinh tế là cần thiết 
                nhưng dựa trên nguyên tắc "Bình đẳng và cùng có lợi"
              </li>
            </ul>
          </div>
          <div className="content-column">
            <h3>Tính bền vững</h3>
            <p>
              Trong một thế giới đầy xung đột, việc giữ vững tôn chỉ "làm bạn" giúp Việt Nam 
              hóa giải các mâu thuẫn, tạo lập môi trường hòa bình bền vững để phát triển 
              thay vì bị cuốn vào các vòng xoáy đối đầu tiêu cực.
            </p>
            <div className="highlight-box">
              <p>
                "Thực lực là cái chiêng, ngoại giao là cái tiếng. Chiêng có to tiếng mới lớn."
              </p>
              <span>- Hồ Chí Minh</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Section1
