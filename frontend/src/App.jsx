/* eslint-disable no-unused-vars */
import { useState } from 'react'
import NavBar from './Components/NavBar'
import { useNavigate } from 'react-router-dom';
import StyleHeader from './Components/StyleHeader'
import { getAuthenticated, setAuthenticated } from './utils/auth';

function App() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isAuthenticated = getAuthenticated(); // Retrieve authentication status
    
    if (!isAuthenticated) {
      navigate('/SignIn'); // Navigate to SignIn if not authenticated
    } else {
      navigate('/Analyze'); // Navigate to analyze if authenticated
    }
  };

  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <NavBar></NavBar>
      <div className="h-screen bg-gradient-to-r from-blue-800 via-violet-800 to-black flex items-center justify-center overflow-hidden">
      <div className="text-white text-center max-w-screen-lg mx-auto px-4">
        <h2 className="text-8xl font-sans font-extrabold text-yellow-500">Welcome to SKANA</h2>
        <br />
        <StyleHeader />
        <br />
        <button 
          className="py-3 px-8 bg-white text-violet-800 rounded-lg font-semibold shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
    </div>
    
  )}

export default App;