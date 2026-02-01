import React from 'react'
import { useOutletContext } from 'react-router-dom'
import Quiz from '../components/Quiz'
import Footer from '../components/Footer'

const QuizPage = () => {
  const { darkMode } = useOutletContext()
  
  return (
    <>
      <Quiz darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </>
  )
}

export default QuizPage
