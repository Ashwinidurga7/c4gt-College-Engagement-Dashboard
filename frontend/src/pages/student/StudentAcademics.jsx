import React, { useMemo, useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getStudentByRoll, calcAttendanceStats } from '../../data/academicData'
import { useToast } from '../../components/ui/Toast'
import Icon from '../../components/ui/Icon'

// Comprehensive semester course data for AIDS branch
const SEMESTER_COURSES = {
  I: {
    sgpa: '8.42',
    credits: 21.5,
    status: 'Pass',
    academicYear: '2023–24 (Odd Sem)',
    subjects: [
      { code: 'MA101BS', title: 'Linear Algebra & Calculus', category: 'Basic Science', credits: 3.5, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'AP102BS', title: 'Applied Physics & Semiconductor Devices', category: 'Basic Science', credits: 3.5, grade: 'A+', points: 9.0, result: 'Pass' },
      { code: 'CS103ES', title: 'Programming for Problem Solving in C', category: 'Engineering Science', credits: 3.0, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'EN104HS', title: 'English Language Communication Skills', category: 'Humanities', credits: 2.0, grade: 'A', points: 8.0, result: 'Pass' },
      { code: 'CS105ES', title: 'IT Workshop & Python Basics', category: 'Engineering Science', credits: 2.5, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'AP106BS', title: 'Applied Physics Laboratory', category: 'Basic Science Lab', credits: 1.5, grade: 'A+', points: 9.0, result: 'Pass' },
      { code: 'CS107ES', title: 'C Programming Laboratory', category: 'Engineering Lab', credits: 1.5, grade: 'O', points: 10.0, result: 'Pass' },
    ],
  },
  II: {
    sgpa: '8.65',
    credits: 21.5,
    status: 'Pass',
    academicYear: '2023–24 (Even Sem)',
    subjects: [
      { code: 'MA201BS', title: 'Differential Equations & Numerical Methods', category: 'Basic Science', credits: 3.5, grade: 'A+', points: 9.0, result: 'Pass' },
      { code: 'CH202BS', title: 'Engineering Chemistry & Nanomaterials', category: 'Basic Science', credits: 3.5, grade: 'A', points: 8.0, result: 'Pass' },
      { code: 'CS203ES', title: 'Data Structures & Algorithms Using C++', category: 'Engineering Science', credits: 3.5, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'EE204ES', title: 'Basic Electrical & Electronics Engineering', category: 'Engineering Science', credits: 3.0, grade: 'A+', points: 9.0, result: 'Pass' },
      { code: 'ME205ES', title: 'Computer Aided Engineering Graphics', category: 'Engineering Science', credits: 2.5, grade: 'A', points: 8.0, result: 'Pass' },
      { code: 'CS206ES', title: 'Data Structures Laboratory', category: 'Engineering Lab', credits: 1.5, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'CH207BS', title: 'Engineering Chemistry Laboratory', category: 'Basic Science Lab', credits: 1.5, grade: 'A+', points: 9.0, result: 'Pass' },
    ],
  },
  III: {
    sgpa: '8.80',
    credits: 22.0,
    status: 'Pass',
    academicYear: '2024–25 (Odd Sem)',
    subjects: [
      { code: 'MA301BS', title: 'Discrete Mathematics & Graph Theory', category: 'Basic Science', credits: 3.5, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'CS302PC', title: 'Object Oriented Programming with Java', category: 'Professional Core', credits: 3.5, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'AI303PC', title: 'Foundations of Artificial Intelligence', category: 'Professional Core', credits: 3.5, grade: 'A+', points: 9.0, result: 'Pass' },
      { code: 'CS304PC', title: 'Digital Logic Design & Computer Architecture', category: 'Professional Core', credits: 3.0, grade: 'A+', points: 9.0, result: 'Pass' },
      { code: 'DS305PC', title: 'Statistical Methods for Data Science', category: 'Professional Core', credits: 3.0, grade: 'A+', points: 9.0, result: 'Pass' },
      { code: 'CS306PC', title: 'Java Programming Laboratory', category: 'Professional Lab', credits: 1.5, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'AI307PC', title: 'AI & Python Development Laboratory', category: 'Professional Lab', credits: 1.5, grade: 'O', points: 10.0, result: 'Pass' },
    ],
  },
  IV: {
    sgpa: '8.75',
    credits: 22.0,
    status: 'Pass',
    academicYear: '2024–25 (Even Sem)',
    subjects: [
      { code: 'CS401PC', title: 'Design and Analysis of Algorithms', category: 'Professional Core', credits: 3.0, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'CS402PC', title: 'Database Management Systems & SQL', category: 'Professional Core', credits: 3.0, grade: 'A+', points: 9.0, result: 'Pass' },
      { code: 'CS403PC', title: 'Operating Systems & Kernel Programming', category: 'Professional Core', credits: 3.0, grade: 'A', points: 8.0, result: 'Pass' },
      { code: 'AI404PC', title: 'Machine Learning & Predictive Modeling', category: 'Professional Core', credits: 3.5, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'CS405PC', title: 'Computer Networks & Cloud Infrastructure', category: 'Professional Core', credits: 3.0, grade: 'A+', points: 9.0, result: 'Pass' },
      { code: 'CS406PC', title: 'DBMS & SQL Laboratory', category: 'Professional Lab', credits: 1.5, grade: 'O', points: 10.0, result: 'Pass' },
      { code: 'AI407PC', title: 'Machine Learning Laboratory', category: 'Professional Lab', credits: 1.5, grade: 'O', points: 10.0, result: 'Pass' },
    ],
  },
}

