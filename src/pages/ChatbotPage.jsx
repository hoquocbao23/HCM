import React from 'react'
import { useOutletContext } from 'react-router-dom'
import EnhancedAIBot from '../components/EnhancedAIBot'
import Footer from '../components/Footer'

const ChatbotPage = () => {
  const { darkMode } = useOutletContext()
  
  return (
    <>
      <EnhancedAIBot darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </>
  )
}

export default ChatbotPage
