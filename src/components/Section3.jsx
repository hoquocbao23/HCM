import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  FaLanguage, 
  FaGlobe, 
  FaHeart, 
  FaLeaf, 
  FaShieldAlt, 
  FaUsers,
  FaRocket,
  FaHandshake
} from 'react-icons/fa'
import ActionCard from './ActionCard'
import './Section3.css'

const Section3 = ({ darkMode }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [selectedAction, setSelectedAction] = useState(null)

  const actions = [
    {
      icon: <FaLanguage />,
      title: 'Nâng cao năng lực hội nhập',
      description: 'Thành thạo ngoại ngữ, am hiểu luật pháp quốc tế và làm chủ công nghệ (như AI) để tiếng nói Việt Nam vang xa hơn.',
      color: '#667eea',
      details: [
        'Học tập và thành thạo ít nhất 2 ngoại ngữ',
        'Nghiên cứu và hiểu biết về luật pháp quốc tế',
        'Làm chủ công nghệ hiện đại (AI, Blockchain, v.v.)',
        'Tham gia các khóa học quốc tế và trao đổi văn hóa'
      ]
    },
    {
      icon: <FaGlobe />,
      title: 'Lan tỏa văn hóa',
      description: 'Sử dụng các nền tảng số để giới thiệu một Việt Nam hòa bình, năng động và giàu lòng nhân ái đến bạn bè quốc tế.',
      color: '#f093fb',
      details: [
        'Tạo nội dung trên mạng xã hội quốc tế',
        'Tổ chức các sự kiện văn hóa trực tuyến',
        'Chia sẻ câu chuyện về Việt Nam một cách chân thực',
        'Kết nối với cộng đồng quốc tế qua nghệ thuật và văn hóa'
      ]
    },
    {
      icon: <FaHeart />,
      title: 'Ứng xử văn minh',
      description: 'Thể hiện tinh thần "làm bạn với tất cả" thông qua thái độ tôn trọng sự khác biệt, đối thoại thay vì đối đầu trên không gian mạng và đời thực.',
      color: '#4facfe',
      details: [
        'Tôn trọng sự đa dạng văn hóa và quan điểm',
        'Tham gia đối thoại xây dựng thay vì tranh cãi',
        'Thể hiện tinh thần khoan dung và hiểu biết',
        'Xây dựng mạng lưới bạn bè quốc tế tích cực'
      ]
    },
    {
      icon: <FaLeaf />,
      title: 'Đóng góp vào thách thức chung',
      description: 'Tham gia các dự án về biến đổi khí hậu, an ninh mạng và các hoạt động tình nguyện quốc tế để khẳng định Việt Nam là "thành viên có trách nhiệm".',
      color: '#43e97b',
      details: [
        'Tham gia các dự án môi trường quốc tế',
        'Đóng góp vào giải quyết vấn đề an ninh mạng',
        'Tình nguyện trong các tổ chức quốc tế',
        'Chia sẻ kinh nghiệm và giải pháp của Việt Nam'
      ]
    }
  ]

  return (
    <section id="section3" ref={ref} className={`section section3 ${darkMode ? 'dark' : ''}`}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            Vai trò của trí thức trẻ
          </h2>
          <div className="section-divider"></div>
          <p className="section-intro">
            Là một trí thức trẻ, chúng ta không chỉ thừa hưởng mà còn phải là người 
            <strong> thực thi tư tưởng của Người</strong> thông qua các hành động cụ thể.
          </p>
        </motion.div>

        <div className="actions-grid">
          {actions.map((action, index) => (
            <ActionCard
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              color={action.color}
              details={action.details}
              delay={index * 0.1}
              inView={inView}
              darkMode={darkMode}
              isSelected={selectedAction === index}
              onSelect={() => setSelectedAction(selectedAction === index ? null : index)}
            />
          ))}
        </div>

        <motion.div
          className="call-to-action"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="cta-content">
            <FaRocket className="cta-icon" />
            <h3>Hãy bắt đầu hành động ngay hôm nay</h3>
            <p>
              Mỗi hành động nhỏ của chúng ta đều góp phần xây dựng hình ảnh Việt Nam 
              là thành viên có trách nhiệm trong cộng đồng quốc tế.
            </p>
            <div className="cta-stats">
              <div className="cta-stat">
                <FaUsers />
                <div>
                  <strong>Hàng triệu</strong>
                  <span>Trí thức trẻ Việt Nam</span>
                </div>
              </div>
              <div className="cta-stat">
                <FaHandshake />
                <div>
                  <strong>Hàng trăm</strong>
                  <span>Quốc gia đối tác</span>
                </div>
              </div>
              <div className="cta-stat">
                <FaGlobe />
                <div>
                  <strong>Toàn cầu</strong>
                  <span>Tầm ảnh hưởng</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Section3
