import { useState, useContext, createContext, useEffect } from 'react'

const ThemeContext = createContext({})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const [theme, _setTheme] = useState('')

  function setTheme(theme) {
    theme = theme || 'dark'
    if (window.localStorage) {
      window.localStorage.setItem('sparks-theme', theme)
    }
    _setTheme(theme)
  }

  useEffect(() => {
    if (!!theme || !window.localStorage) return
    setTheme(window.localStorage.getItem('sparks-theme'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <main data-theme={theme}>{children}</main>
    </ThemeContext.Provider>
  )
}
