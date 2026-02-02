import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaArrowLeft, FaTrophy, FaClock, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { ref, set, onValue, off, push, update, get } from 'firebase/database'
import { database } from '../config/firebase'
import { quizQuestions } from '../data/quizQuestions'
import './MultiplayerQuiz.css'

const MultiplayerQuiz = ({ darkMode, playerName, onBack }) => {
  // Validate playerName khi component mount
  useEffect(() => {
    if (!playerName || !playerName.trim()) {
      alert('Vui lòng nhập tên của bạn!')
      if (onBack) {
        onBack()
      }
    }
  }, []) // Chỉ chạy một lần khi mount

  const [roomCode, setRoomCode] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [players, setPlayers] = useState([])
  const [gameState, setGameState] = useState('lobby') // lobby, playing, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null) // Đáp án của người chơi hiện tại
  const [playerAnswers, setPlayerAnswers] = useState({}) // Đáp án của tất cả người chơi: { playerName: answerIndex }
  const [scores, setScores] = useState({})
  const [timeLeft, setTimeLeft] = useState(30)
  const [isMuted, setIsMuted] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [isUsingFirebase, setIsUsingFirebase] = useState(false)
  const [showResults, setShowResults] = useState(false) // Flag để show kết quả khi hết thời gian
  
  const synthRef = useRef(null)
  const timerRef = useRef(null)
  const localStoragePollRef = useRef(null)
  const isJoiningRef = useRef(false) // Flag để ngăn tự động join nhiều lần

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
    
    // Kiểm tra Firebase có được cấu hình không
    setIsUsingFirebase(!!database)
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (synthRef.current) synthRef.current.cancel()
      if (localStoragePollRef.current) clearInterval(localStoragePollRef.current)
    }
  }, [])

  // Timer chỉ chạy trên HOST để đồng bộ hoàn toàn
  useEffect(() => {
    // CHỈ HOST mới chạy timer và cập nhật Firebase
    if (gameState === 'playing' && timeLeft > 0 && isHost && database && roomCode) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          const newTime = prev - 1
          
          // HOST cập nhật timeLeft lên Firebase MỖI GIÂY để đồng bộ chính xác
          const roomRef = ref(database, `rooms/${roomCode}`)
          update(roomRef, { timeLeft: newTime })
            .then(() => {
              // Log để debug - chỉ log mỗi 5 giây để không spam
              if (newTime % 5 === 0 || newTime <= 5) {
                console.log('⏱️ Host updated timeLeft:', newTime)
              }
            })
            .catch((error) => {
              console.error('❌ Error updating timeLeft:', error)
            })
          
          return newTime
        })
      }, 1000)
    } else if (gameState === 'playing' && !isHost) {
      // Non-host: Không chạy timer, chỉ sync từ Firebase
      // Timer sẽ được sync từ Firebase listener
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState, timeLeft, isHost, database, roomCode])

  // Polling để sync timeLeft cho non-host (backup nếu Firebase listener chậm)
  useEffect(() => {
    if (gameState === 'playing' && !isHost && database && roomCode && currentQuestionIndex !== undefined) {
      // Polling mỗi giây để sync timeLeft từ Firebase (backup cho listener)
      const syncInterval = setInterval(() => {
        const roomRef = ref(database, `rooms/${roomCode}`)
        get(roomRef)
          .then((snapshot) => {
            const room = snapshot.val()
            if (room && 
                room.gameState === 'playing' && 
                room.timeLeft !== undefined && 
                room.currentQuestion === currentQuestionIndex) {
              setTimeLeft(prev => {
                if (prev !== room.timeLeft) {
                  console.log('🔄 Polling sync timeLeft:', room.timeLeft, 'from', prev)
                  return room.timeLeft
                }
                return prev
              })
            }
          })
          .catch((error) => {
            console.error('Error polling timeLeft:', error)
          })
      }, 1000) // Poll mỗi giây

      return () => clearInterval(syncInterval)
    }
  }, [gameState, isHost, database, roomCode, currentQuestionIndex])

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createRoom = () => {
    const code = generateRoomCode()
    
    if (!database) {
      // Fallback về localStorage nếu Firebase chưa được cấu hình
      console.log('⚠️ Firebase chưa cấu hình, sử dụng localStorage (chỉ hoạt động trên cùng máy)')
      setRoomCode(code)
      setIsHost(true)
      const initialPlayers = [{ name: playerName, id: 'self', score: 0 }]
      setPlayers(initialPlayers)
      localStorage.setItem(`room_${code}`, JSON.stringify({
        code,
        host: playerName,
        players: initialPlayers,
        gameState: 'lobby',
        currentQuestion: 0,
        scores: {},
        shuffledQuestions: []
      }))
      
      // Bắt đầu polling để sync với localStorage (chỉ cho localStorage)
      startLocalStoragePolling(code)
      return
    }

    const roomRef = ref(database, `rooms/${code}`)
    const roomData = {
      code: code,
      host: playerName,
      players: [{ name: playerName, id: 'self', score: 0 }],
      gameState: 'lobby',
      currentQuestion: 0,
      scores: {},
      shuffledQuestions: [],
      createdAt: Date.now()
    }

    set(roomRef, roomData)
      .then(() => {
        setRoomCode(code)
        setIsHost(true)
        setPlayers(roomData.players)
        setScores({})
      })
      .catch((error) => {
        console.error('Error creating room:', error)
        alert('Không thể tạo phòng. Vui lòng thử lại!')
      })
  }

  const joinRoom = (event) => {
    debugger;
    console.log('joinRoom', roomCode)
    // Ngăn chặn tự động join nhiều lần
    if (isJoiningRef.current) {
      console.log('⚠️ Đang trong quá trình join, bỏ qua...')
      return
    }

    // Ngăn chặn mọi event propagation
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    const trimmedCode = roomCode.trim().toUpperCase()

    // Validation NGHIÊM NGẶT - chỉ cho phép join khi đủ 6 ký tự
    if (!trimmedCode || trimmedCode.length !== 6) {
      console.log(`❌ Không thể join: mã phòng "${trimmedCode}" chỉ có ${trimmedCode.length} ký tự`)
      return // Không alert để tránh spam khi đang nhập
    }

    // Đảm bảo chỉ chứa chữ cái và số
    if (!/^[A-Z0-9]{6}$/.test(trimmedCode)) {
      console.log(`❌ Mã phòng chứa ký tự không hợp lệ: "${trimmedCode}"`)
      alert('Mã phòng chỉ được chứa chữ cái và số!')
      return
    }

    // Chuẩn hoá lại state
    if (trimmedCode !== roomCode) {
      setRoomCode(trimmedCode)
    }
    
    // Đánh dấu đang join để tránh duplicate calls
    isJoiningRef.current = true
    console.log(`✅ Đang tham gia phòng: ${trimmedCode}`)

    if (!database) {
      // Fallback về localStorage
      console.log('⚠️ Firebase chưa cấu hình, sử dụng localStorage (chỉ hoạt động trên cùng máy)')
      const roomData = localStorage.getItem(`room_${trimmedCode}`)
      if (!roomData) {
        alert('Không tìm thấy phòng!')
        isJoiningRef.current = false // Reset flag
        return
      }

      const room = JSON.parse(roomData)
      
      // Kiểm tra xem đã có trong phòng chưa
      const existingPlayer = room.players?.find(p => p.name === playerName)
      if (existingPlayer) {
        setPlayers(room.players)
        setIsHost(room.host === playerName)
        setScores(room.scores || {})
        if (room.gameState === 'playing') {
          setGameState('playing')
          setCurrentQuestionIndex(room.currentQuestion || 0)
          setShuffledQuestions(room.shuffledQuestions || [])
        }
        startLocalStoragePolling(roomCode)
        isJoiningRef.current = false // Reset flag
        return
      }

      const newPlayer = { name: playerName, id: Date.now().toString(), score: 0 }
      room.players = room.players || []
      room.players.push(newPlayer)
      setPlayers(room.players)
      setIsHost(false)
      setScores(room.scores || {})
      localStorage.setItem(`room_${trimmedCode}`, JSON.stringify(room))
      
      // Bắt đầu polling để sync với localStorage
      startLocalStoragePolling(trimmedCode)
      isJoiningRef.current = false // Reset flag
      return
    }

    const roomRef = ref(database, `rooms/${trimmedCode}`)
    
    // Kiểm tra phòng có tồn tại không
    get(roomRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          alert('Không tìm thấy phòng!')
          isJoiningRef.current = false // Reset flag
          return
        }

        const room = snapshot.val()
        
        // Kiểm tra xem người chơi đã có trong phòng chưa
        const existingPlayer = room.players?.find(p => p.name === playerName)
        if (existingPlayer) {
          setPlayers(room.players || [])
          setIsHost(room.host === playerName)
          setScores(room.scores || {})
          
          // Sync trạng thái game nếu đang chơi
          if (room.gameState === 'playing') {
            setGameState('playing')
            setCurrentQuestionIndex(room.currentQuestion || 0)
            setShuffledQuestions(room.shuffledQuestions || [])
          }
          isJoiningRef.current = false // Reset flag
          return
        }

        const newPlayer = { 
          name: playerName, 
          id: Date.now().toString(), 
          score: 0 
        }
        
        // Thêm người chơi mới vào danh sách
        const currentPlayers = room.players || []
        
        // Cập nhật danh sách players
        update(ref(database, `rooms/${trimmedCode}`), {
          players: [...currentPlayers, newPlayer]
        })
          .then(() => {
            setPlayers([...currentPlayers, newPlayer])
            setIsHost(false)
            setScores(room.scores || {})
            
            // Nếu game đã bắt đầu, sync trạng thái
            if (room.gameState === 'playing') {
              setGameState('playing')
              setCurrentQuestionIndex(room.currentQuestion || 0)
              setShuffledQuestions(room.shuffledQuestions || [])
            }
            isJoiningRef.current = false // Reset flag khi thành công
          })
          .catch((error) => {
            console.error('Error joining room:', error)
            alert('Không thể tham gia phòng!')
            isJoiningRef.current = false // Reset flag khi lỗi
          })
      })
      .catch((error) => {
        console.error('Error checking room:', error)
        alert('Không thể kiểm tra phòng!')
        isJoiningRef.current = false // Reset flag khi lỗi
      })
  }

  const startGame = () => {
    if (!isHost) {
      console.log('⚠️ Chỉ host mới có thể bắt đầu game')
      return
    }
    
    // Kiểm tra số lượng người chơi
    const currentPlayersCount = players.length
    console.log(`👥 Số người chơi hiện tại: ${currentPlayersCount}`)
    
    if (currentPlayersCount < 2) {
      alert(`Cần ít nhất 2 người chơi để bắt đầu game! Hiện tại có ${currentPlayersCount} người chơi.`)
      return
    }
    
    console.log(`🎮 Bắt đầu game với ${currentPlayersCount} người chơi`)
    
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 10)
    
    // Reset playerAnswers và showResults khi bắt đầu game
    setPlayerAnswers({})
    setShowResults(false)
    setSelectedAnswer(null)
    
    if (!database) {
      // Fallback về localStorage
      console.log('📦 Cập nhật localStorage (chỉ hoạt động trên cùng máy)')
      const roomData = localStorage.getItem(`room_${roomCode}`)
      if (roomData) {
        const room = JSON.parse(roomData)
        // Đảm bảo lấy số lượng players mới nhất
        const latestPlayers = room.players || players
        console.log(`📋 Players trong localStorage: ${latestPlayers.length}`)
        
        if (latestPlayers.length < 2) {
          alert(`Cần ít nhất 2 người chơi! Hiện tại có ${latestPlayers.length} người chơi.`)
          return
        }
        
        room.gameState = 'playing'
        room.currentQuestion = 0
        room.shuffledQuestions = shuffled
        room.scores = {} // Reset scores
        room.timeLeft = 30
        room.playerAnswers = {} // Reset playerAnswers
        room.players = latestPlayers // Đảm bảo players được cập nhật
        localStorage.setItem(`room_${roomCode}`, JSON.stringify(room))
        console.log('✅ Đã cập nhật localStorage')
        
        // Set local state SAU KHI đã cập nhật localStorage
        setShuffledQuestions(shuffled)
        setGameState('playing')
        setCurrentQuestionIndex(0)
        setTimeLeft(30)
      } else {
        console.error('❌ Không tìm thấy room data trong localStorage')
      }
      return
    }

    // Cập nhật lên Firebase TRƯỚC - đảm bảo các tab khác nhận được update ngay
    const roomRef = ref(database, `rooms/${roomCode}`)
    const gameData = {
      gameState: 'playing',
      currentQuestion: 0,
      shuffledQuestions: shuffled,
      scores: {}, // Reset scores
      timeLeft: 30, // Reset timeLeft
      playerAnswers: {}, // Reset playerAnswers
      showResults: false // Reset showResults
    }
    
    // Sử dụng update() để ghi nhanh hơn - chỉ update các field cần thiết
    // update() sẽ merge với dữ liệu hiện có, không mất players
    update(roomRef, gameData)
      .then(() => {
        console.log('✅ Firebase: Game started, all data synced')
        // Host cũng set local state SAU KHI Firebase đã được cập nhật
        // Điều này đảm bảo host và các tab khác sync cùng lúc
        setShuffledQuestions(shuffled)
        setGameState('playing')
        setCurrentQuestionIndex(0)
        setTimeLeft(30)
      })
      .catch((error) => {
        console.error('Error starting game:', error)
        alert('Không thể bắt đầu game!')
      })
  }

  const handleAnswer = (answerIndex) => {
    // Người chơi chỉ có thể chọn 1 lần, không được thay đổi
    if (selectedAnswer !== null) {
      console.log('⚠️ Đã chọn đáp án rồi, không thể thay đổi:', selectedAnswer)
      return
    }

    console.log('✅ Người chơi chọn đáp án:', answerIndex, 'playerName:', playerName)

    // Lưu đáp án của người chơi hiện tại NGAY LẬP TỨC
    setSelectedAnswer(answerIndex)
    
    // Cập nhật playerAnswers lên Firebase để các tab khác biết
    const updatedPlayerAnswers = { ...playerAnswers, [playerName]: answerIndex }
    setPlayerAnswers(updatedPlayerAnswers)

    if (database && roomCode) {
      const playerAnswersRef = ref(database, `rooms/${roomCode}/playerAnswers`)
      update(playerAnswersRef, { [playerName]: answerIndex })
        .then(() => {
          console.log('✅ Đã cập nhật playerAnswer lên Firebase:', playerName, '=', answerIndex)
        })
        .catch((error) => {
          console.error('❌ Error updating player answer:', error)
        })
    } else {
      // Fallback cho localStorage
      const roomData = localStorage.getItem(`room_${roomCode}`)
      if (roomData) {
        const room = JSON.parse(roomData)
        room.playerAnswers = room.playerAnswers || {}
        room.playerAnswers[playerName] = answerIndex
        localStorage.setItem(`room_${roomCode}`, JSON.stringify(room))
        console.log('✅ Đã cập nhật playerAnswer vào localStorage:', playerName, '=', answerIndex)
      }
    }

    // KHÔNG tính điểm ngay - chỉ tính điểm sau khi hết 30s và show kết quả
    // Logic tính điểm sẽ được xử lý trong handleTimeUp
  }

  const handleTimeUp = () => {
    // CHỈ HOST mới xử lý handleTimeUp
    if (!isHost) return
    
    // Show kết quả khi hết thời gian
    setShowResults(true)
    
    // Tính điểm cho tất cả người chơi sau khi hết thời gian
    const currentQuestion = shuffledQuestions[currentQuestionIndex]
    const correctAnswer = currentQuestion.correctAnswer
    const updatedScores = { ...scores }
    let hasScoreChange = false
    
    // Tính điểm cho tất cả người chơi dựa trên đáp án của họ
    players.forEach(player => {
      const playerAnswer = playerAnswers[player.name]
      // Nếu người chơi đã trả lời và đáp án đúng
      if (playerAnswer !== undefined && playerAnswer !== null && playerAnswer !== -1 && playerAnswer === correctAnswer) {
        const newScore = (updatedScores[player.name] || 0) + 10
        updatedScores[player.name] = newScore
        hasScoreChange = true
        console.log(`✅ ${player.name} trả lời đúng, cộng 10 điểm. Tổng: ${newScore}`)
      }
    })
    
    // Cập nhật điểm số nếu có thay đổi
    if (hasScoreChange) {
      setScores(updatedScores)
    }
    
    // Đánh dấu những người chơi chưa trả lời và cập nhật showResults lên Firebase
    if (database && roomCode) {
      get(ref(database, `rooms/${roomCode}/playerAnswers`))
        .then((snapshot) => {
          const answers = snapshot.val() || {}
          const currentAnswers = { ...playerAnswers, ...answers }
          
          // Đánh dấu -1 cho những người chơi chưa trả lời
          players.forEach(player => {
            if (currentAnswers[player.name] === undefined) {
              currentAnswers[player.name] = -1
            }
          })
          
          setPlayerAnswers(currentAnswers)
          
          // Cập nhật playerAnswers, showResults và scores lên Firebase
          const roomRef = ref(database, `rooms/${roomCode}`)
          const updateData = {
            playerAnswers: currentAnswers,
            showResults: true
          }
          
          // Chỉ cập nhật scores nếu có thay đổi
          if (hasScoreChange) {
            updateData.scores = updatedScores
          }
          
          update(roomRef, updateData)
            .then(() => {
              if (hasScoreChange) {
                console.log('✅ Đã cập nhật scores lên Firebase:', updatedScores)
              }
            })
            .catch((error) => {
              console.error('Error updating player answers, showResults and scores:', error)
            })
        })
        .catch((error) => {
          console.error('Error getting player answers:', error)
          // Vẫn cập nhật showResults và scores nếu không lấy được playerAnswers
          const roomRef = ref(database, `rooms/${roomCode}`)
          const updateData = { showResults: true }
          if (hasScoreChange) {
            updateData.scores = updatedScores
          }
          update(roomRef, updateData)
            .catch((err) => {
              console.error('Error updating showResults and scores:', err)
            })
        })
    } else {
      // Fallback cho localStorage
      if (hasScoreChange) {
        const roomData = localStorage.getItem(`room_${roomCode}`)
        if (roomData) {
          const room = JSON.parse(roomData)
          room.scores = updatedScores
          room.showResults = true
          localStorage.setItem(`room_${roomCode}`, JSON.stringify(room))
        }
      }
    }
    
    // Sau 2s show kết quả, chuyển sang câu tiếp theo
    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1
        
        // Reset tất cả state cho câu tiếp theo
        setSelectedAnswer(null)
        setPlayerAnswers({})
        setShowResults(false)
        setTimeLeft(30)

        // HOST cập nhật currentQuestion, timeLeft, reset playerAnswers và showResults lên Firebase
        if (database && roomCode) {
          const roomRef = ref(database, `rooms/${roomCode}`)
          update(roomRef, { 
            currentQuestion: nextIndex,
            timeLeft: 30,
            playerAnswers: {},
            showResults: false
          })
            .then(() => {
              setCurrentQuestionIndex(nextIndex)
            })
            .catch((error) => {
              console.error('Error updating question (timeUp):', error)
              setCurrentQuestionIndex(nextIndex)
            })
        } else {
          // Fallback cho localStorage
          const roomData = localStorage.getItem(`room_${roomCode}`)
          if (roomData) {
            const room = JSON.parse(roomData)
            room.currentQuestion = nextIndex
            room.timeLeft = 30
            room.playerAnswers = {}
            localStorage.setItem(`room_${roomCode}`, JSON.stringify(room))
          }
          setCurrentQuestionIndex(nextIndex)
        }
      } else {
        finishGame()
      }
    }, 2000) // Show kết quả 2s rồi mới chuyển câu
  }

  const finishGame = () => {
    setGameState('results')
    if (timerRef.current) clearInterval(timerRef.current)
    if (synthRef.current) synthRef.current.cancel()

    // Cập nhật trạng thái game lên Firebase
    if (database && roomCode) {
      const roomRef = ref(database, `rooms/${roomCode}`)
      update(roomRef, { gameState: 'results' })
        .catch((error) => {
          console.error('Error finishing game:', error)
        })
    }
  }

  // Polling localStorage để sync khi không dùng Firebase
  // CHỈ được gọi sau khi đã join thành công vào phòng
  const startLocalStoragePolling = (code) => {
    // Đảm bảo code đủ 6 ký tự trước khi bắt đầu polling
    if (!code || code.trim().length !== 6) {
      console.log('⚠️ startLocalStoragePolling: Code không hợp lệ, không bắt đầu polling')
      return
    }

    console.log('🔄 Bắt đầu localStorage polling cho phòng:', code)
    
    if (localStoragePollRef.current) {
      clearInterval(localStoragePollRef.current)
    }
    
    localStoragePollRef.current = setInterval(() => {
      // CHỈ polling khi đã thực sự join vào phòng (có players)
      // Không polling khi đang nhập mã phòng
      if (players.length === 0) {
        return // Không sync nếu chưa join
      }
      
      const roomData = localStorage.getItem(`room_${code}`)
      if (roomData) {
        const room = JSON.parse(roomData)
        
        // Sync players - CHỈ khi đã join vào phòng
        if (room.players && room.players.length > 0) {
          setPlayers(prev => {
            const prevStr = JSON.stringify(prev)
            const newStr = JSON.stringify(room.players)
            return prevStr !== newStr ? room.players : prev
          })
        }
        
        // Sync game state
        if (room.gameState && room.gameState !== gameState) {
          setGameState(room.gameState)
          
          if (room.gameState === 'playing') {
            if (room.shuffledQuestions && room.shuffledQuestions.length > 0) {
              setShuffledQuestions(room.shuffledQuestions)
            }
            if (room.currentQuestion !== undefined) {
              setCurrentQuestionIndex(room.currentQuestion)
              setSelectedAnswer(null)
              setTimeLeft(30)
            }
          }
        }
        
        // Sync scores
        if (room.scores) {
          setScores(prev => {
            const prevStr = JSON.stringify(prev)
            const newStr = JSON.stringify(room.scores)
            return prevStr !== newStr ? room.scores : prev
          })
        }
        
        // Sync current question
        if (room.currentQuestion !== undefined && 
            room.currentQuestion !== currentQuestionIndex && 
            room.gameState === 'playing') {
          setCurrentQuestionIndex(room.currentQuestion)
          setSelectedAnswer(null)
          setTimeLeft(30)
        }
      }
    }, 1000) // Poll mỗi giây
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

  // Fetch dữ liệu ngay lập tức khi gameState thay đổi sang 'playing' (cho non-host)
  // Điều này giúp giảm độ trễ khi Firebase listener chậm
  useEffect(() => {
    if (!isHost && gameState === 'lobby' && roomCode && roomCode.trim().length === 6 && database) {
      // Polling để check gameState thay đổi - chỉ khi đang ở lobby
      const checkInterval = setInterval(() => {
        const roomRef = ref(database, `rooms/${roomCode}`)
        get(roomRef)
          .then((snapshot) => {
            const room = snapshot.val()
            if (room && room.gameState === 'playing' && room.shuffledQuestions && room.shuffledQuestions.length > 0) {
              console.log('⚡ Fast fetch: Game đã bắt đầu, sync ngay lập tức!')
              // Sync tất cả dữ liệu ngay lập tức
              setShuffledQuestions(room.shuffledQuestions)
              setCurrentQuestionIndex(room.currentQuestion !== undefined ? room.currentQuestion : 0)
              setTimeLeft(room.timeLeft !== undefined ? room.timeLeft : 30)
              setSelectedAnswer(null)
              setGameState('playing')
              clearInterval(checkInterval) // Dừng polling khi đã sync
            }
          })
          .catch((error) => {
            console.error('Error fast fetching:', error)
          })
      }, 200) // Poll mỗi 200ms để phát hiện nhanh

      return () => clearInterval(checkInterval)
    }
  }, [isHost, gameState, roomCode, database])

  // Lắng nghe thay đổi realtime từ Firebase
  // CHỈ lắng nghe khi đã join vào phòng (roomCode đủ 6 ký tự và đã join thành công)
  useEffect(() => {
    // CHỈ lắng nghe Firebase khi roomCode đủ 6 ký tự VÀ đã có players (đã join thành công)
    // Điều này ngăn Firebase listener tự động trigger khi đang nhập mã phòng
    if (!roomCode || roomCode.trim().length !== 6 || !database || players.length === 0) {
      return
    }

    console.log('🔔 Firebase listener: Listening to room', roomCode)
    const roomRef = ref(database, `rooms/${roomCode}`)
    let isLocalUpdate = false // Flag để tránh update khi chính mình trigger
    
    // Lắng nghe mọi thay đổi trong phòng
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (isLocalUpdate) {
        isLocalUpdate = false
        return
      }

      const room = snapshot.val()
      
      if (!room) {
        console.log('⚠️ Firebase listener: room is null')
        return
      }
      
      // Debug: Log mỗi khi listener được trigger (chỉ log khi có timeLeft để không spam)
      if (room.timeLeft !== undefined && room.gameState === 'playing') {
        console.log('🔔 Firebase listener triggered:', {
          timeLeft: room.timeLeft,
          currentQuestion: room.currentQuestion,
          gameState: room.gameState,
          isHost,
          localQuestion: currentQuestionIndex,
          localTimeLeft: timeLeft
        })
      }

      // Cập nhật danh sách người chơi
      if (room.players) {
        setPlayers(prev => {
          const prevStr = JSON.stringify(prev)
          const newStr = JSON.stringify(room.players)
          return prevStr !== newStr ? room.players : prev
        })
      }

      // Cập nhật trạng thái game - SYNC NGAY LẬP TỨC
      // Kiểm tra cả shuffledQuestions để đảm bảo có đủ dữ liệu trước khi chuyển màn hình
      const shouldSyncGameState = room.gameState && room.gameState !== gameState
      const hasRoomQuestions = room.shuffledQuestions && room.shuffledQuestions.length > 0
      const hasLocalQuestions = shuffledQuestions && shuffledQuestions.length > 0
      const shouldSyncPlayingData = room.gameState === 'playing' && 
                                    hasRoomQuestions &&
                                    (!hasLocalQuestions || JSON.stringify(shuffledQuestions) !== JSON.stringify(room.shuffledQuestions))
      
      // Sync gameState nếu thay đổi
      if (shouldSyncGameState) {
        console.log('🎮 Sync gameState:', room.gameState, 'from', gameState)
        
        // Nếu game bắt đầu, sync TẤT CẢ dữ liệu cùng lúc để đồng bộ ngay
        if (room.gameState === 'playing') {
          // Đảm bảo có đủ dữ liệu trước khi chuyển màn hình
          if (hasRoomQuestions) {
            // Batch update tất cả state cùng lúc - React sẽ tự động batch các setState
            // Set tất cả state cùng lúc để đảm bảo render một lần duy nhất
            setShuffledQuestions(room.shuffledQuestions)
            setCurrentQuestionIndex(room.currentQuestion !== undefined ? room.currentQuestion : 0)
            setTimeLeft(room.timeLeft !== undefined ? room.timeLeft : 30)
            setSelectedAnswer(null)
            setPlayerAnswers(room.playerAnswers || {})
            setShowResults(room.timeLeft === 0)
            // Set gameState cuối cùng để trigger render
            setGameState('playing')
            console.log('✅ Đã sync tất cả dữ liệu game, chuyển sang màn hình playing')
          } else {
            console.warn('⚠️ Chưa có shuffledQuestions, force fetch ngay...')
            // Nếu chưa có shuffledQuestions, force fetch ngay lập tức
            get(roomRef)
              .then((snapshot) => {
                const fullRoom = snapshot.val()
                if (fullRoom && fullRoom.shuffledQuestions && fullRoom.shuffledQuestions.length > 0) {
                  console.log('⚡ Force fetch thành công, sync ngay!')
                  setShuffledQuestions(fullRoom.shuffledQuestions)
                  setCurrentQuestionIndex(fullRoom.currentQuestion !== undefined ? fullRoom.currentQuestion : 0)
                  setTimeLeft(fullRoom.timeLeft !== undefined ? fullRoom.timeLeft : 30)
                  setSelectedAnswer(null)
                  setPlayerAnswers(fullRoom.playerAnswers || {})
                  setShowResults(false)
                  setGameState('playing')
                } else {
                  // Nếu vẫn chưa có, chỉ sync gameState và đợi
                  setGameState(room.gameState)
                }
              })
              .catch((error) => {
                console.error('Error force fetching:', error)
                setGameState(room.gameState)
              })
          }
        } else {
          // Với các gameState khác, chỉ cần set gameState
          setGameState(room.gameState)
        }
      } 
      // Nếu gameState đã là 'playing' nhưng chưa có dữ liệu đầy đủ, sync ngay
      else if (shouldSyncPlayingData) {
        console.log('🔄 Game đang playing nhưng thiếu dữ liệu, sync ngay...')
        setShuffledQuestions(room.shuffledQuestions)
        setCurrentQuestionIndex(room.currentQuestion !== undefined ? room.currentQuestion : 0)
        setTimeLeft(room.timeLeft !== undefined ? room.timeLeft : 30)
        setSelectedAnswer(null)
        setPlayerAnswers(room.playerAnswers || {})
        setShowResults(room.timeLeft === 0)
        console.log('✅ Đã sync dữ liệu game đầy đủ')
      }

      // Cập nhật điểm số
      if (room.scores) {
        setScores(prev => {
          const prevStr = JSON.stringify(prev)
          const newStr = JSON.stringify(room.scores)
          return prevStr !== newStr ? room.scores : prev
        })
      }

      // Cập nhật playerAnswers từ Firebase - QUAN TRỌNG: sync selectedAnswer ngay
      if (room.playerAnswers && room.gameState === 'playing') {
        const myAnswer = room.playerAnswers[playerName]
        
        // Sync selectedAnswer của người chơi hiện tại
        if (myAnswer !== undefined && myAnswer !== selectedAnswer && room.currentQuestion === currentQuestionIndex) {
          console.log('🔄 Sync selectedAnswer từ Firebase:', myAnswer, 'current:', selectedAnswer, 'question:', room.currentQuestion)
          setSelectedAnswer(myAnswer)
        }
        
        setPlayerAnswers(prev => {
          const prevStr = JSON.stringify(prev)
          const newStr = JSON.stringify(room.playerAnswers)
          if (prevStr !== newStr) {
            return room.playerAnswers
          }
          return prev
        })
      } else if (!room.playerAnswers && Object.keys(playerAnswers).length > 0 && room.gameState === 'playing' && room.currentQuestion === currentQuestionIndex) {
        // Nếu Firebase không có playerAnswers nhưng local có, giữ nguyên (có thể đang trong quá trình sync)
        // Không reset để tránh mất dữ liệu
      }

      // Sync showResults từ timeLeft (khi timeLeft === 0 thì show kết quả)
      // Hoặc sync từ room.showResults nếu có
      if (room.showResults !== undefined) {
        setShowResults(room.showResults)
      } else if (room.timeLeft !== undefined && room.timeLeft === 0 && !showResults) {
        setShowResults(true)
      } else if (room.timeLeft !== undefined && room.timeLeft > 0 && showResults && room.currentQuestion !== undefined) {
        // Reset showResults khi chuyển sang câu mới (timeLeft > 0)
        setShowResults(false)
      }

      // Cập nhật câu hỏi hiện tại - SYNC NGAY LẬP TỨC
      if (room.currentQuestion !== undefined && room.gameState === 'playing') {
        setCurrentQuestionIndex(prev => {
          if (prev !== room.currentQuestion) {
            console.log('📝 Sync currentQuestion:', room.currentQuestion, 'from', prev)
            // Reset selectedAnswer và playerAnswers khi chuyển câu mới
            setSelectedAnswer(null)
            setPlayerAnswers(room.playerAnswers || {})
            setShowResults(false)
            // Khi chuyển câu mới, sync timeLeft từ Firebase (nếu có) hoặc reset về 30
            if (room.timeLeft !== undefined) {
              setTimeLeft(room.timeLeft)
            } else {
              setTimeLeft(30)
            }
            return room.currentQuestion
          }
          return prev
        })
      }
      
      // Sync timeLeft - SYNC NGAY LẬP TỨC cho tất cả tab (QUAN TRỌNG: phải sync để các tab khác đếm ngược)
      // Đảm bảo sync timeLeft cho tất cả tab, không chỉ host
      // Sync khi đang playing và đang ở cùng câu hỏi để đảm bảo timer đếm ngược đúng
      // Không sync khi đang chuyển câu (currentQuestion khác nhau) để tránh conflict
      if (room.gameState === 'playing' && 
          room.timeLeft !== undefined && 
          room.currentQuestion !== undefined &&
          room.currentQuestion === currentQuestionIndex) {
        // Sync timeLeft ngay khi đang playing và ở cùng câu hỏi
        // Sử dụng functional update để tránh stale closure
        setTimeLeft(prev => {
          // Luôn sync từ Firebase để đảm bảo sync ngay lập tức
          // Host update mỗi giây, các tab khác cần sync ngay
          // Không so sánh để đảm bảo luôn sync (tránh miss update do React batching)
          if (prev !== room.timeLeft) {
            console.log('⏱️ Sync timeLeft từ Firebase:', room.timeLeft, 'from', prev, 'isHost:', isHost, 'question:', room.currentQuestion)
            return room.timeLeft
          }
          return prev
        })
      }
    })

    // Cleanup khi component unmount hoặc roomCode thay đổi
    return () => {
      off(roomRef)
    }
  }, [roomCode, database])

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
          
          {players.length === 0 ? (
            <div className="lobby-actions">
              <button onClick={createRoom} className="btn-primary">
                Tạo phòng mới
              </button>
              <div className="divider">hoặc</div>
              <div 
                className="join-section"
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  return false
                }}
              >
                <input
                  type="text"
                  placeholder="Nhập mã phòng (6 ký tự)"
                  value={roomCode}
                  autoComplete="off"
                  onChange={(e) => {
                    // CHỈ cập nhật roomCode state, KHÔNG làm gì khác
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                    
                    // Dừng polling nếu đang chạy (khi đang nhập mã mới)
                    if (localStoragePollRef.current) {
                      clearInterval(localStoragePollRef.current)
                      localStoragePollRef.current = null
                    }
                    
                    // Reset players nếu đang nhập mã mới (chưa join)
                    if (value.length < 6 && players.length > 0) {
                      setPlayers([])
                      setIsHost(false)
                      setGameState('lobby')
                    }
                    
                    if (value.length <= 6) {
                      setRoomCode(value)
                    }
                    
                    // ĐẢM BẢO: Không gọi joinRoom, không gọi startLocalStoragePolling
                  }}
                  onKeyDown={(e) => {
                    // Chỉ cho phép Enter khi đã nhập đủ 6 ký tự
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.stopPropagation()
                      const currentValue = e.target.value.trim().toUpperCase()
                      if (currentValue.length === 6) {
                        joinRoom(e)
                      } else {
                        alert('Vui lòng nhập đủ 6 ký tự mã phòng!')
                      }
                      return false
                    }
                  }}
                  className="room-code-input"
                  maxLength={6}
                />
                <button 
                  onClick={(e) => {
                    console.log('🔘🔘🔘 BUTTON CLICKED! 🔘🔘🔘')
                    console.log('🔘 Event:', e)
                    console.log('🔘 Room code:', roomCode)
                    console.log('🔘 Room code length:', roomCode.trim().length)
                    console.log('🔘 Player name:', playerName)
                    
                    e.preventDefault()
                    e.stopPropagation()
                    
                    const trimmedCode = roomCode.trim().toUpperCase()
                    console.log('🔘 Trimmed code:', trimmedCode, 'length:', trimmedCode.length)
                    
                    if (trimmedCode.length === 6) {
                      console.log('✅ Button: Calling joinRoom with code:', trimmedCode)
                      joinRoom(e)
                    } else {
                      console.log('❌ Button: Code length is', trimmedCode.length, 'not 6')
                      alert('Vui lòng nhập đủ 6 ký tự mã phòng!')
                    }
                  }}
                  onMouseDown={(e) => {
                    console.log('🖱️ Button mouse down')
                  }}
                  onMouseUp={(e) => {
                    console.log('🖱️ Button mouse up')
                  }}
                  className="btn-secondary"
                  disabled={roomCode.trim().length !== 6}
                  type="button"
                  style={{ 
                    pointerEvents: roomCode.trim().length === 6 ? 'auto' : 'none',
                    opacity: roomCode.trim().length === 6 ? 1 : 0.5,
                    cursor: roomCode.trim().length === 6 ? 'pointer' : 'not-allowed'
                  }}
                >
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
                <div className="host-controls">
                  <button 
                    onClick={startGame} 
                    className="btn-primary" 
                    disabled={players.length < 2}
                  >
                    Bắt đầu game ({players.length} người chơi)
                  </button>
                  {players.length < 2 && (
                    <p className="waiting-players-message">
                      ⚠️ Cần ít nhất 2 người chơi để bắt đầu
                    </p>
                  )}
                  {!isUsingFirebase && (
                    <p className="firebase-warning">
                      ⚠️ Đang dùng localStorage - chỉ hoạt động trên cùng máy/tab. 
                      Để chơi qua mạng, cần cấu hình Firebase.
                    </p>
                  )}
                </div>
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
                // Show kết quả khi hết thời gian (timeLeft === 0) hoặc showResults === true
                const showResult = showResults || timeLeft === 0

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
                    disabled={selectedAnswer !== null || showResult}
                    whileHover={selectedAnswer === null && !showResult ? { scale: 1.05 } : {}}
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
