import { rosterStudents } from '@/mocks/rosterData'
import { randomInt, seededRandom } from '@/mocks/seededRandom'

/** Semester tuition per college (half of the annual fee). */
const SEMESTER_TUITION = { KIET: 35000, 'KIET+': 30000, KIEW: 27500 }
const METHODS = ['UPI', 'Net Banking', 'Debit Card', 'Demand Draft', 'Cash']
export const FEE_DUE_DATE = '2026-09-30'
const EARLY_DUE_DATE = '2026-08-31'

/**
 * One semester-tuition record per student. Paid, pending (due 30 Sep) and overdue
 * (due 31 Aug) amounts all come from this list, so stat cards always match the table.
 */
function buildPayments() {
  const random = seededRandom(3030)
  return rosterStudents.map((student, index) => {
    const roll = random()
    const isDemo = index === 0
    const status = isDemo ? 'pending' : roll < 0.72 ? 'paid' : roll < 0.9 ? 'pending' : 'overdue'
    return {
      id: `fee-${student.rollNumber}`,
      studentId: student._id,
      student: student.name,
      rollNumber: student.rollNumber,
      college: student.college,
      department: student.department,
      year: student.year,
      amount: SEMESTER_TUITION[student.college],
      dueDate: status === 'overdue' ? EARLY_DUE_DATE : FEE_DUE_DATE,
      date: status === 'paid' ? `2026-0${randomInt(random, 7, 9)}-${String(randomInt(random, 1, 18)).padStart(2, '0')}` : null,
      method: status === 'paid' ? METHODS[randomInt(random, 0, METHODS.length - 1)] : null,
      status,
    }
  })
}

export const feePayments = buildPayments()

/** The demo student's fee account: this semester plus paid history. */
export const studentFeeAccount = {
  items: [
    { id: 'tuition-s5', label: 'Tuition fee, semester 5', amount: 35000, dueDate: FEE_DUE_DATE, status: 'pending' },
    { id: 'bus-2026', label: 'Transport fee, 2026-27', amount: 9000, dueDate: '2026-07-15', status: 'paid' },
    { id: 'exam-s5', label: 'Examination fee, semester 5', amount: 1200, dueDate: '2026-09-15', status: 'paid' },
  ],
  history: [
    { id: 'rcpt-2607', label: 'Transport fee, 2026-27', amount: 9000, date: '2026-07-10', method: 'UPI', receipt: 'KIET/2026/R-18842' },
    { id: 'rcpt-2609', label: 'Examination fee, semester 5', amount: 1200, date: '2026-09-02', method: 'UPI', receipt: 'KIET/2026/R-22107' },
    { id: 'rcpt-2602', label: 'Tuition fee, semester 4', amount: 35000, date: '2026-02-11', method: 'Net Banking', receipt: 'KIET/2026/R-05519' },
    { id: 'rcpt-2508', label: 'Tuition fee, semester 3', amount: 35000, date: '2025-08-20', method: 'Net Banking', receipt: 'KIET/2025/R-14460' },
  ],
}
