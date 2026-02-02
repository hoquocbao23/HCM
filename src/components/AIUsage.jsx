import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaRobot, FaBullseye, FaShieldAlt, FaCheckCircle, FaUser, FaBook, FaSearch } from 'react-icons/fa'
import './AIUsage.css'

const AIUsage = ({ darkMode }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const tools = [
    {
      name: 'ChatGPT',
      purpose: 'Công cụ AI chính được sử dụng',
      usage: 'Tìm kiếm, tóm tắt và hỗ trợ xử lý nội dung học thuật về Tư tưởng Hồ Chí Minh'
    }
  ]

  const purposes = [
    {
      title: 'Tìm và tóm tắt nội dung bài học',
      description: 'ChatGPT được sử dụng để tìm kiếm, tổng hợp và tóm tắt các nội dung liên quan đến Tư tưởng Hồ Chí Minh về đoàn kết quốc tế từ các nguồn tài liệu chính thống'
    },
    {
      title: 'Gợi ý kịch bản',
      description: 'AI hỗ trợ đề xuất các kịch bản trình bày, cấu trúc bài thuyết trình và cách tiếp cận vấn đề một cách logic và hấp dẫn'
    },
    {
      title: 'Tạo quiz',
      description: 'Hỗ trợ tạo các câu hỏi trắc nghiệm dựa trên nội dung bài học, đảm bảo phù hợp với mục tiêu giáo dục'
    },
    {
      title: 'Hỗ trợ nội dung',
      description: 'AI giúp diễn đạt lại, làm rõ và bổ sung các ý tưởng dựa trên nội dung đã có, không tự tạo nội dung mới'
    }
  ]

  const humanRoles = [
    {
      title: 'Kiểm chứng',
      description: 'Người dùng kiểm tra và xác minh tính chính xác của tất cả thông tin do AI cung cấp, đối chiếu với nguồn gốc'
    },
    {
      title: 'Biên tập',
      description: 'Người dùng chỉnh sửa, biên tập lại nội dung để đảm bảo phù hợp với mục tiêu, phong cách và yêu cầu cụ thể'
    },
    {
      title: 'Trích nguồn',
      description: 'Người dùng xác định và trích dẫn chính xác các nguồn tài liệu, đảm bảo tính minh bạch và có thể kiểm chứng'
    }
  ]

  const sources = [
    {
      name: 'Giáo trình Hồ Chí Minh',
      description: 'Các giáo trình chính thức về Tư tưởng Hồ Chí Minh được sử dụng trong hệ thống giáo dục'
    },
    {
      name: 'Văn kiện Đảng',
      description: 'Các văn kiện, nghị quyết của Đảng Cộng sản Việt Nam liên quan đến đường lối đối ngoại và đoàn kết quốc tế'
    },
    {
      name: 'Liên Hợp Quốc (LHQ)',
      description: 'Các tài liệu, báo cáo và cam kết của Việt Nam tại các tổ chức quốc tế như Liên Hợp Quốc'
    }
  ]

  const limitations = [
    {
      title: 'AI không tự tạo nội dung học thuật',
      description: 'ChatGPT chỉ hỗ trợ tìm kiếm, tóm tắt và diễn đạt lại nội dung từ các nguồn có sẵn. Tất cả nội dung học thuật đều được người dùng kiểm chứng và biên tập từ các nguồn chính thống.'
    },
    {
      title: 'Vai trò của con người là quyết định',
      description: 'Người dùng chịu trách nhiệm kiểm chứng, biên tập và trích nguồn. AI chỉ là công cụ hỗ trợ, không thay thế quá trình nghiên cứu và tư duy của con người.'
    },
    {
      title: 'Xác minh nguồn bắt buộc',
      description: 'Mọi thông tin đều phải được đối chiếu với nguồn gốc (Giáo trình HCM, Văn kiện Đảng, LHQ) trước khi sử dụng. Người dùng xác nhận tính chính xác của từng thông tin.'
    },
    {
      title: 'Trách nhiệm học thuật',
      description: 'Người dùng chịu trách nhiệm hoàn toàn về tính chính xác, tính học thuật và phù hợp của nội dung cuối cùng được trình bày.'
    }
  ]

  return (
    <section id="ai-usage" ref={ref} className={`section ai-usage ${darkMode ? 'dark' : ''}`}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="header-icon">
            <FaRobot />
          </div>
          <h1 className="page-title">Phụ lục: AI Usage</h1>
          <div className="section-divider"></div>
          <p className="section-intro">
            Thông tin về việc sử dụng AI trong quá trình tìm kiếm, tóm tắt và xử lý nội dung bài học
          </p>
        </motion.div>

        {/* Công cụ sử dụng */}
        <motion.div
          className="usage-section"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <h2 className="section-title">
            <FaBullseye className="title-icon" />
            Công cụ sử dụng
          </h2>
          <div className="tools-grid">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                className="tool-card"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <h3>{tool.name}</h3>
                <div className="tool-info">
                  <div className="info-item">
                    <strong>Mục đích:</strong>
                    <p>{tool.purpose}</p>
                  </div>
                  <div className="info-item">
                    <strong>Cách sử dụng:</strong>
                    <p>{tool.usage}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mục đích sử dụng */}
        <motion.div
          className="usage-section"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <h2 className="section-title">
            <FaBullseye className="title-icon" />
            Mục đích sử dụng
          </h2>
          <div className="purposes-grid">
            {purposes.map((purpose, index) => (
              <motion.div
                key={index}
                className="purpose-card"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="purpose-number">{index + 1}</div>
                <h3>{purpose.title}</h3>
                <p>{purpose.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vai trò của con người */}
        <motion.div
          className="usage-section"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
        >
          <h2 className="section-title">
            <FaUser className="title-icon" />
            Vai trò của con người
          </h2>
          <div className="human-roles-grid">
            {humanRoles.map((role, index) => (
              <motion.div
                key={index}
                className="role-card"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1 + index * 0.1 }}
              >
                <div className="role-number">{index + 1}</div>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Nguồn tài liệu */}
        <motion.div
          className="usage-section"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4 }}
        >
          <h2 className="section-title">
            <FaBook className="title-icon" />
            Nguồn tài liệu
          </h2>
          <div className="sources-grid">
            {sources.map((source, index) => (
              <motion.div
                key={index}
                className="source-card"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.5 + index * 0.1 }}
              >
                <FaSearch className="source-icon" />
                <h3>{source.name}</h3>
                <p>{source.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Phạm vi giới hạn */}
        <motion.div
          className="usage-section"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8 }}
        >
          <h2 className="section-title">
            <FaShieldAlt className="title-icon" />
            Phạm vi giới hạn
          </h2>
          <div className="limitations-list">
            {limitations.map((limitation, index) => (
              <motion.div
                key={index}
                className="limitation-card"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.9 + index * 0.1 }}
              >
                <div className="limitation-header">
                  <FaShieldAlt className="limitation-icon" />
                  <h3>{limitation.title}</h3>
                </div>
                <p>{limitation.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Kết luận */}
        <motion.div
          className="usage-section conclusion-section"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5 }}
        >
          <h2 className="section-title">
            <FaCheckCircle className="title-icon" />
            Kết luận
          </h2>
          <div className="conclusion-content">
            <p>
              ChatGPT đã được sử dụng như một công cụ hỗ trợ hiệu quả trong quá trình tìm kiếm, 
              tóm tắt và xử lý nội dung bài học về Tư tưởng Hồ Chí Minh. Tuy nhiên, việc sử dụng AI 
              được thực hiện một cách có trách nhiệm với các nguyên tắc rõ ràng:
            </p>
            <ul className="conclusion-list">
              <li>
                <strong>Tìm kiếm và tóm tắt:</strong> ChatGPT được sử dụng để tìm kiếm và tóm tắt 
                nội dung từ các nguồn chính thống (Giáo trình HCM, Văn kiện Đảng, LHQ), không tự tạo nội dung mới.
              </li>
              <li>
                <strong>Kiểm chứng bắt buộc:</strong> Mọi thông tin do AI cung cấp đều được người dùng 
                kiểm chứng, đối chiếu với nguồn gốc trước khi sử dụng.
              </li>
              <li>
                <strong>Biên tập và trích nguồn:</strong> Người dùng biên tập lại nội dung và trích dẫn 
                chính xác các nguồn tài liệu, đảm bảo tính minh bạch và có thể kiểm chứng.
              </li>
              <li>
                <strong>Trách nhiệm học thuật:</strong> Người dùng chịu trách nhiệm hoàn toàn về tính chính xác, 
                tính học thuật và phù hợp của nội dung cuối cùng được trình bày.
              </li>
            </ul>
            
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AIUsage