// Universal Print & Save-to-PDF Helper
function triggerDocumentPrint(title, htmlBody) {
  const printWindow = window.open('', '_blank', 'width=920,height=750')
  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0b1e3b; margin: 0; padding: 16px; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          * { box-sizing: border-box; }
          .receipt-paper { border: 2px solid #0f2c59; border-radius: 8px; padding: 24px; position: relative; max-width: 820px; margin: 0 auto; background: #fff; }
          .receipt-header { text-align: center; border-bottom: 2px solid #0f2c59; padding-bottom: 14px; margin-bottom: 16px; }
          .receipt-header h1 { margin: 0; font-size: 20px; color: #092247; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; }
          .receipt-header p { margin: 3px 0 0; font-size: 11px; color: #475569; }
          .receipt-type { display: inline-block; background: #0f2c59; color: #fff; padding: 4px 14px; border-radius: 4px; font-size: 11px; font-weight: 800; margin-top: 8px; letter-spacing: 1px; }
          .meta-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 12px; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
          .meta-col strong { color: #092247; }
          .table-doc { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11.5px; }
          .table-doc th { background: #0f2c59; color: #fff; padding: 8px 10px; text-align: left; font-size: 10.5px; text-transform: uppercase; }
          .table-doc td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          .table-doc tr:nth-child(even) { background: #f8fafc; }
          .total-row td { font-weight: 800; font-size: 13px; background: #eef4ff !important; color: #092247; border-top: 2px solid #0f2c59; }
          .words-block { font-size: 11px; font-style: italic; color: #334155; margin-bottom: 24px; padding: 6px 10px; background: #f1f5f9; border-left: 3px solid #0f2c59; }
          .signatures-grid { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 10px; text-align: center; }
          .sig-box { width: 180px; }
          .sig-line { border-top: 1px solid #0f2c59; margin-top: 36px; padding-top: 4px; font-size: 10px; font-weight: 700; color: #0f2c59; }
          .paid-seal-stamp { position: absolute; right: 40px; top: 120px; border: 3px solid #10b981; color: #10b981; padding: 6px 16px; font-size: 18px; font-weight: 900; text-transform: uppercase; transform: rotate(-10deg); border-radius: 8px; letter-spacing: 2px; opacity: 0.85; }
        </style>
      </head>
      <body>
        ${htmlBody}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `
  if (printWindow) {
    printWindow.document.write(content)
    printWindow.document.close()
  } else {
    // Hidden fallback iframe
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)
    const doc = iframe.contentWindow.document
    doc.open()
    doc.write(content)
    doc.close()
    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      setTimeout(() => document.body.removeChild(iframe), 2500)
    }, 400)
  }
}

// Download HTML file trigger
function downloadHtmlReceipt(filename, title, htmlBody) {
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0b1e3b; margin: 0; padding: 20px; background: #f8fafc; }
    * { box-sizing: border-box; }
    .receipt-paper { border: 2px solid #0f2c59; border-radius: 8px; padding: 24px; position: relative; max-width: 820px; margin: 0 auto; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
    .receipt-header { text-align: center; border-bottom: 2px solid #0f2c59; padding-bottom: 14px; margin-bottom: 16px; }
    .receipt-header h1 { margin: 0; font-size: 20px; color: #092247; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; }
    .receipt-header p { margin: 3px 0 0; font-size: 11px; color: #475569; }
    .receipt-type { display: inline-block; background: #0f2c59; color: #fff; padding: 4px 14px; border-radius: 4px; font-size: 11px; font-weight: 800; margin-top: 8px; letter-spacing: 1px; }
    .meta-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 12px; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
    .meta-col strong { color: #092247; }
    .table-doc { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11.5px; }
    .table-doc th { background: #0f2c59; color: #fff; padding: 8px 10px; text-align: left; font-size: 10.5px; text-transform: uppercase; }
    .table-doc td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    .table-doc tr:nth-child(even) { background: #f8fafc; }
    .total-row td { font-weight: 800; font-size: 13px; background: #eef4ff !important; color: #092247; border-top: 2px solid #0f2c59; }
    .words-block { font-size: 11px; font-style: italic; color: #334155; margin-bottom: 24px; padding: 6px 10px; background: #f1f5f9; border-left: 3px solid #0f2c59; }
    .signatures-grid { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 10px; text-align: center; }
    .sig-box { width: 180px; }
    .sig-line { border-top: 1px solid #0f2c59; margin-top: 36px; padding-top: 4px; font-size: 10px; font-weight: 700; color: #0f2c59; }
    .paid-seal-stamp { position: absolute; right: 40px; top: 120px; border: 3px solid #10b981; color: #10b981; padding: 6px 16px; font-size: 18px; font-weight: 900; text-transform: uppercase; transform: rotate(-10deg); border-radius: 8px; letter-spacing: 2px; opacity: 0.85; }
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>`
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function StudentAcademics({ initialTab = 'fees' }) {
  const { user } = useAuth()
  const { showSuccess, showInfo } = useToast()
  const [tab, setTab] = useState(initialTab)
  const [activeSem, setActiveSem] = useState('IV')
  const [showFeeReceiptModal, setShowFeeReceiptModal] = useState(false)
  const [showBusPassModal, setShowBusPassModal] = useState(false)
  const [showMarksMemoModal, setShowMarksMemoModal] = useState(false)

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab)
    }
  }, [initialTab])

  const student = useMemo(() => {
    return getStudentByRoll(user?.rollNumber || user?.email || '23JN1A4533')
  }, [user])

  const attendanceStats = useMemo(() => {
    return calcAttendanceStats(student?.monthlyAttendance || [])
  }, [student])

  const feeBalance = (student?.fees?.total || 98000) - (student?.fees?.paid || 98000)
  const isFeePaid = feeBalance <= 0

  const transportBalance = Math.max(0, (student?.transport?.total || 18000) - (student?.transport?.paid || 18000))

  const selectedSemData = SEMESTER_COURSES[activeSem] || SEMESTER_COURSES.IV

  // Generate Fee Receipt HTML for Modal & Printing
  const feeReceiptHtml = `
    <div class="receipt-paper">
      <div class="paid-seal-stamp">PAID &amp; CLEARED</div>
      <div class="receipt-header">
        <h1>Kakinada Institute of Engineering &amp; Technology</h1>
        <p><strong>AFFILIATED TO JNTUK</strong> • Approved by AICTE, New Delhi • JNTUK, Kakinada</p>
        <p>Korangi, Yanam Road, Kakinada District, Andhra Pradesh - 533461</p>
        <div class="receipt-type">OFFICIAL STUDENT CASH / BANK FEE RECEIPT</div>
      </div>

      <div class="meta-row">
        <div class="meta-col">
          <div>Receipt No: <strong>KIET/JNTUK/REC/2025-26/08412</strong></div>
          <div>Date: <strong>14 Aug 2025</strong></div>
          <div>Payment Channel: <strong>SBI Collect / Net Banking</strong></div>
        </div>
        <div class="meta-col" style="text-align: right;">
          <div>Transaction Ref: <strong>SBI-EPAY-88219401</strong></div>
          <div>Academic Cycle: <strong>AY 2025–2026 (Annual)</strong></div>
          <div>Status: <strong style="color:#10b981;">CLEARED / ZERO BALANCE</strong></div>
        </div>
      </div>

      <div class="meta-row" style="background:#f1f5f9; border-left: 3px solid #0f2c59;">
        <div class="meta-col">
          <div>Student Name: <strong>${student.name}</strong></div>
          <div>Roll Number: <strong>${student.rollNumber}</strong></div>
          <div>Campus: <strong>${student.campus} (Affiliated to JNTUK)</strong></div>
        </div>
        <div class="meta-col" style="text-align: right;">
          <div>Program: <strong>B.Tech (${student.branchName || 'AI & Data Science'})</strong></div>
          <div>Year &amp; Semester: <strong>${student.year} · V Semester (Sec ${student.section})</strong></div>
          <div>Quota / Category: <strong>Convenor Merit (JNTUK)</strong></div>
        </div>
      </div>

      <table class="table-doc">
        <thead>
          <tr>
            <th style="width: 45px;">S.No</th>
            <th>Fee Component Description</th>
            <th style="width: 120px; text-align: center;">Academic Sem</th>
            <th style="width: 130px; text-align: right;">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01</td>
            <td><strong>Tuition &amp; Instructional Fee</strong><br/><small style="color:#64748b;">Prescribed tuition, academic laboratories &amp; faculty instruction</small></td>
            <td style="text-align: center;">AY 2025–26</td>
            <td style="text-align: right;">₹65,000.00</td>
          </tr>
          <tr>
            <td>02</td>
            <td><strong>University &amp; Semester Examination Fee</strong><br/><small style="color:#64748b;">Semester theory, practical exams &amp; continuous evaluation</small></td>
            <td style="text-align: center;">Odd &amp; Even</td>
            <td style="text-align: right;">₹12,000.00</td>
          </tr>
          <tr>
            <td>03</td>
            <td><strong>Digital Library &amp; IEEE E-Resources</strong><br/><small style="color:#64748b;">IEEE Xplore, DELNET journals, ACM &amp; digital textbook repository</small></td>
            <td style="text-align: center;">Annual</td>
            <td style="text-align: right;">₹5,000.00</td>
          </tr>
          <tr>
            <td>04</td>
            <td><strong>Student Technical &amp; Skill Development</strong><br/><small style="color:#64748b;">Coding bootcamps, AI hackathons &amp; career training</small></td>
            <td style="text-align: center;">Annual</td>
            <td style="text-align: right;">₹3,000.00</td>
          </tr>
          <tr>
            <td>05</td>
            <td><strong>Special Institutional Infrastructure &amp; Campus Amenities</strong><br/><small style="color:#64748b;">High-speed Wi-Fi, R&amp;D EDC complex, sports &amp; security</small></td>
            <td style="text-align: center;">Annual</td>
            <td style="text-align: right;">₹13,000.00</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">TOTAL PRESCRIBED AMOUNT:</td>
            <td style="text-align: right;">₹98,000.00</td>
          </tr>
          <tr style="background:#f0fdf4; color:#166534; font-weight: bold;">
            <td colspan="3" style="text-align: right;">TOTAL AMOUNT RECEIVED (CLEARED):</td>
            <td style="text-align: right;">₹98,000.00</td>
          </tr>
          <tr style="color:#64748b;">
            <td colspan="3" style="text-align: right;">OUTSTANDING BALANCE DUE:</td>
            <td style="text-align: right; color:#10b981;">₹0.00 (NIL)</td>
          </tr>
        </tbody>
      </table>

      <div class="words-block">
        <strong>Amount in Words:</strong> Rupees Ninety Eight Thousand Only.
      </div>

      <div class="signatures-grid">
        <div class="sig-box">
          <div style="font-size: 11px; color: #10b981; font-weight: 700;"><Icon name="check" /> Digitally Authenticated</div>
          <div class="sig-line">Cashier / Accounts Officer</div>
          <div style="font-size: 9px; color: #64748b;">Finance Department, KIET</div>
        </div>
        <div class="sig-box">
          <div style="width: 70px; height: 70px; border: 2px dashed #0f2c59; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 800; color: #0f2c59; text-transform: uppercase;">
            KIET SEAL
          </div>
          <div style="font-size: 8px; color: #64748b; margin-top: 4px;">ACCOUNTS AUDIT</div>
        </div>
        <div class="sig-box">
          <div style="font-size: 11px; color: #0f2c59; font-weight: 700;">Prof. M. S. R. Prasad</div>
          <div class="sig-line">Dean, Academic Administration</div>
          <div style="font-size: 9px; color: #64748b;">KIET Group • JNTUK</div>
        </div>
      </div>
    </div>
  `

  // Generate Bus Pass HTML
  const busPassHtml = `
    <div class="receipt-paper" style="max-width: 600px; border-color: #0d3b66;">
      <div class="receipt-header" style="border-bottom: 2px solid #0d3b66;">
        <h1 style="color: #0d3b66;">KIET Group of Institutions</h1>
        <p><strong>KIET DIGITAL TRANSPORT PASS • AY 2025–26</strong></p>
        <p>Korangi Campus, Kakinada District</p>
      </div>

      <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 16px;">
        <div style="width: 100px; height: 110px; background: #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: #0d3b66; border: 2px solid #0d3b66;">
          ${student.name.charAt(0)}
        </div>
        <div style="flex: 1; font-size: 12px; line-height: 1.6;">
          <div>Name: <strong>${student.name}</strong></div>
          <div>Roll No: <strong>${student.rollNumber}</strong></div>
          <div>Branch: <strong>${student.branch} · ${student.year}</strong></div>
          <div>Route: <strong style="color: #0d3b66;">${student.transport.route}</strong></div>
          <div>Bus No: <strong>${student.transport.busNumber}</strong></div>
          <div>Boarding Point: <strong>${student.transport.boardingPoint}</strong></div>
        </div>
      </div>

      <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 10px; border-radius: 6px; font-size: 11px; margin-bottom: 16px;">
        <strong style="color: #166534;"><Icon name="dot" /> PASS STATUS: ACTIVE &amp; VERIFIED</strong>
        <div style="color: #15803d; margin-top: 2px;">Morning Pickup: <strong>07:40 AM IST</strong> | Driver: <strong>${student.transport.driverName} (${student.transport.driverPhone})</strong></div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 10px; color: #64748b;">
        <div>Pass ID: <strong>BP-2025-23JN1A4533</strong></div>
        <div>Transport Controller: <strong>+91 884 2315333 (Ext. 204)</strong></div>
      </div>
    </div>
  `

  // Generate Grade Memo HTML
  const gradeMemoHtml = `
    <div class="receipt-paper">
      <div class="receipt-header">
        <h1>Kakinada Institute of Engineering &amp; Technology</h1>
        <p><strong>APPROVED BY AICTE</strong> • Affiliated to JNTUK, Kakinada • Accredited by NAAC &amp; NBA</p>
        <p>Korangi, Kakinada, Andhra Pradesh - 533461</p>
        <div class="receipt-type">GRADE CARD &amp; MARKS MEMORANDUM • SEMESTER ${activeSem}</div>
      </div>

      <div class="meta-row">
        <div class="meta-col">
          <div>Student Name: <strong>${student.name}</strong></div>
          <div>Hall Ticket / Roll No: <strong>${student.rollNumber}</strong></div>
          <div>Branch: <strong>${student.branchName || 'Artificial Intelligence & Data Science'}</strong></div>
        </div>
        <div class="meta-col" style="text-align: right;">
          <div>Semester: <strong>Semester ${activeSem} (${selectedSemData.academicYear})</strong></div>
          <div>Semester SGPA: <strong style="color: #0f2c59; font-size: 14px;">${selectedSemData.sgpa} / 10.0</strong></div>
          <div>Result Status: <strong style="color: #10b981;">${selectedSemData.status.toUpperCase()}</strong></div>
        </div>
      </div>

      <table class="table-doc">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Subject / Course Title</th>
            <th style="text-align: center;">Category</th>
            <th style="text-align: center;">Credits</th>
            <th style="text-align: center;">Grade</th>
            <th style="text-align: center;">Grade Points</th>
            <th style="text-align: center;">Result</th>
          </tr>
        </thead>
        <tbody>
          ${selectedSemData.subjects.map(sub => `
            <tr>
              <td><strong>${sub.code}</strong></td>
              <td>${sub.title}</td>
              <td style="text-align: center;">${sub.category}</td>
              <td style="text-align: center;">${sub.credits}</td>
              <td style="text-align: center;"><strong>${sub.grade}</strong></td>
              <td style="text-align: center;">${sub.points.toFixed(1)}</td>
              <td style="text-align: center; color: #166534; font-weight: 600;">${sub.result}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">SEMESTER TOTAL CREDITS &amp; PERFORMANCE:</td>
            <td style="text-align: center;">${selectedSemData.credits}</td>
            <td colspan="2" style="text-align: center;">SGPA: ${selectedSemData.sgpa}</td>
            <td style="text-align: center; color: #166534;">PASSED</td>
          </tr>
        </tbody>
      </table>

      <div class="meta-row" style="margin-top: 14px; background: #eef4ff;">
        <div>Cumulative Grade Point Average (CGPA): <strong>${student.cgpa} / 10.0</strong></div>
        <div>Cumulative Credits Completed: <strong>87.0 / 87.0</strong></div>
        <div>Active Backlogs: <strong>0 (NIL)</strong></div>
      </div>

      <div class="signatures-grid">
        <div class="sig-box">
          <div class="sig-line">Prepared &amp; Verified by</div>
          <div style="font-size: 9px; color: #64748b;">Examination Branch</div>
        </div>
        <div class="sig-box">
          <div style="width: 70px; height: 70px; border: 2px dashed #0f2c59; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 800; color: #0f2c59; text-transform: uppercase;">
            COE KIET
          </div>
          <div style="font-size: 8px; color: #64748b; margin-top: 4px;">OFFICIAL SEAL</div>
        </div>
        <div class="sig-box">
          <div style="font-size: 11px; color: #0f2c59; font-weight: 700;">Dr. K. V. Ramana</div>
          <div class="sig-line">Controller of Examinations</div>
          <div style="font-size: 9px; color: #64748b;">KIET Examination Cell (JNTUK)</div>
        </div>
      </div>
    </div>
  `

  // Action handlers that trigger both modal preview & instant PDF printing
  const handleOpenFeeReceipt = () => {
    setShowFeeReceiptModal(true)
    triggerDocumentPrint(`KIET_Fee_Receipt_${student.rollNumber}`, feeReceiptHtml)
    showSuccess(`Fee receipt print/download initiated for ${student.rollNumber} (AY 2025-26)`)
  }

  const handlePrintFeeReceiptDirect = () => {
    triggerDocumentPrint(`KIET_Fee_Receipt_${student.rollNumber}`, feeReceiptHtml)
    showSuccess(`Fee receipt print/download initiated for ${student.rollNumber}`)
  }

  const handleDownloadFeeReceiptFile = () => {
    downloadHtmlReceipt(`KIET_Fee_Receipt_${student.rollNumber}.html`, `KIET Fee Receipt - ${student.rollNumber}`, feeReceiptHtml)
    showSuccess(`Fee receipt file downloaded: KIET_Fee_Receipt_${student.rollNumber}.html`)
  }

  const handleOpenBusPass = () => {
    setShowBusPassModal(true)
    triggerDocumentPrint(`KIET_Digital_Bus_Pass_${student.rollNumber}`, busPassHtml)
    showSuccess(`Digital Bus Pass print/download initiated for Route ${student.transport.route}`)
  }

  const handlePrintBusPassDirect = () => {
    triggerDocumentPrint(`KIET_Digital_Bus_Pass_${student.rollNumber}`, busPassHtml)
    showSuccess(`Digital Bus Pass print/download initiated for Route ${student.transport.route}`)
  }

  const handleOpenMarksMemo = (sem) => {
    setActiveSem(sem)
    setShowMarksMemoModal(true)
    triggerDocumentPrint(`KIET_Marks_Memo_Sem_${sem}_${student.rollNumber}`, gradeMemoHtml)
    showSuccess(`Semester ${sem} marks memo print/download initiated!`)
  }

  const handlePrintMarksMemoDirect = () => {
    triggerDocumentPrint(`KIET_Marks_Memo_Sem_${activeSem}_${student.rollNumber}`, gradeMemoHtml)
    showSuccess(`Semester ${activeSem} marks memo print/download initiated!`)
  }

  return (
    <div className="student-dashboard academic-page-modern">
      {/* 1. ULTRA-PREMIUM INSTITUTIONAL HERO HEADER */}
      <section className="academic-hero-card">
        <div className="academic-hero-glow" />
        <div className="academic-hero-content">
          <div className="academic-hero-tags">
            <span className="hero-pill-badge primary"><Icon name="student" /> KIET STUDENT ERP • AY 2025–26</span>
          </div>

          <div className="academic-hero-main">
            <div className="hero-avatar-seal">
              <span>{student.name.charAt(0)}</span>
              <div className="seal-dot" />
            </div>
            <div className="hero-text-wrap">
              <h1 className="academic-student-name maven-black">{student.name}</h1>
              <div className="academic-student-sub">
                <span className="roll-tag">{student.rollNumber}</span>
                <span className="sep">•</span>
                <span>{student.campus} (Affiliated to JNTUK)</span>
                <span className="sep">•</span>
                <span>{student.branchName || 'Artificial Intelligence & Data Science'}</span>
                <span className="sep">•</span>
                <span>{student.year} · Sec {student.section}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="academic-hero-stats">
          <div className="hero-stat-box">
            <span className="hsb-label">CUMULATIVE CGPA</span>
            <strong className="hsb-value maven-black">{student.cgpa}</strong>
            <small className="hsb-note">JNTUK Stream</small>
          </div>
          <div className="hero-stat-box">
            <span className="hsb-label">12-MO ATTENDANCE</span>
            <strong className="hsb-value maven-black">{attendanceStats.percentage}%</strong>
            <small className="hsb-note text-green">Exam Eligible (&gt;75%)</small>
          </div>
          <div className="hero-stat-box">
            <span className="hsb-label">TUITION BALANCE</span>
            <strong className="hsb-value maven-black text-green">₹0.00</strong>
            <small className="hsb-note text-green">All Dues Cleared</small>
          </div>
        </div>
      </section>

      {/* 2. REFINED PILL NAVIGATION TABS */}
      <div className="academic-tabs-bar">
        <button
          type="button"
          className={`academic-nav-tab ${tab === 'fees' ? 'active' : ''}`}
          onClick={() => setTab('fees')}
        >
          <span className="tab-icon"><Icon name="card" /></span>
          <span className="tab-title">Tuition &amp; College Fees</span>
          <span className="tab-pill-badge cleared">CLEARED</span>
        </button>

        <button
          type="button"
          className={`academic-nav-tab ${tab === 'transport' ? 'active' : ''}`}
          onClick={() => setTab('transport')}
        >
          <span className="tab-icon"><Icon name="bus" /></span>
          <span className="tab-title">Smart Bus Pass &amp; Route</span>
          <span className="tab-pill-badge active">ROUTE 03</span>
        </button>

        <button
          type="button"
          className={`academic-nav-tab ${tab === 'results' ? 'active' : ''}`}
          onClick={() => setTab('results')}
        >
          <span className="tab-icon"><Icon name="document" /></span>
          <span className="tab-title">Semester Results &amp; SGPA</span>
          <span className="tab-pill-badge distinction">CGPA 8.65</span>
        </button>
      </div>

      {/* 3. TAB 1: TUITION & COLLEGE FEES */}
      {tab === 'fees' && (
        <div className="academic-tab-panel">
          {/* Financial Overview Card */}
          <div className="finance-overview-grid">
            <div className="finance-metric-card cleared-glow">
              <div className="fmc-top">
                <span className="fmc-label">ANNUAL PRESCRIBED FEE</span>
                <span className="fmc-badge success">PAID IN FULL</span>
              </div>
              <div className="fmc-amount maven-black">₹{student.fees.total.toLocaleString('en-IN')}</div>
              <div className="fmc-desc">AY 2025–26 Total Prescribed Tuition &amp; Exam Fee</div>
              <div className="fmc-progress-track">
                <div className="fmc-progress-bar" style={{ width: '100%' }} />
              </div>
              <div className="fmc-foot">
                <span>Paid: <strong>₹{student.fees.paid.toLocaleString('en-IN')}</strong></span>
                <span className="text-green">Balance: <strong>₹0.00</strong></span>
              </div>
            </div>

            <div className="finance-metric-card account-details">
              <div className="fmc-top">
                <span className="fmc-label">ACCOUNT LEDGER REFERENCE</span>
                <span className="fmc-badge primary">JNTUK AUDITED</span>
              </div>
              <div className="account-rows">
                <div className="acc-row">
                  <span>Student ID</span>
                  <strong>{student.rollNumber}</strong>
                </div>
                <div className="acc-row">
                  <span>Receipt Reference</span>
                  <strong>KIET-FEE-23JN1A4533-26</strong>
                </div>
                <div className="acc-row">
                  <span>Payment Mode</span>
                  <strong>SBI Collect / Net Banking</strong>
                </div>
                <div className="acc-row">
                  <span>Next Academic Due</span>
                  <strong>30 Sep 2026</strong>
                </div>
              </div>
            </div>

            <div className="finance-metric-card action-hub">
              <div className="fmc-top">
                <span className="fmc-label">OFFICIAL DOCUMENTS</span>
                <span className="fmc-badge verified">VERIFIED</span>
              </div>
              <p className="fmc-hub-text">
                Generate and download official semester fee vouchers, cashier receipts, and No Dues clearance certificates.
              </p>
              <div className="fmc-buttons-col">
                <button
                  type="button"
                  className="btn-academic-primary"
                  onClick={handleOpenFeeReceipt}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Official Fee Receipt (PDF)
                </button>
                <button
                  type="button"
                  className="btn-academic-secondary"
                  onClick={handlePrintFeeReceiptDirect}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  Instant Print / Save as PDF
                </button>
              </div>
            </div>
          </div>

          {/* Fee Itemization Grid (Visual Cards) */}
          <div className="section-title-lockup">
            <div>
              <h3>Institutional Fee Component Itemization</h3>
              <p>Government prescribed fee breakdown approved by State Fee Regulatory Committee (AFRC).</p>
            </div>
            <span className="breakdown-status-tag">5 of 5 Components Settled</span>
          </div>

          <div className="fee-components-grid">
            <div className="component-card">
              <div className="comp-icon-box"><Icon name="institution" /></div>
              <div className="comp-info">
                <h4>Tuition &amp; Academic Instruction</h4>
                <p>Prescribed tuition, faculty instruction, classroom labs and compute resources.</p>
                <div className="comp-foot">
                  <span className="comp-amount">₹65,000</span>
                  <span className="status-pill-paid"><Icon name="check" /> PAID</span>
                </div>
              </div>
            </div>

            <div className="component-card">
              <div className="comp-icon-box"><Icon name="document" /></div>
              <div className="comp-info">
                <h4>University &amp; Semester Examination Fee</h4>
                <p>Semester theory, practical exam operations, continuous internal assessment &amp; grade sheets.</p>
                <div className="comp-foot">
                  <span className="comp-amount">₹12,000</span>
                  <span className="status-pill-paid"><Icon name="check" /> PAID</span>
                </div>
              </div>
            </div>

            <div className="component-card">
              <div className="comp-icon-box"><Icon name="books" /></div>
              <div className="comp-info">
                <h4>Digital Library &amp; IEEE E-Resources</h4>
                <p>IEEE Xplore, DELNET journal subscriptions, ACM library and digital textbook repository.</p>
                <div className="comp-foot">
                  <span className="comp-amount">₹5,000</span>
                  <span className="status-pill-paid"><Icon name="check" /> PAID</span>
                </div>
              </div>
            </div>

            <div className="component-card">
              <div className="comp-icon-box"><Icon name="laptop" /></div>
              <div className="comp-info">
                <h4>Technical Skill &amp; Career Placement</h4>
                <p>Industry coding bootcamps, AI hackathons, guest corporate lectures &amp; placement mock drives.</p>
                <div className="comp-foot">
                  <span className="comp-amount">₹3,000</span>
                  <span className="status-pill-paid"><Icon name="check" /> PAID</span>
                </div>
              </div>
            </div>

            <div className="component-card">
              <div className="comp-icon-box"><Icon name="bolt" /></div>
              <div className="comp-info">
                <h4>Special Amenities &amp; Infrastructure</h4>
                <p>High-speed campus Wi-Fi, R&amp;D Innovation Gallery, sports pavilion and campus safety.</p>
                <div className="comp-foot">
                  <span className="comp-amount">₹13,000</span>
                  <span className="status-pill-paid"><Icon name="check" /> PAID</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="ledger-card-wrap">
            <div className="ledger-card-header">
              <div>
                <h4>Verified Bank Payment Transaction Logs</h4>
                <p>Electronic confirmation via KIET SBI Collect &amp; College Accounts Desk.</p>
              </div>
              <button
                type="button"
                className="btn-download-file-tag"
                onClick={handleDownloadFeeReceiptFile}
              >
                <Icon name="save" /> Export Receipt (.html)
              </button>
            </div>

            <div className="ledger-table-responsive">
              <table className="modern-academic-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Payment Method</th>
                    <th>Account Scoped</th>
                    <th className="text-right">Amount Paid</th>
                    <th className="text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong className="code-font">SBI-EPAY-88219401</strong></td>
                    <td>14 Aug 2025</td>
                    <td>SBI Collect NetBanking</td>
                    <td>AY 2025–26 Consolidated Fee</td>
                    <td className="text-right font-bold text-navy">₹98,000.00</td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn-table-action"
                        onClick={handleOpenFeeReceipt}
                      >
                        View Receipt <Icon name="arrow-right" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: SMART BUS PASS & CAMPUS TRANSPORT */}
      {tab === 'transport' && (
        <div className="academic-tab-panel">
          <div className="transport-layout-grid">
            {/* Smart Digital Bus Card */}
            <div className="digital-bus-pass-container">
              <div className="smart-bus-pass-card">
                <div className="sbp-glow" />
                <div className="sbp-header">
                  <div className="sbp-brand">
                    <div className="sbp-logo-mini">KIET</div>
                    <div>
                      <strong>KIET GROUP OF INSTITUTIONS</strong>
                      <span>CAMPUS SMART PASS • AY 2025–26</span>
                    </div>
                  </div>
                  <span className="sbp-rfid-chip">RFID ACTIVE</span>
                </div>

                <div className="sbp-body">
                  <div className="sbp-student-col">
                    <div className="sbp-avatar">{student.name.charAt(0)}</div>
                    <div>
                      <h4 className="sbp-name">{student.name}</h4>
                      <div className="sbp-roll">{student.rollNumber}</div>
                      <div className="sbp-dept">{student.branchName || 'AI & Data Science'}</div>
                    </div>
                  </div>

                  <div className="sbp-qr-col">
                    <div className="sbp-qr-box">
                      <div className="mock-qr-pattern" />
                      <small>SCAN ID</small>
                    </div>
                  </div>
                </div>

                <div className="sbp-details-grid">
                  <div className="sbp-detail">
                    <span className="label">ASSIGNED ROUTE</span>
                    <strong className="val text-gold">{student.transport.route}</strong>
                  </div>
                  <div className="sbp-detail">
                    <span className="label">VEHICLE REG NO</span>
                    <strong className="val">{student.transport.busNumber}</strong>
                  </div>
                  <div className="sbp-detail">
                    <span className="label">PRIMARY BOARDING POINT</span>
                    <strong className="val">{student.transport.boardingPoint}</strong>
                  </div>
                  <div className="sbp-detail">
                    <span className="label">MORNING PICKUP TIME</span>
                    <strong className="val text-gold">07:40 AM IST</strong>
                  </div>
                </div>

                <div className="sbp-footer">
                  <span>Pass ID: <strong>BP-2025-23JN1A4533</strong></span>
                  <button
                    type="button"
                    className="btn-sbp-download"
                    onClick={handleOpenBusPass}
                  >
                    <Icon name="printer" /> Download Digital Pass (PDF)
                  </button>
                </div>
              </div>
            </div>

            {/* Route Stops Step Timeline */}
            <div className="route-timeline-card">
              <div className="rtc-header">
                <div>
                  <h4>Route 03 Express Stops &amp; Timings</h4>
                  <p>Daily scheduled morning stops and pickup coordinates.</p>
                </div>
                <span className="status-live-chip"><Icon name="dot" /> On Schedule</span>
              </div>

              <div className="timeline-steps">
                <div className="t-step active-stop">
                  <div className="t-step-indicator">
                    <span className="t-step-dot" />
                    <span className="t-step-line" />
                  </div>
                  <div className="t-step-info">
                    <div className="t-step-time">07:40 AM IST</div>
                    <h5>Bhanugudi Junction, Kakinada</h5>
                    <span className="boarding-pill"><Icon name="star" /> YOUR DESIGNATED BOARDING POINT</span>
                  </div>
                </div>

                <div className="t-step">
                  <div className="t-step-indicator">
                    <span className="t-step-dot" />
                    <span className="t-step-line" />
                  </div>
                  <div className="t-step-info">
                    <div className="t-step-time">07:50 AM IST</div>
                    <h5>RTC Central Bus Complex, Kakinada</h5>
                    <p>Sub-boarding bay &amp; connector transit</p>
                  </div>
                </div>

                <div className="t-step">
                  <div className="t-step-indicator">
                    <span className="t-step-dot" />
                    <span className="t-step-line" />
                  </div>
                  <div className="t-step-info">
                    <div className="t-step-time">08:00 AM IST</div>
                    <h5>Jagannaickpur Bridge Junction</h5>
                    <p>South Kakinada coastal junction</p>
                  </div>
                </div>

                <div className="t-step">
                  <div className="t-step-indicator">
                    <span className="t-step-dot" />
                    <span className="t-step-line" />
                  </div>
                  <div className="t-step-info">
                    <div className="t-step-time">08:15 AM IST</div>
                    <h5>Madhavapatnam Bypass Highway</h5>
                    <p>Highway express corridor checkpoint</p>
                  </div>
                </div>

                <div className="t-step destination-stop">
                  <div className="t-step-indicator">
                    <span className="t-step-dot" />
                  </div>
                  <div className="t-step-info">
                    <div className="t-step-time">08:35 AM IST</div>
                    <h5>KIET Central Engineering Campus Porch</h5>
                    <span className="dest-pill"><Icon name="flag" /> ARRIVAL DESTINATION (KORANGI)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver & Support Cards */}
          <div className="transport-support-grid">
            <div className="support-card driver-card">
              <div className="sc-icon"><Icon name="user" />‍<Icon name="globe" /></div>
              <div className="sc-info">
                <h4>Designated Route Driver</h4>
                <div className="driver-name-row">
                  <strong>{student.transport.driverName}</strong>
                  <span className="exp-badge">12 Yrs KIET Service</span>
                </div>
                <p>Assigned to Ashok Leyland 52-Seater AC Bus AP 05 TJ 4512.</p>
                <div className="driver-actions">
                  <a href={`tel:${student.transport.driverPhone}`} className="btn-call-driver">
                    <Icon name="phone" /> Call Driver ({student.transport.driverPhone})
                  </a>
                </div>
              </div>
            </div>

            <div className="support-card desk-card">
              <div className="sc-icon"><Icon name="shield" /></div>
              <div className="sc-info">
                <h4>Campus Transport Desk &amp; Helpline</h4>
                <p>Route adjustments, emergency inquiries, or temporary stop changes.</p>
                <div className="desk-contact-row">
                  <span>Helpline: <strong>+91 884 2315333 (Ext. 204)</strong></span>
                  <span>Email: <strong>transport@kietgroup.com</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: SEMESTER RESULTS & GRADE CARDS */}
      {tab === 'results' && (
        <div className="academic-tab-panel">
          {/* Results Metric Banner */}
          <div className="results-hero-metric">
            <div className="rhm-left">
              <span className="rhm-eyebrow">JNTUK SEMESTER EVALUATION</span>
              <div className="rhm-cgpa-row">
                <span className="cgpa-number maven-black">{student.cgpa}</span>
                <div className="cgpa-meta">
                  <span className="cgpa-scale">/ 10.0 CGPA</span>
                  <span className="cgpa-rank">FIRST CLASS WITH DISTINCTION • TOP 5% RANK</span>
                </div>
              </div>
              <p className="rhm-desc">
                Cumulative Grade Point Average across 4 completed semesters under JNTUK academic regulations.
              </p>
            </div>

            <div className="rhm-stats-col">
              <div className="rhm-stat">
                <span className="label">TOTAL CREDITS EARNED</span>
                <strong className="val">87.0 / 87.0</strong>
              </div>
              <div className="rhm-stat">
                <span className="label">ACTIVE BACKLOGS</span>
                <strong className="val text-green">0 (Zero)</strong>
              </div>
              <div className="rhm-stat">
                <span className="label">DEGREE AUDIT</span>
                <strong className="val text-gold">On Track for 2026</strong>
              </div>
            </div>
          </div>

          {/* SGPA Progression Chart */}
          <div className="progression-card">
            <div className="prog-header">
              <div>
                <h4>Semester-Wise SGPA Progression Trend</h4>
                <p>Progression trajectory across semesters.</p>
              </div>
              <span className="prog-average">Avg SGPA: <strong>8.65</strong></span>
            </div>

            <div className="prog-bars-grid">
              {['I', 'II', 'III', 'IV'].map((sem) => {
                const sData = SEMESTER_COURSES[sem]
                const heightPct = Math.round((parseFloat(sData.sgpa) / 10.0) * 100)
                const isSelected = activeSem === sem
                return (
                  <div
                    key={sem}
                    className={`prog-bar-col ${isSelected ? 'active-col' : ''}`}
                    onClick={() => setActiveSem(sem)}
                  >
                    <div className="prog-val-bubble">{sData.sgpa}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ height: `${heightPct}%` }} />
                    </div>
                    <div className="bar-label">Sem {sem}</div>
                    <div className="bar-credits">{sData.credits} Cr</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Semester Selector & Course Table */}
          <div className="courses-table-card">
            <div className="ctc-header">
              <div className="ctc-title-group">
                <div className="sem-buttons-row">
                  {['I', 'II', 'III', 'IV'].map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      className={`sem-tab-btn ${activeSem === sem ? 'active' : ''}`}
                      onClick={() => setActiveSem(sem)}
                    >
                      Semester {sem}
                    </button>
                  ))}
                </div>
                <p className="ctc-sub">
                  Showing authenticated grade points for <strong>Semester {activeSem}</strong> ({selectedSemData.academicYear})
                </p>
              </div>

              <div className="ctc-actions">
                <button
                  type="button"
                  className="btn-download-memo"
                  onClick={() => handleOpenMarksMemo(activeSem)}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Semester {activeSem} Marks Memo (PDF)
                </button>
              </div>
            </div>

            <div className="ledger-table-responsive">
              <table className="modern-academic-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Subject Course Title</th>
                    <th className="text-center">Category</th>
                    <th className="text-center">Credits</th>
                    <th className="text-center">Letter Grade</th>
                    <th className="text-center">Grade Points</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSemData.subjects.map((sub) => (
                    <tr key={sub.code}>
                      <td><strong className="code-font">{sub.code}</strong></td>
                      <td>{sub.title}</td>
                      <td className="text-center"><span className="category-pill">{sub.category}</span></td>
                      <td className="text-center font-bold">{sub.credits}</td>
                      <td className="text-center">
                        <span className={`grade-badge grade-${sub.grade.replace('+', 'plus')}`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="text-center font-bold text-navy">{sub.points.toFixed(1)}</td>
                      <td className="text-center"><span className="status-pill-paid"><Icon name="check" /> PASS</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ctc-footer">
              <div className="grade-legend">
                <span><strong>Grading Scale:</strong></span>
                <span className="legend-item"><b className="grade-O">O</b> = 10.0 (Outstanding)</span>
                <span className="legend-item"><b className="grade-Aplus">A+</b> = 9.0 (Excellent)</span>
                <span className="legend-item"><b className="grade-A">A</b> = 8.0 (Very Good)</span>
              </div>
              <div className="sem-summary-tag">
                Semester {activeSem} Total: <strong>{selectedSemData.credits} Credits</strong> · SGPA: <strong>{selectedSemData.sgpa}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: OFFICIAL FEE RECEIPT PREVIEW */}
      {showFeeReceiptModal && (
        <div className="academic-modal-overlay" onClick={() => setShowFeeReceiptModal(false)}>
          <div className="academic-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <span className="modal-eyebrow">KIET REVENUE &amp; ACCOUNTS AUDIT</span>
                <h3>Official Student Cash / Bank Fee Receipt</h3>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowFeeReceiptModal(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="modal-document-scroll">
              <div dangerouslySetInnerHTML={{ __html: feeReceiptHtml }} />
            </div>

            <div className="modal-bottom-actions">
              <button
                type="button"
                className="btn-academic-secondary"
                onClick={() => setShowFeeReceiptModal(false)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="btn-academic-secondary"
                onClick={handleDownloadFeeReceiptFile}
              >
                <Icon name="save" /> Download Receipt File
              </button>
              <button
                type="button"
                className="btn-academic-primary"
                onClick={handlePrintFeeReceiptDirect}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: DIGITAL BUS PASS PREVIEW */}
      {showBusPassModal && (
        <div className="academic-modal-overlay" onClick={() => setShowBusPassModal(false)}>
          <div className="academic-modal-box" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <span className="modal-eyebrow">KIET LOGISTICS DIVISION</span>
                <h3>Digital Smart Bus Pass (Official Card)</h3>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowBusPassModal(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="modal-document-scroll">
              <div dangerouslySetInnerHTML={{ __html: busPassHtml }} />
            </div>

            <div className="modal-bottom-actions">
              <button
                type="button"
                className="btn-academic-secondary"
                onClick={() => setShowBusPassModal(false)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="btn-academic-primary"
                onClick={handlePrintBusPassDirect}
              >
                <Icon name="printer" /> Print / Save Pass (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: MARKS MEMO PREVIEW */}
      {showMarksMemoModal && (
        <div className="academic-modal-overlay" onClick={() => setShowMarksMemoModal(false)}>
          <div className="academic-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <span className="modal-eyebrow">KIET EXAMINATION CELL • JNTUK</span>
                <h3>Official JNTUK Grade Card (Semester {activeSem})</h3>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowMarksMemoModal(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="modal-document-scroll">
              <div dangerouslySetInnerHTML={{ __html: gradeMemoHtml }} />
            </div>

            <div className="modal-bottom-actions">
              <button
                type="button"
                className="btn-academic-secondary"
                onClick={() => setShowMarksMemoModal(false)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="btn-academic-primary"
                onClick={handlePrintMarksMemoDirect}
              >
                <Icon name="printer" /> Print / Save Memo (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
