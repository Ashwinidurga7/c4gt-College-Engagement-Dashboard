import { DAYS, TEACHING_SLOTS } from '@/lib/timetable'

/** Courses by code: subject, faculty and room (labs use shared lab rooms). */
const COURSES = {
  '3A': {
    AIML: ['AI & ML', 'Dr. P. Venkata Rao', 'Room 301'],
    DBMS: ['DBMS', 'Mrs. K. Sirisha', 'Room 301'],
    WEB: ['Web Development', 'Mr. Ch. Ravi Kumar', 'Room 301'],
    DS: ['Data Science', 'Dr. M. Anitha', 'Room 301'],
    MATH: ['Probability and Statistics', 'Mr. S. Naga Babu', 'Room 301'],
    SOFT: ['Soft Skills', 'Mrs. G. Lavanya', 'Room 301'],
    DBMSL: ['DBMS Lab', 'Mrs. K. Sirisha', 'Lab 1'],
    WEBL: ['Web Development Lab', 'Mr. Ch. Ravi Kumar', 'Lab 2'],
  },
  '3B': {
    AIML: ['AI & ML', 'Dr. P. Venkata Rao', 'Room 302'],
    DBMS: ['DBMS', 'Mrs. K. Sirisha', 'Room 302'],
    WEB: ['Web Development', 'Mr. Ch. Ravi Kumar', 'Room 302'],
    DS: ['Data Science', 'Dr. Ramesh Varma', 'Room 302'],
    MATH: ['Probability and Statistics', 'Mr. S. Naga Babu', 'Room 302'],
    SOFT: ['Soft Skills', 'Mrs. G. Lavanya', 'Room 302'],
    DBMSL: ['DBMS Lab', 'Mrs. K. Sirisha', 'Lab 1'],
    WEBL: ['Web Development Lab', 'Mr. Ch. Ravi Kumar', 'Lab 3'],
  },
  '2A': {
    DM: ['Discrete Mathematics', 'Mr. S. Naga Babu', 'Room 205'],
    JAVA: ['OOP through Java', 'Dr. Ramesh Varma', 'Room 205'],
    ADS: ['Advanced Data Structures', 'Mrs. K. Sirisha', 'Room 205'],
    SE: ['Software Engineering', 'Dr. M. Anitha', 'Room 205'],
    UHV: ['Universal Human Values', 'Mrs. G. Lavanya', 'Room 205'],
    JAVAL: ['Java Programming Lab', 'Dr. Ramesh Varma', 'Lab 2'],
    ADSL: ['Advanced Data Structures Lab', 'Mrs. K. Sirisha', 'Lab 1'],
  },
}

/**
 * Seven teaching slots per day (09:00–12:00, 02:00–04:00); '-' is a free period.
 * Three clashes are deliberate so conflict detection has something to find:
 * Mrs. K. Sirisha on Monday 11:00 (3A and 2A), Mr. Ch. Ravi Kumar on Tuesday 10:00 (3A and 3B),
 * and Lab 2 on Thursday 02:00 (3A and 2A).
 */
const WEEK = {
  '3A': [
    'AIML WEB DBMS DS MATH DBMSL DBMSL',
    'DBMS WEB AIML MATH DS SOFT -',
    'WEB AIML DS DBMS WEBL WEBL -',
    'MATH DBMS AIML WEB WEBL WEBL -',
    'DS AIML MATH DBMS WEB SOFT -',
    'AIML DS WEB MATH - - -',
  ],
  '3B': [
    'DBMS AIML WEB MATH DS WEBL WEBL',
    'AIML WEB DBMS DS MATH - SOFT',
    'DS DBMS AIML MATH DBMSL DBMSL -',
    'WEB MATH DS AIML DBMS SOFT -',
    'MATH DS WEB AIML DBMS - -',
    'DBMS WEB MATH DS - - -',
  ],
  '2A': [
    'JAVA DM ADS UHV SE - -',
    'DM SE JAVA ADS UHV ADSL ADSL',
    'ADS JAVA DM SE - UHV -',
    'SE JAVA ADS DM JAVAL - -',
    'JAVA ADS SE DM - JAVAL JAVAL',
    'UHV DM - - - - -',
  ],
}

export const TIMETABLE_SECTIONS = [
  { value: '3A', label: 'CSE · Year 3 · Section A', year: 3, section: 'A' },
  { value: '3B', label: 'CSE · Year 3 · Section B', year: 3, section: 'B' },
  { value: '2A', label: 'CSE · Year 2 · Section A', year: 2, section: 'A' },
]

export function buildTimetable() {
  const entries = []
  Object.entries(WEEK).forEach(([section, days]) =>
    days.forEach((row, dayIndex) =>
      row.split(' ').forEach((code, slotIndex) => {
        if (code === '-') return
        const [subject, faculty, room] = COURSES[section][code]
        const day = DAYS[dayIndex]
        const slot = TEACHING_SLOTS[slotIndex]
        entries.push({ id: `${section}-${day}-${slot}`, section, code, subject, faculty, room, day, slot })
      }),
    ),
  )
  return entries
}
