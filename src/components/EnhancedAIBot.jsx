import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaRobot, FaPaperPlane, FaUser, FaQuoteLeft, FaBook, FaLightbulb, FaHistory } from 'react-icons/fa'
import { findResponse } from '../data/aiBotResponses'
import './EnhancedAIBot.css'

const EnhancedAIBot = ({ darkMode }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Xin chào! Tôi là chatbot được lập trình dựa trên tư tưởng Hồ Chí Minh về đoàn kết quốc tế. Bạn có câu hỏi gì không?',
      source: null
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const quickQuestions = [
    'Có nên chọn phe không?',
    'Đoàn kết quốc tế là gì?',
    'Làm sao giữ bản sắc?',
    'Vai trò của Việt Nam?',
    'Nguyên tắc bình đẳng và cùng có lợi?',
    'Sức mạnh dân tộc và thời đại?'
  ]

  const suggestions = [
    { icon: <FaHistory />, text: 'Lịch sử đoàn kết quốc tế', query: 'Lịch sử đoàn kết quốc tế của Việt Nam' },
    { icon: <FaLightbulb />, text: 'Tư tưởng chính', query: 'Các tư tưởng chính về đoàn kết quốc tế' },
    { icon: <FaBook />, text: 'Ví dụ thực tế', query: 'Ví dụ về đoàn kết quốc tế trong thực tế' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      source: null
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const response = findResponse(inputValue)
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.response,
        source: response.source
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleQuickQuestion = (question) => {
    setInputValue(question)
    setTimeout(() => handleSend(), 100)
  }

  const handleSuggestion = (query) => {
    setInputValue(query)
    setTimeout(() => handleSend(), 100)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section id="enhanced-ai-bot" ref={ref} className={`section enhanced-ai-bot ${darkMode ? 'dark' : ''}`}>
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
          <h1 className="page-title">Tư tưởng Hồ Chí Minh về Đoàn kết Quốc tế</h1>
          <div className="section-divider"></div>
          <p className="section-intro">
            Chatbot được kiểm soát - Tất cả câu trả lời dựa trên tư tưởng Hồ Chí Minh
          </p>
          <div className="bot-warning">
            <FaBook /> Tất cả câu trả lời đều có nguồn tham khảo, không tự tạo nội dung
          </div>
        </motion.div>

        <div className="chat-container">
          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.type}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="message-avatar">
                    {message.type === 'bot' ? <FaRobot /> : <FaUser />}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    {message.source && (
                      <div className="message-source">
                        <FaQuoteLeft className="quote-icon" />
                        <span>{message.source}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                className="message bot typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="message-avatar">
                  <FaRobot />
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="suggestions-section">
              <h4>Gợi ý tìm hiểu:</h4>
              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    className="suggestion-card"
                    onClick={() => handleSuggestion(suggestion.query)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {suggestion.icon}
                    <span>{suggestion.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="quick-questions">
            <span>Câu hỏi nhanh:</span>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Nhập câu hỏi của bạn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send-button" onClick={handleSend}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EnhancedAIBot
