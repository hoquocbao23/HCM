import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrophy, FaMedal, FaTimes, FaCrown } from 'react-icons/fa'
import './Leaderboard.css'

const Leaderboard = ({ darkMode, onClose }) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [filter, setFilter] = useState('all') // all, today, week, month

  useEffect(() => {
    loadLeaderboard()
  }, [filter])

  const loadLeaderboard = () => {
    const data = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]')
    
    let filtered = [...data]
    const now = new Date()
    
    if (filter === 'today') {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate.toDateString() === now.toDateString()
      })
    } else if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(item => new Date(item.date) >= weekAgo)
    } else if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(item => new Date(item.date) >= monthAgo)
    }
    
    setLeaderboard(filtered)
  }

  const getRankIcon = (index) => {
    if (index === 0) return <FaCrown className="rank-icon gold" />
    if (index === 1) return <FaMedal className="rank-icon silver" />
    if (index === 2) return <FaMedal className="rank-icon bronze" />
    return <span className="rank-number">{index + 1}</span>
  }

  const getRankColor = (index) => {
    if (index === 0) return 'gold'
    if (index === 1) return 'silver'
    if (index === 2) return 'bronze'
    return ''
  }

  return (
    <motion.div
      className={`leaderboard-overlay ${darkMode ? 'dark' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="leaderboard-modal"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="leaderboard-header">
          <div className="leaderboard-title">
            <FaTrophy className="title-icon" />
            <h2>Bảng Xếp Hạng</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="leaderboard-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            Hôm nay
          </button>
          <button
            className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
            onClick={() => setFilter('week')}
          >
            Tuần này
          </button>
          <button
            className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
            onClick={() => setFilter('month')}
          >
            Tháng này
          </button>
        </div>

        <div className="leaderboard-list">
          {leaderboard.length === 0 ? (
            <div className="empty-state">
              <FaTrophy className="empty-icon" />
              <p>Chưa có kết quả nào</p>
              <p className="empty-subtitle">Hãy tham gia quiz để xuất hiện trên bảng xếp hạng!</p>
            </div>
          ) : (
            <AnimatePresence>
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={`${entry.date}-${index}`}
                  className={`leaderboard-item ${getRankColor(index)}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="rank-section">
                    {getRankIcon(index)}
                  </div>
                  <div className="player-info">
                    <div className="player-name">{entry.name}</div>
                    <div className="player-date">
                      {new Date(entry.date).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className="score-section">
                    <div className="score-value">{entry.score}</div>
                    <div className="score-total">/ {entry.totalQuestions * 10}</div>
                    <div className="score-percentage">
                      {Math.round((entry.score / (entry.totalQuestions * 10)) * 100)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="leaderboard-stats">
          <div className="stat-box">
            <div className="stat-label">Tổng người chơi</div>
            <div className="stat-value">{leaderboard.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Điểm cao nhất</div>
            <div className="stat-value">
              {leaderboard.length > 0 ? leaderboard[0].score : 0}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Điểm trung bình</div>
            <div className="stat-value">
              {leaderboard.length > 0
                ? Math.round(leaderboard.reduce((sum, e) => sum + e.score, 0) / leaderboard.length)
                : 0}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Leaderboard
