import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaRedo } from 'react-icons/fa'
import './MatchingGame.css'

const MatchingGame = ({ darkMode }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [selectedQuote, setSelectedQuote] = useState(null)
  const [selectedMeaning, setSelectedMeaning] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState([])
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [shuffledMeanings, setShuffledMeanings] = useState([])

  const pairs = [
    {
      quote: "Làm bạn với tất cả các nước dân chủ và không gây thù chuốc oán với một ai",
      meaning: "Đoàn kết quốc tế rộng rãi, không chọn phe, không gây thù oán"
    },
    {
      quote: "Thực lực là cái chiêng, ngoại giao là cái tiếng. Chiêng có to tiếng mới lớn",
      meaning: "Sức mạnh nội tại là nền tảng, ngoại giao là phương tiện phát huy sức mạnh"
    },
    {
      quote: "Ngũ chi tương lân",
      meaning: "Năm châu anh em một nhà - Cách mạng Việt Nam là bộ phận của cách mạng thế giới"
    },
    {
      quote: "Bình đẳng và cùng có lợi",
      meaning: "Hợp tác quốc tế dựa trên nguyên tắc bình đẳng, không phải thực dụng đơn thuần"
    },
    {
      quote: "Tự lực cánh sinh là chính",
      meaning: "Độc lập tự chủ là nền tảng, đoàn kết quốc tế là hỗ trợ"
    },
    {
      quote: "Hòa nhập nhưng không hòa tan",
      meaning: "Tiếp thu tinh hoa nhân loại nhưng giữ vững bản sắc dân tộc"
    }
  ]

  useEffect(() => {
    // Xáo trộn meanings
    const meanings = pairs.map(p => p.meaning)
    setShuffledMeanings([...meanings].sort(() => Math.random() - 0.5))
  }, [])

  useEffect(() => {
    if (selectedQuote !== null && selectedMeaning !== null) {
      const quoteIndex = selectedQuote
      const meaningIndex = shuffledMeanings.indexOf(selectedMeaning)
      
      // Kiểm tra xem có khớp không
      if (pairs[quoteIndex].meaning === selectedMeaning) {
        // Đúng!
        setMatchedPairs([...matchedPairs, { quote: quoteIndex, meaning: meaningIndex }])
        setScore(score + 10)
        
        // Kiểm tra xem đã hoàn thành chưa
        if (matchedPairs.length + 1 === pairs.length) {
          setTimeout(() => setGameComplete(true), 500)
        }
      } else {
        // Sai - shake animation
        setTimeout(() => {
          setSelectedQuote(null)
          setSelectedMeaning(null)
        }, 1000)
      }
    }
  }, [selectedQuote, selectedMeaning])

  const handleQuoteClick = (index) => {
    if (matchedPairs.find(p => p.quote === index)) return // Đã được ghép
    if (selectedQuote === index) {
      setSelectedQuote(null)
    } else {
      setSelectedQuote(index)
    }
  }

  const handleMeaningClick = (meaning) => {
    if (matchedPairs.find(p => p.meaning === shuffledMeanings.indexOf(meaning))) return // Đã được ghép
    if (selectedMeaning === meaning) {
      setSelectedMeaning(null)
    } else {
      setSelectedMeaning(meaning)
    }
  }

  const resetGame = () => {
    setSelectedQuote(null)
    setSelectedMeaning(null)
    setMatchedPairs([])
    setScore(0)
    setGameComplete(false)
    setShuffledMeanings([...pairs.map(p => p.meaning)].sort(() => Math.random() - 0.5))
  }

  const isMatched = (quoteIndex, meaning) => {
    return matchedPairs.some(p => 
      p.quote === quoteIndex && pairs[quoteIndex].meaning === meaning
    )
  }

  return (
    <section id="matching-game" ref={ref} className={`section matching-game ${darkMode ? 'dark' : ''}`}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Trò chơi: Ghép cặp</h2>
          <div className="section-divider"></div>
          <p className="section-intro">
            Ghép các câu nói của Hồ Chí Minh với ý nghĩa tương ứng
          </p>
          <div className="game-score">
            <FaTrophy /> Điểm: {score} / {pairs.length * 10}
          </div>
        </motion.div>

        {!gameComplete ? (
          <div className="game-board">
            <div className="quotes-column">
              <h3>Câu nói</h3>
              {pairs.map((pair, index) => {
                const isMatchedPair = matchedPairs.some(p => p.quote === index)
                const isSelected = selectedQuote === index
                
                return (
                  <motion.div
                    key={index}
                    className={`quote-card ${isMatchedPair ? 'matched' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleQuoteClick(index)}
                    initial={{ opacity: 0, x: -50 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!isMatchedPair ? { scale: 1.05 } : {}}
                    whileTap={!isMatchedPair ? { scale: 0.95 } : {}}
                  >
                    {isMatchedPair && <FaCheckCircle className="match-icon" />}
                    <p>{pair.quote}</p>
                  </motion.div>
                )
              })}
            </div>

            <div className="meanings-column">
              <h3>Ý nghĩa</h3>
              {shuffledMeanings.map((meaning, index) => {
                const isMatched = pairs.some((pair, pairIndex) => 
                  pair.meaning === meaning && matchedPairs.some(p => p.quote === pairIndex)
                )
                const isSelected = selectedMeaning === meaning
                
                return (
                  <motion.div
                    key={index}
                    className={`meaning-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleMeaningClick(meaning)}
                    initial={{ opacity: 0, x: 50 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!isMatched ? { scale: 1.05 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                  >
                    {isMatched && <FaCheckCircle className="match-icon" />}
                    <p>{meaning}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ) : (
          <motion.div
            className="game-complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaTrophy className="trophy-icon" />
            <h2>Chúc mừng!</h2>
            <p>Bạn đã hoàn thành trò chơi với {score}/{pairs.length * 10} điểm</p>
            <button onClick={resetGame} className="reset-btn">
              <FaRedo /> Chơi lại
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default MatchingGame
