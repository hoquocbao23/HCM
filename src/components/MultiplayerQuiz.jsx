import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaArrowLeft, FaTrophy, FaClock, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { quizQuestions } from '../data/quizQuestions'
import './MultiplayerQuiz.css'

const MultiplayerQuiz = ({ darkMode, playerName, onBack }) => {
  const [roomCode, setRoomCode] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [players, setPlayers] = useState([])
  const [gameState, setGameState] = useState('lobby') // lobby, playing, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [scores, setScores] = useState({})
  const [timeLeft, setTimeLeft] = useState(30)
  const [isMuted, setIsMuted] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  
  const synthRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (synthRef.current) synthRef.current.cancel()
    }
  }, [])

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState, timeLeft])

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createRoom = () => {
    const code = generateRoomCode()
    setRoomCode(code)
    setIsHost(true)
    setPlayers([{ name: playerName, id: 'self', score: 0 }])
    // Lưu room vào localStorage (có thể thay bằng Firebase)
    localStorage.setItem(`room_${code}`, JSON.stringify({
      code,
      host: playerName,
      players: [{ name: playerName, id: 'self', score: 0 }],
      gameState: 'lobby',
      currentQuestion: 0
    }))
  }

  const joinRoom = () => {
    if (!roomCode.trim()) {
      alert('Vui lòng nhập mã phòng!')
      return
    }
    
    const roomData = localStorage.getItem(`room_${roomCode}`)
    if (!roomData) {
      alert('Không tìm thấy phòng!')
      return
    }

    const room = JSON.parse(roomData)
    const newPlayer = { name: playerName, id: Date.now().toString(), score: 0 }
    room.players.push(newPlayer)
    setPlayers(room.players)
    setIsHost(false)
    localStorage.setItem(`room_${roomCode}`, JSON.stringify(room))
  }

  const startGame = () => {
    if (!isHost) return
    
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 10)
    setShuffledQuestions(shuffled)
    setGameState('playing')
    setCurrentQuestionIndex(0)
    setTimeLeft(30)
    
    // Cập nhật room state
    const roomData = localStorage.getItem(`room_${roomCode}`)
    if (roomData) {
      const room = JSON.parse(roomData)
      room.gameState = 'playing'
      room.currentQuestion = 0
      localStorage.setItem(`room_${roomCode}`, JSON.stringify(room))
    }
  }

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    const currentQuestion = shuffledQuestions[currentQuestionIndex]
    const isCorrect = answerIndex === currentQuestion.correctAnswer

    if (isCorrect) {
      const newScore = (scores[playerName] || 0) + 10
      setScores(prev => ({ ...prev, [playerName]: newScore }))
    }

    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setTimeLeft(30)
      } else {
        finishGame()
      }
    }, 2000)
  }

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1)
      setTimeout(() => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          setSelectedAnswer(null)
          setTimeLeft(30)
        } else {
          finishGame()
        }
      }, 2000)
    }
  }

  const finishGame = () => {
    setGameState('results')
    if (timerRef.current) clearInterval(timerRef.current)
    if (synthRef.current) synthRef.current.cancel()
  }

  const speakQuestion = (text) => {
    if (synthRef.current && !isMuted) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'vi-VN'
      utterance.rate = 0.9
      synthRef.current.speak(utterance)
    }
  }

  useEffect(() => {
    if (gameState === 'playing' && shuffledQuestions[currentQuestionIndex] && !isMuted) {
      speakQuestion(shuffledQuestions[currentQuestionIndex].question)
    }
  }, [currentQuestionIndex, gameState, isMuted])

  const currentQuestion = shuffledQuestions[currentQuestionIndex]

  if (gameState === 'lobby') {
    return (
      <div className={`multiplayer-quiz ${darkMode ? 'dark' : ''}`}>
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> Quay lại
        </button>
        
        <div className="multiplayer-lobby">
          <FaUsers className="lobby-icon" />
          <h2>Chơi cùng bạn bè</h2>
          
          {!roomCode ? (
            <div className="lobby-actions">
              <button onClick={createRoom} className="btn-primary">
                Tạo phòng mới
              </button>
              <div className="divider">hoặc</div>
              <div className="join-section">
                <input
                  type="text"
                  placeholder="Nhập mã phòng"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="room-code-input"
                  maxLength={6}
                />
                <button onClick={joinRoom} className="btn-secondary">
                  Tham gia phòng
                </button>
              </div>
            </div>
          ) : (
            <div className="room-info">
              <div className="room-code-display">
                <span>Mã phòng:</span>
                <strong>{roomCode}</strong>
              </div>
              <div className="players-list">
                <h3>Người chơi ({players.length})</h3>
                {players.map((player, index) => (
                  <div key={index} className="player-item">
                    {player.name} {player.id === 'self' && '(Bạn)'}
                  </div>
                ))}
              </div>
              {isHost && (
                <button onClick={startGame} className="btn-primary" disabled={players.length < 2}>
                  Bắt đầu game ({players.length} người chơi)
                </button>
              )}
              {!isHost && (
                <p className="waiting-message">Đang chờ chủ phòng bắt đầu...</p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (gameState === 'playing' && currentQuestion) {
    return (
      <div className={`multiplayer-quiz ${darkMode ? 'dark' : ''}`}>
        <div className="multiplayer-game">
          <div className="multiplayer-header">
            <div className="room-info-small">
              <span>Phòng: {roomCode}</span>
              <span>{players.length} người chơi</span>
            </div>
            <div className="multiplayer-stats">
              <div className="stat-item">
                <FaTrophy /> {scores[playerName] || 0} điểm
              </div>
              <div className="stat-item">
                <FaClock /> {timeLeft}s
              </div>
              <button
                className="mute-button"
                onClick={() => {
                  setIsMuted(!isMuted)
                  if (synthRef.current) synthRef.current.cancel()
                }}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
          </div>

          <div className="question-progress">
            Câu {currentQuestionIndex + 1} / {shuffledQuestions.length}
          </div>

          <motion.div
            className="question-card"
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>{currentQuestion.question}</h3>
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
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{option}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (gameState === 'results') {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1])
    
    return (
      <div className={`multiplayer-quiz ${darkMode ? 'dark' : ''}`}>
        <div className="multiplayer-results">
          <FaTrophy className="results-icon" />
          <h2>Kết quả</h2>
          <div className="results-leaderboard">
            {sortedScores.map(([name, score], index) => (
              <div key={name} className={`result-item ${name === playerName ? 'self' : ''}`}>
                <span className="rank">#{index + 1}</span>
                <span className="name">{name} {name === playerName && '(Bạn)'}</span>
                <span className="score">{score} điểm</span>
              </div>
            ))}
          </div>
          <div className="results-buttons">
            <button onClick={onBack} className="btn-primary">
              Về trang chủ
            </button>
            <button onClick={() => {
              setGameState('lobby')
              setCurrentQuestionIndex(0)
              setScores({})
              setSelectedAnswer(null)
            }} className="btn-secondary">
              Chơi lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default MultiplayerQuiz
