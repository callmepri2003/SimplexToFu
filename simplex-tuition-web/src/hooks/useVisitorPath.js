import { useState, useEffect } from 'react'

const STORAGE_KEY = 'simplex_visitor_path'
const STORAGE_EXPIRY = 'simplex_visitor_path_expiry'
const EXPIRY_DAYS = 30

export function useVisitorPath() {
  const [path, setPath] = useState(null)
  const [modalSeen, setModalSeen] = useState(false)

  useEffect(() => {
    const expiry = localStorage.getItem(STORAGE_EXPIRY)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && expiry && Date.now() < Number(expiry)) {
      setPath(stored)
      setModalSeen(true)
    }
  }, [])

  const savePath = (selectedPath) => {
    const expiry = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
    localStorage.setItem(STORAGE_KEY, selectedPath)
    localStorage.setItem(STORAGE_EXPIRY, String(expiry))
    setPath(selectedPath)
    setModalSeen(true)
  }

  const resetPath = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_EXPIRY)
    setPath(null)
    setModalSeen(false)
  }

  return { path, modalSeen, savePath, resetPath }
}
