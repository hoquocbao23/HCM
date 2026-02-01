import React from 'react'
import { useOutletContext } from 'react-router-dom'
import Hero from '../components/Hero'
import Section1 from '../components/Section1'
import Section2 from '../components/Section2'
import Section3 from '../components/Section3'
import Footer from '../components/Footer'

const Home = () => {
  const { darkMode } = useOutletContext()
  
  return (
    <>
      <Hero darkMode={darkMode} />
      <Section1 darkMode={darkMode} />
      <Section2 darkMode={darkMode} />
      <Section3 darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </>
  )
}

export default Home
