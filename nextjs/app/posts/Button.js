"use client"

import { useState, useEffect } from 'react';

export default function Button() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        setIsDarkMode(true);
      }
    }, []);
  
    const toggleTheme = () => {
      if (isDarkMode) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      }
      setIsDarkMode(!isDarkMode);
    };


  return (
    <button onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}