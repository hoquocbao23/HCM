import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaVolumeUp, FaVolumeMute, FaTrophy, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { quizQuestions } from '../data/quizQuestions'
import Leaderboard from './Leaderboard'
import MultiplayerQuiz from './MultiplayerQuiz'
import './Quiz.css'

const Quiz = ({ darkMode }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showMultiplayer, setShowMultiplayer] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState([])
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  
  const synthRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    // Khởi tạo Web Speech API
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    // Xáo trộn câu hỏi
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 10)
    setShuffledQuestions(shuffled)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, timeLeft])

  useEffect(() => {
    if (isPlaying && !isMuted && shuffledQuestions[currentQuestionIndex]) {
      speakQuestion(shuffledQuestions[currentQuestionIndex].question)
    }
  }, [currentQuestionIndex, isPlaying, isMuted])

  const speakQuestion = (text) => {
    if (synthRef.current && !isMuted) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'vi-VN'
      utterance.rate = 0.9
      utterance.pitch = 1
      synthRef.current.speak(utterance)
    }
  }

  const handleStart = () => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên của bạn!')
      return
    }
    setIsPlaying(true)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeLeft(30)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnsweredQuestions([])
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 10)
    setShuffledQuestions(shuffled)
  }

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    const currentQuestion = shuffledQuestions[currentQuestionIndex]
    const isCorrect = answerIndex === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore(prev => prev + 10)
    }

    setAnsweredQuestions(prev => [...prev, {
      question: currentQuestion.question,
      selected: answerIndex,
      correct: currentQuestion.correctAnswer,
      isCorrect
    }])

    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setTimeLeft(30)
      } else {
        handleFinish()
      }
    }, 2000)
  }

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1) // -1 means time up
      setAnsweredQuestions(prev => [...prev, {
        question: shuffledQuestions[currentQuestionIndex].question,
        selected: -1,
        correct: shuffledQuestions[currentQuestionIndex].correctAnswer,
        isCorrect: false
      }])

      setTimeout(() => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          setSelectedAnswer(null)
          setTimeLeft(30)
        } else {
          handleFinish()
        }
      }, 2000)
    }
  }

  const handleFinish = () => {
    setIsPlaying(false)
    setShowResult(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (synthRef.current) {
      synthRef.current.cancel()
    }

    // Lưu điểm vào localStorage
    const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]')
    leaderboard.push({
      name: playerName,
      score: score,
      date: new Date().toISOString(),
      totalQuestions: shuffledQuestions.length
    })
    leaderboard.sort((a, b) => b.score - a.score)
    localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard.slice(0, 100)))
  }

  const handleReset = () => {
    setIsPlaying(false)
    setShowResult(false)
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setTimeLeft(30)
    setAnsweredQuestions([])
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex]

  if (showMultiplayer) {
    return (
      <MultiplayerQuiz
        darkMode={darkMode}
        playerName={playerName}
        onBack={() => setShowMultiplayer(false)}
      />
    )
  }

  return (
    <section id="quiz" ref={ref} className={`section quiz-section ${darkMode ? 'dark' : ''}`}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Quiz: Kiểm tra kiến thức</h2>
          <div className="section-divider"></div>
          <p className="section-intro">
            Thử thách hiểu biết của bạn về Tư tưởng Hồ Chí Minh về Đoàn kết Quốc tế
          </p>
        </motion.div>

        {!isPlaying && !showResult && (
          <motion.div
            className="quiz-start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="start-card">
              <FaTrophy className="start-icon" />
              <h3>Bắt đầu Quiz</h3>
              <input
                type="text"
                placeholder="Nhập tên của bạn"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="player-name-input"
                maxLength={20}
              />
              <div className="quiz-info">
                <p>📝 10 câu hỏi trắc nghiệm</p>
                <p>⏱️ 30 giây mỗi câu</p>
                <p>🎯 10 điểm mỗi câu đúng</p>
                <p>🔊 Có giọng đọc tự động</p>
              </div>
              <div className="start-buttons">
                <button onClick={handleStart} className="btn-primary" disabled={!playerName.trim()}>
                  Bắt đầu Quiz
                </button>
                <button onClick={() => setShowMultiplayer(true)} className="btn-secondary">
                  Chơi cùng bạn bè
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {isPlaying && currentQuestion && (
            <motion.div
              className="quiz-game"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <div className="quiz-header">
                <div className="quiz-progress">
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
                    />
                  </div>
                  <span>Câu {currentQuestionIndex + 1} / {shuffledQuestions.length}</span>
                </div>
                <div className="quiz-stats">
                  <div className="stat-item">
                    <FaTrophy /> {score} điểm
                  </div>
                  <div className="stat-item">
                    <FaClock /> {timeLeft}s
                  </div>
                  <button
                    className="mute-button"
                    onClick={() => {
                      setIsMuted(!isMuted)
                      if (synthRef.current) {
                        synthRef.current.cancel()
                      }
                    }}
                  >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                </div>
              </div>

              <motion.div
                className="question-card"
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="question-text">{currentQuestion.question}</h3>
                <div className="options-grid">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrect = index === currentQuestion.correctAnswer
                    const showResult = selectedAnswer !== null

                    return (
                      <motion.button
                        key={index}
                        className={`option-button ${
                          showResult
                            ? isCorrect
                              ? 'correct'
                              : isSelected && !isCorrect
                              ? 'incorrect'
                              : ''
                            : isSelected
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                        <span className="option-text">{option}</span>
                        {showResult && isCorrect && (
                          <FaCheckCircle className="result-icon correct-icon" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <FaTimesCircle className="result-icon incorrect-icon" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {selectedAnswer !== null && (
                  <motion.div
                    className="explanation"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p><strong>Giải thích:</strong> {currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showResult && (
          <motion.div
            className="quiz-result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="result-card">
              <FaTrophy className="result-trophy" />
              <h2>Kết quả Quiz</h2>
              <div className="result-score">
                <span className="score-number">{score}</span>
                <span className="score-total">/ {shuffledQuestions.length * 10}</span>
              </div>
              <div className="result-percentage">
                {Math.round((score / (shuffledQuestions.length * 10)) * 100)}%
              </div>
              <p className="result-message">
                {score >= 80
                  ? '🎉 Xuất sắc! Bạn hiểu rất rõ về Tư tưởng Hồ Chí Minh!'
                  : score >= 60
                  ? '👍 Tốt lắm! Bạn đã nắm được những kiến thức cơ bản!'
                  : score >= 40
                  ? '💪 Cố gắng thêm! Hãy xem lại nội dung và thử lại!'
                  : '📚 Hãy đọc lại nội dung và thử lại nhé!'}
              </p>
              <div className="result-buttons">
                <button onClick={handleReset} className="btn-primary">
                  Chơi lại
                </button>
                <button onClick={() => setShowLeaderboard(true)} className="btn-secondary">
                  Xem bảng xếp hạng
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showLeaderboard && (
          <Leaderboard
            darkMode={darkMode}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </div>
    </section>
  )
}

export default Quiz
