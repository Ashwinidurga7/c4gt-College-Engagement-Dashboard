import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'

const AuthContext = createContext()

function loadUsers() {
  try {
    const raw = localStorage.getItem('c4gt_users')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem('c4gt_users', JSON.stringify(users))
  } catch {}
}

const demoUsers = [
  {
    id: 'faculty_demo',
    name: 'Faculty User',
    email: 'faculty@c4gt.edu',
    password: '123456',
    role: 'Faculty',
    emailVerified: true,
  },
  {
    id: 'hod_demo',
    name: 'HOD User',
    email: 'hod@c4gt.edu',
    password: '123456',
    role: 'HOD',
    emailVerified: true,
  },
  {
    id: 'admin_demo',
    name: 'Admin User',
    email: 'admin@c4gt.edu',
    password: '123456',
    role: 'Admin',
    emailVerified: true,
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('c4gt_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('c4gt_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('c4gt_user')
      }
    } catch {}
  }, [user])

  const login = useCallback(async (identifier, password, role = 'Faculty') => {
    const value = String(identifier || '').trim()
    const pass = String(password || '').trim()

    if (!value || !pass) {
      return {
        ok: false,
        error: role === 'Student'
          ? 'Roll Number and password are required'
          : 'Email and password are required',
      }
    }

    /* STUDENT */
    if (role === 'Student') {
      const rollNumber = value.toUpperCase()

      if (pass !== rollNumber) {
        return {
          ok: false,
          error: 'Student password must be the same as the Roll Number',
        }
      }

      const student = {
        id: `student_${rollNumber}`,
        name: rollNumber,
        rollNumber,
        email: '',
        password: rollNumber,
        role: 'Student',
        department: '',
        emailVerified: true,
      }

      setUser(student)

      return {
        ok: true,
        user: student,
      }
    }

    /* FACULTY / HOD / ADMIN DEMO LOGIN */
    const users = [...demoUsers, ...loadUsers()]

    const found = users.find(
      (item) =>
        String(item.email || '').toLowerCase() === value.toLowerCase() &&
        item.password === pass &&
        String(item.role).toLowerCase() === String(role).toLowerCase()
    )

    if (!found) {
      return {
        ok: false,
        error: 'Invalid email or password',
      }
    }

    setUser(found)

    return {
      ok: true,
      user: found,
    }
  }, [])

  const signup = useCallback(async ({ name, email, password }) => {
    const n = String(name || '').trim()
    const e = String(email || '').trim().toLowerCase()
    const p = String(password || '').trim()

    if (!n || !e || !p) {
      return {
        ok: false,
        error: 'Name, email and password are required',
      }
    }

    const users = loadUsers()

    if (users.find((u) => String(u.email).toLowerCase() === e)) {
      return {
        ok: false,
        error: 'Email already registered',
      }
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name: n,
      email: e,
      password: p,
      role: 'Student',
      department: '',
      rollNumber: '',
      emailVerified: true,
    }

    users.push(newUser)
    saveUsers(users)
    setUser(newUser)

    return {
      ok: true,
      user: newUser,
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext