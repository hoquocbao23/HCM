import React from 'react'
import { useOutletContext } from 'react-router-dom'
import MatchingGame from '../components/MatchingGame'
import TimelineGame from '../components/TimelineGame'
import Footer from '../components/Footer'
import './GamesPage.css'

const GamesPage = () => {
  const { darkMode } = useOutletContext()
  const [activeGame, setActiveGame] = React.useState('matching')

  return (
    <>
      <div className={`games-page ${darkMode ? 'dark' : ''}`}>
        <div className="games-header">
          <h1>Trò chơi tương tác</h1>
          <p>Học tập thông qua các trò chơi thú vị</p>
          <div className="game-tabs">
            <button
              className={`tab-btn ${activeGame === 'matching' ? 'active' : ''}`}
              onClick={() => setActiveGame('matching')}
            >
              Ghép cặp
            </button>
            <button
              className={`tab-btn ${activeGame === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveGame('timeline')}
            >
              Sắp xếp Timeline
            </button>
          </div>
        </div>

        <div className="games-content">
          {activeGame === 'matching' && <MatchingGame darkMode={darkMode} />}
          {activeGame === 'timeline' && <TimelineGame darkMode={darkMode} />}
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </>
  )
}

export default GamesPage
