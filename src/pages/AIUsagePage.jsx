import React from 'react'
import { useOutletContext } from 'react-router-dom'
import AIUsage from '../components/AIUsage'
import Footer from '../components/Footer'

const AIUsagePage = () => {
  const { darkMode } = useOutletContext()
  
  return (
    <>
      <AIUsage darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </>
  )
}

export default AIUsagePage
