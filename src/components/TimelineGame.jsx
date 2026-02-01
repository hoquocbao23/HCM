import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaCheckCircle, FaTrophy, FaRedo, FaHistory } from 'react-icons/fa'
import './TimelineGame.css'

const TimelineGame = ({ darkMode }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [events, setEvents] = useState([])
  const [selectedEvents, setSelectedEvents] = useState([])
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const correctOrder = [
    {
      id: 1,
      year: '1911',
      event: 'Hồ Chí Minh ra đi tìm đường cứu nước',
      description: 'Bắt đầu hành trình tìm hiểu các tư tưởng cách mạng thế giới'
    },
    {
      id: 2,
      year: '1920',
      event: 'Tham gia Đảng Cộng sản Pháp',
      description: 'Tiếp thu chủ nghĩa Mác-Lênin và tư tưởng quốc tế vô sản'
    },
    {
      id: 3,
      year: '1945',
      event: 'Tuyên ngôn Độc lập',
      description: 'Khẳng định quyền độc lập, tự do của dân tộc Việt Nam'
    },
    {
      id: 4,
      year: '1946',
      event: 'Thư gửi nhân dân thế giới',
      description: 'Kêu gọi đoàn kết quốc tế, "Làm bạn với tất cả các nước dân chủ"'
    },
    {
      id: 5,
      year: '1954',
      event: 'Chiến thắng Điện Biên Phủ',
      description: 'Khẳng định vị thế Việt Nam trên trường quốc tế'
    },
    {
      id: 6,
      year: '1960',
      event: 'Thành lập Mặt trận Dân tộc Giải phóng miền Nam',
      description: 'Mở rộng đoàn kết quốc tế, tranh thủ sự ủng hộ của nhân dân thế giới'
    }
  ]

  useEffect(() => {
    // Xáo trộn events
    setEvents([...correctOrder].sort(() => Math.random() - 0.5))
  }, [])

  const handleEventClick = (event) => {
    if (selectedEvents.find(e => e.id === event.id)) return // Đã được chọn
    
    const newSelected = [...selectedEvents, event]
    setSelectedEvents(newSelected)

    // Kiểm tra xem đã chọn đúng chưa
    if (newSelected.length === correctOrder.length) {
      checkOrder(newSelected)
    }
  }

  const checkOrder = (selected) => {
    let correct = 0
    selected.forEach((event, index) => {
      if (event.id === correctOrder[index].id) {
        correct++
      }
    })
    
    setScore(Math.round((correct / correctOrder.length) * 100))
    setGameComplete(true)
  }

  const resetGame = () => {
    setEvents([...correctOrder].sort(() => Math.random() - 0.5))
    setSelectedEvents([])
    setScore(0)
    setGameComplete(false)
  }

  const removeFromSelected = (eventId) => {
    setSelectedEvents(selectedEvents.filter(e => e.id !== eventId))
  }

  return (
    <section id="timeline-game" ref={ref} className={`section timeline-game ${darkMode ? 'dark' : ''}`}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Trò chơi: Sắp xếp Timeline</h2>
          <div className="section-divider"></div>
          <p className="section-intro">
            Sắp xếp các sự kiện theo đúng thứ tự thời gian
          </p>
        </motion.div>

        {!gameComplete ? (
          <div className="timeline-game-board">
            <div className="available-events">
              <h3>Sự kiện</h3>
              <div className="events-list">
                {events
                  .filter(e => !selectedEvents.find(se => se.id === e.id))
                  .map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="event-card available"
                      onClick={() => handleEventClick(event)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="event-year">{event.year}</div>
                      <div className="event-title">{event.event}</div>
                      <div className="event-description">{event.description}</div>
                    </motion.div>
                  ))}
              </div>
            </div>

            <div className="timeline-container">
              <h3>Timeline của bạn</h3>
              <div className="timeline-line">
                {selectedEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="timeline-item"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="timeline-marker">{index + 1}</div>
                    <div className="timeline-content">
                      <div className="event-year">{event.year}</div>
                      <div className="event-title">{event.event}</div>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromSelected(event.id)}
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))}
                {selectedEvents.length === 0 && (
                  <div className="empty-timeline">
                    <FaHistory />
                    <p>Kéo hoặc click vào các sự kiện để sắp xếp</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            className="game-result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaTrophy className="trophy-icon" />
            <h2>Hoàn thành!</h2>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-percent">%</span>
              </div>
            </div>
            <div className="correct-order">
              <h3>Thứ tự đúng:</h3>
              {correctOrder.map((event, index) => {
                const isCorrect = selectedEvents[index]?.id === event.id
                return (
                  <div key={event.id} className={`order-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <span className="order-number">{index + 1}</span>
                    <div className="order-content">
                      <strong>{event.year}</strong> - {event.event}
                    </div>
                    {isCorrect ? <FaCheckCircle className="check-icon" /> : null}
                  </div>
                )
              })}
            </div>
            <button onClick={resetGame} className="reset-btn">
              <FaRedo /> Chơi lại
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default TimelineGame
