/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

function StyleHeader() {
  const words = ['Upload', 'Analyze', 'Upskill'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const periodClass = 'text-7xl text-yellow-500'
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 900);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [words.length]);

  return (
    <div className="text-7xl font-bold font-mono">
      {words[currentWordIndex]}<span className={periodClass}>.</span>
      
    </div>
  );
}

export default StyleHeader;