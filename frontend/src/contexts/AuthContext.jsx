import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { getStudentByRoll, demoStudent } from '../data/academicData'

const AuthContext = createContext()

function loadUsers() {
  try {
    const raw = localStorage.getItem('kiet_users')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem('kiet_users', JSON.stringify(users))
  } catch {}
}

const demoUsers = [
  {
    id: 'faculty_demo',
    name: 'Dr. K. V. Ramana',
    email: 'faculty@kiet.edu',
    altEmails: ['faculty@kietgroup.com', 'faculty@c4gt.edu'],
    validPasswords: ['faculty123', '123456', 'faculty', 'password'],
    role: 'Faculty',
    department: 'Artificial Intelligence & Data Science',
    college: 'Kakinada Institute of Engineering & Technology (KIET)',
    emailVerified: true,
  },
  {
    id: 'hod_demo',
    name: 'Prof. M. S. R. Prasad',
    email: 'hod@kiet.edu',
    altEmails: ['hod@kietgroup.com', 'hod@c4gt.edu'],
    validPasswords: ['hod123', '123456', 'hod', 'password'],
    role: 'HOD',
    department: 'Computer Science & Engineering',
    college: 'Kakinada Institute of Engineering & Technology (KIET)',
    emailVerified: true,
  },
  {
    id: 'admin_demo',
    name: 'Group Administration Office',
    email: 'admin@kiet.edu',
    altEmails: ['admin@kietgroup.com', 'admin@c4gt.edu'],
    validPasswords: ['admin123', '123456', 'admin', 'password'],
    role: 'Admin',
    department: 'Central Administration',
    college: 'KIET Group of Institutions (Kakinada)',
    emailVerified: true,
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('kiet_auth_user') || localStorage.getItem('c4gt_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('kiet_auth_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('kiet_auth_user')
        localStorage.removeItem('c4gt_user')
      }
    } catch {}
  }, [user])

  const login = useCallback(async (identifier, password, role = 'Student') => {
    const value = String(identifier || '').trim()
    const pass = String(password || '').trim()

    if (!value || !pass) {
      return {
        ok: false,
        error: role === 'Student' ? 'Roll Number / Email and password are required' : 'Email and password are required',
      }
    }

    const valLower = value.toLowerCase()

    if (role === 'Student') {
      const student = getStudentByRoll(value) || (valLower.includes('student') || valLower === 'vamsi' ? demoStudent : null)
      const isStudentMatch =
        (valLower === 'student@kiet.edu' && (pass === 'student123' || pass === '23JN1A4533' || pass === 'password' || pass === '123456')) ||
        (student && (
          pass.toLowerCase() === student.rollNumber.toLowerCase() ||
          pass === student.password ||
          pass === 'student123' ||
          pass === 'password' ||
          pass === '123456' ||
          pass === 'student'
        ))

      if (!isStudentMatch || !student) {
        return { ok: false, error: 'Invalid roll number or password' }
      }

      const account = {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        password: student.password,
        role: 'Student',
        campus: student.campus,
        college: student.college,
        branch: student.branch,
        branchName: student.branchName,
        year: student.year,
        semester: student.semester,
        section: student.section,
        emailVerified: true,
      }

      setUser(account)
      return { ok: true, user: account }
    }

    // Faculty, HOD, Admin
    const users = [...demoUsers, ...loadUsers()]
    const found = users.find((item) => {
      const roleMatches = String(item.role).toLowerCase() === String(role).toLowerCase()
      if (!roleMatches) return false

      const emailMatches =
        String(item.email || '').toLowerCase() === valLower ||
        valLower === String(item.role).toLowerCase() ||
        (item.altEmails && item.altEmails.some((e) => e.toLowerCase() === valLower))
      if (!emailMatches) return false

      const passMatches =
        item.password === pass ||
        (item.validPasswords && item.validPasswords.includes(pass)) ||
        pass === `${String(role).toLowerCase()}123` ||
        pass === `${String(role).toLowerCase()}` ||
        pass === 'password' ||
        pass === '123456'

      return passMatches
    })

    if (!found) {
      return { ok: false, error: 'Invalid email or password' }
    }

    setUser(found)
    return { ok: true, user: found }
  }, [])

  const signup = useCallback(async ({ name, email, password }) => {
    const n = String(name || '').trim()
    const e = String(email || '').trim().toLowerCase()
    const p = String(password || '').trim()
    if (!n || !e || !p) return { ok: false, error: 'Name, email and password are required' }

    const users = loadUsers()
    if (users.find((u) => String(u.email).toLowerCase() === e)) {
      return { ok: false, error: 'Email already registered' }
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name: n,
      email: e,
      password: p,
      role: 'Student',
      department: 'Computer Science',
      rollNumber: '23JN1A4599',
      college: 'Kakinada Institute of Engineering & Technology (KIET)',
      emailVerified: true,
    }

    users.push(newUser)
    saveUsers(users)
    setUser(newUser)
    return { ok: true, user: newUser }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
