import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('kiet_theme_mode')
      if (saved === 'dark' || saved === 'light') return saved
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'light' // Default to crisp light mode initially per user preference, but toggleable
      }
    } catch {
      // ignore
    }
    return 'light'
  })

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme)
      document.body.setAttribute('data-theme', theme)
      localStorage.setItem('kiet_theme_mode', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme')
        document.body.classList.add('dark-theme')
      } else {
        document.documentElement.classList.remove('dark-theme')
        document.body.classList.remove('dark-theme')
      }
    } catch {
      // ignore
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
export default ThemeContext
