import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import QuizPage from './pages/QuizPage'
import GamesPage from './pages/GamesPage'
import ChatbotPage from './pages/ChatbotPage'
import AIUsagePage from './pages/AIUsagePage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="ai-usage" element={<AIUsagePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
