import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { RealtimeProvider } from '../../contexts/RealtimeContext'

export default function DashboardLayout({ children, role }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  useEffect(() => {
    if (
      user &&
      role &&
      String(user.role).toLowerCase() !== String(role).toLowerCase()
    ) {
      navigate(`/${String(user.role).toLowerCase()}`)
    }
  }, [user, role, navigate])

  if (!user) return null

  return (
    <RealtimeProvider>
      <div className="app-shell">
        <Sidebar role={role} />
        <div className="app-content">
          <Topbar />
          <main className="app-page">
            <div className="app-page-inner">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RealtimeProvider>
  )
}