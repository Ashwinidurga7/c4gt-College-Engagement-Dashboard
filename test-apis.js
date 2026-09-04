const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body) headers['Content-Length'] = Buffer.byteLength(dataString);

    const req = http.request(
      {
        host: 'localhost',
        port: 5000,
        path,
        method,
        headers,
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          try {
            const parsed = resData ? JSON.parse(resData) : {};
            resolve({ status: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, raw: resData });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (body) req.write(dataString);
    req.end();
  });
};

async function runTests() {
  const results = [];

  function record(name, method, endpoint, status, success, note = '') {
    results.push({ name, method, endpoint, status, passed: success, note });
    const mark = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${resCode(status)}] ${method} ${endpoint} - ${name}`);
  }

  function resCode(code) {
    return code || 'ERR';
  }

  console.log('🚀 Starting Comprehensive API Tests...\n');

  try {
    // 1. Health & Root
    const rRoot = await request('GET', '/');
    record('Root endpoint', 'GET', '/', rRoot.status, rRoot.status === 200 && rRoot.body.success);

    const rHealth = await request('GET', '/api/health');
    record('Health Check', 'GET', '/api/health', rHealth.status, rHealth.status === 200 && rHealth.body.status === 'UP');

    // 2. Auth - Student Login
    const rLoginStud = await request('POST', '/api/auth/login', {
      email: 'alice@student.edu',
      password: 'password123',
    });
    const studentToken = rLoginStud.body.data?.token;
    record('Student Login', 'POST', '/api/auth/login', rLoginStud.status, rLoginStud.status === 200 && !!studentToken);

    // 3. Auth - Admin Login
    const rLoginAdmin = await request('POST', '/api/auth/login', {
      email: 'admin@college.edu',
      password: 'password123',
    });
    const adminToken = rLoginAdmin.body.data?.token;
    record('Admin Login', 'POST', '/api/auth/login', rLoginAdmin.status, rLoginAdmin.status === 200 && !!adminToken);

    // 4. Auth - Faculty Login
    const rLoginFac = await request('POST', '/api/auth/login', {
      email: 'john.smith@college.edu',
      password: 'password123',
    });
    const facultyToken = rLoginFac.body.data?.token;
    record('Faculty Login', 'POST', '/api/auth/login', rLoginFac.status, rLoginFac.status === 200 && !!facultyToken);

    // 5. Auth - Register New User
    const newEmail = `user_${Date.now()}@test.edu`;
    const rReg = await request('POST', '/api/auth/register', {
      name: 'Test Student',
      email: newEmail,
      password: 'password123',
      role: 'student',
    });
    record('User Registration', 'POST', '/api/auth/register', rReg.status, rReg.status === 201 && !!rReg.body.data?.token);

    // 6. Auth - Current User Profile
    const rMe = await request('GET', '/api/auth/me', null, studentToken);
    record('Auth Me Profile', 'GET', '/api/auth/me', rMe.status, rMe.status === 200 && rMe.body.data?.email === 'alice@student.edu');

    // 7. Users - Admin List Users
    const rUsers = await request('GET', '/api/users', null, adminToken);
    record('List All Users (Admin)', 'GET', '/api/users', rUsers.status, rUsers.status === 200 && rUsers.body.data?.length > 0);

    // 8. Departments - List
    const rDepts = await request('GET', '/api/departments');
    record('Get Departments', 'GET', '/api/departments', rDepts.status, rDepts.status === 200 && rDepts.body.count > 0);
    const deptId = rDepts.body.data?.[0]?._id;

    // 9. Departments - Get by ID
    const rDeptSingle = await request('GET', `/api/departments/${deptId}`);
    record('Get Department by ID', 'GET', `/api/departments/${deptId}`, rDeptSingle.status, rDeptSingle.status === 200);

    // 10. Students - List Students
    const rStudents = await request('GET', '/api/students', null, facultyToken);
    record('Get Students List', 'GET', '/api/students', rStudents.status, rStudents.status === 200 && rStudents.body.count > 0);
    const studentId = rStudents.body.data?.[0]?._id;

    // 11. Students - Get Student Profile
    const rStudentProfile = await request('GET', `/api/students/${studentId}`, null, studentToken);
    record('Get Student Details', 'GET', `/api/students/${studentId}`, rStudentProfile.status, rStudentProfile.status === 200);

    // 12. Students - Student Achievements
    const rAchievements = await request('GET', `/api/students/${studentId}/achievements`, null, studentToken);
    record('Get Student Achievements', 'GET', `/api/students/${studentId}/achievements`, rAchievements.status, rAchievements.status === 200);

    // 13. Students - Student Internships
    const rInternships = await request('GET', `/api/students/${studentId}/internships`, null, studentToken);
    record('Get Student Internships', 'GET', `/api/students/${studentId}/internships`, rInternships.status, rInternships.status === 200);

    // 14. Students - Student Certifications
    const rCerts = await request('GET', `/api/students/${studentId}/certifications`, null, studentToken);
    record('Get Student Certifications', 'GET', `/api/students/${studentId}/certifications`, rCerts.status, rCerts.status === 200);

    // 15. Faculty - List Faculty
    const rFaculty = await request('GET', '/api/faculty', null, studentToken);
    record('Get Faculty List', 'GET', '/api/faculty', rFaculty.status, rFaculty.status === 200 && rFaculty.body.count > 0);
    const facultyId = rFaculty.body.data?.[0]?._id;

    // 16. Faculty - Single Faculty
    const rFacSingle = await request('GET', `/api/faculty/${facultyId}`, null, studentToken);
    record('Get Faculty by ID', 'GET', `/api/faculty/${facultyId}`, rFacSingle.status, rFacSingle.status === 200);

    // 17. Activities - List Activities
    const rActivities = await request('GET', '/api/activities', null, studentToken);
    record('Get Student Activities', 'GET', '/api/activities', rActivities.status, rActivities.status === 200 && rActivities.body.count > 0);
    const activityId = rActivities.body.data?.[0]?._id;

    // 18. Activities - Create New Activity
    const rNewAct = await request(
      'POST',
      '/api/activities',
      {
        title: 'IEEE Research Paper Presentation',
        category: 'cat_hackathon',
        description: 'Presented paper on modern web architectures',
        activityDate: '2026-03-01',
        pointsRequested: 30,
      },
      studentToken
    );
    const createdActId = rNewAct.body.data?._id;
    record('Create Student Activity', 'POST', '/api/activities', rNewAct.status, rNewAct.status === 201 && !!createdActId);

    // 19. Activities - Get Activity by ID
    const rActSingle = await request('GET', `/api/activities/${createdActId || activityId}`, null, studentToken);
    record('Get Activity by ID', 'GET', `/api/activities/:id`, rActSingle.status, rActSingle.status === 200);

    // 20. Verification - Faculty Approve Activity
    const rVerify = await request(
      'POST',
      `/api/verification/${createdActId || activityId}`,
      {
        status: 'approved',
        pointsGranted: 30,
        remarks: 'Excellent paper and presentation!',
      },
      facultyToken
    );
    record('Verify/Approve Activity (Faculty)', 'POST', '/api/verification/:activityId', rVerify.status, rVerify.status === 200 && rVerify.body.success);

    // 21. Analytics - Dashboard KPI Stats
    const rAnalytics = await request('GET', '/api/analytics/dashboard', null, adminToken);
    record('Dashboard Analytics', 'GET', '/api/analytics/dashboard', rAnalytics.status, rAnalytics.status === 200 && rAnalytics.body.data?.totalStudents > 0);

    // 22. Analytics - Department Breakdown
    const rDeptAnalytics = await request('GET', '/api/analytics/departments', null, adminToken);
    record('Department Analytics', 'GET', '/api/analytics/departments', rDeptAnalytics.status, rDeptAnalytics.status === 200 && rDeptAnalytics.body.data?.length > 0);

    // 23. Reports - Comprehensive Student Report
    const rStudReport = await request('GET', `/api/reports/student/${studentId}`, null, studentToken);
    record('Generate Student Report', 'GET', `/api/reports/student/:id`, rStudReport.status, rStudReport.status === 200 && !!rStudReport.body.data?.summary);

    // 24. Reports - Department Report
    const rDeptReport = await request('GET', `/api/reports/department/${deptId}`, null, adminToken);
    record('Generate Department Report', 'GET', `/api/reports/department/:id`, rDeptReport.status, rDeptReport.status === 200 && !!rDeptReport.body.data);

    // 25. Notifications - List User Notifications
    const rNotifs = await request('GET', '/api/notifications', null, studentToken);
    record('Get Notifications', 'GET', '/api/notifications', rNotifs.status, rNotifs.status === 200);

    // 26. Notifications - Mark All Read
    const rNotifAll = await request('PUT', '/api/notifications/read-all', {}, studentToken);
    record('Mark All Notifications Read', 'PUT', '/api/notifications/read-all', rNotifAll.status, rNotifAll.status === 200);

    console.log('\n=========================================');
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    console.log(`TOTAL ENDPOINTS TESTED: ${total}`);
    console.log(`PASSED: ${passed} / ${total}`);
    console.log(`FAILED: ${total - passed}`);
    console.log('=========================================');
  } catch (err) {
    console.error('Fatal test runner error:', err);
  }
}

runTests();
