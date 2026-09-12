import React, { createContext, useContext, useState, useEffect } from 'react'
import initialData from '../data/mockData'

const STORAGE_KEY = 'c4gt_activities_v1'
const DataContext = createContext()

export function DataProvider({ children }) {
  const [activities, setActivities] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch (e) {
      console.warn('Failed to parse activities from localStorage', e)
    }
    return initialData.activities || []
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
    } catch (e) {
      console.warn('Failed to persist activities to localStorage', e)
    }
  }, [activities])

  function addActivity(payload) {
    const item = { id: 'a' + (Date.now()), status: 'Pending', ...payload }
    setActivities(prev => [item, ...prev])
    return item
  }

  function updateActivityStatus(id, status) {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  // allow updating status with additional metadata, e.g. rejection reason
  function updateActivityStatusWithMeta(id, status, meta) {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status, ...(meta || {}) } : a))
  }

  return (
    <DataContext.Provider value={{ activities, addActivity, updateActivityStatus, updateActivityStatusWithMeta }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() { return useContext(DataContext) }

export default DataContext
