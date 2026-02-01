import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaFlag, FaGlobe, FaShieldAlt, FaBalanceScale, FaRocket } from 'react-icons/fa'
import Timeline from './Timeline'
import './Section2.css'

const Section2 = ({ darkMode }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [activeTab, setActiveTab] = useState('strength')

  const nationalStrength = [
    {
      icon: <FaFlag />,
      title: 'Tinh thần tự lực cánh sinh',
      description: 'Là nền tảng vững chắc, không phụ thuộc vào bất kỳ ai'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Văn hóa và ý chí độc lập',
      description: 'Giữ gìn bản sắc dân tộc trong quá trình hội nhập'
    },
    {
      icon: <FaRocket />,
      title: 'Thực lực nội tại',
      description: 'Sức mạnh thực sự đến từ bên trong, không phải từ sự bảo hộ'
    }
  ]

  const eraStrength = [
    {
      icon: <FaGlobe />,
      title: 'Xu thế hòa bình và tiến bộ',
      description: 'Tận dụng xu thế thời đại để phát triển'
    },
    {
      icon: <FaBalanceScale />,
      title: 'Khoa học kỹ thuật',
      description: 'Tiếp thu tinh hoa nhân loại để làm giàu thêm giá trị Việt Nam'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Sự ủng hộ của nhân dân thế giới',
      description: 'Công lý quốc tế và sự ủng hộ của cộng đồng thế giới'
    }
  ]

  return (
    <section id="section2" ref={ref} className={`section section2 ${darkMode ? 'dark' : ''}`}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            Đoàn kết quốc tế không phải là "đánh đổi bản sắc"
          </h2>
          <div className="section-divider"></div>
          <p className="section-intro">
            Kết hợp <strong>sức mạnh dân tộc</strong> với <strong>sức mạnh thời đại</strong> 
            để tạo nên sức mạnh tổng hợp, không đánh mất bản sắc riêng.
          </p>
        </motion.div>

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'strength' ? 'active' : ''}`}
              onClick={() => setActiveTab('strength')}
            >
              Sức mạnh dân tộc
            </button>
            <button
              className={`tab ${activeTab === 'era' ? 'active' : ''}`}
              onClick={() => setActiveTab('era')}
            >
              Sức mạnh thời đại
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'strength' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="tab-content"
          >
            {activeTab === 'strength' ? (
              <div className="strength-grid">
                {nationalStrength.map((item, index) => (
                  <motion.div
                    key={index}
                    className="strength-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="strength-icon">{item.icon}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="strength-grid">
                {eraStrength.map((item, index) => (
                  <motion.div
                    key={index}
                    className="strength-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="strength-icon">{item.icon}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          className="proof-section"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3>Chứng minh không "đánh đổi bản sắc"</h3>
          <div className="proof-grid">
            <div className="proof-item">
              <div className="proof-number">01</div>
              <h4>Hòa nhập nhưng không hòa tan</h4>
              <p>
                Chúng ta tiếp thu tinh hoa văn hóa nhân loại (sức mạnh thời đại) để làm giàu 
                thêm giá trị Việt Nam, chứ không phải sao chép máy móc.
              </p>
            </div>
            <div className="proof-item">
              <div className="proof-number">02</div>
              <h4>Độc lập tự chủ</h4>
              <p>
                Đoàn kết quốc tế theo phong cách Hồ Chí Minh dựa trên nền tảng "Tự lực cánh sinh 
                là chính". Khi chúng ta có bản sắc riêng và sức mạnh nội tại, chúng ta mới có 
                vị thế để đoàn kết thật sự.
              </p>
            </div>
            <div className="proof-item">
              <div className="proof-number">03</div>
              <h4>Sự bảo hộ thực sự</h4>
              <p>
                Không nằm ở việc "chọn phe", mà nằm ở việc thực thi công lý quốc tế và sự ủng hộ 
                của cộng đồng thế giới đối với một quốc gia có trách nhiệm.
              </p>
            </div>
          </div>
        </motion.div>

        <Timeline darkMode={darkMode} inView={inView} />
      </div>
    </section>
  )
}

export default Section2
