const http = require('http');
const app = require('./app');

const PORT = 5066;
let server;

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
        port: PORT,
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

async function runComprehensiveTests() {
  const results = [];

  function record(section, name, method, endpoint, status, expectedStatus, passedCondition = true, note = '') {
    const success = (status === expectedStatus) && passedCondition;
    results.push({ section, name, method, endpoint, status, expectedStatus, passed: success, note });
    const mark = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${status}] ${method} ${endpoint} - ${name} ${note ? `(${note})` : ''}`);
    if (!success) {
      console.error(`   ⚠️ Details: Expected ${expectedStatus}, Got ${status}. Note: ${note}`);
    }
  }

  console.log('===============================================================');
  console.log('🧪 RUNNING COMPREHENSIVE END-TO-END TEST FOR ALL BACKEND APIS');
  console.log('===============================================================\n');

  try {
    // ----------------------------------------------------------------
    // SECTION 1: Health & Base Endpoints
    // ----------------------------------------------------------------
    console.log('\n--- 1. Health & Root Endpoints ---');
    const rRoot = await request('GET', '/');
    record('Base', 'Root API Status', 'GET', '/', rRoot.status, 200, rRoot.body?.success === true);

    const rHealth = await request('GET', '/api/health');
    record('Base', 'Health Check', 'GET', '/api/health', rHealth.status, 200, rHealth.body?.status === 'UP');

    // ----------------------------------------------------------------
    // SECTION 2: Authentication APIs
    // ----------------------------------------------------------------
    console.log('\n--- 2. Authentication APIs ---');
    const rStudLogin = await request('POST', '/api/auth/login', {
      email: 'alice@student.edu',
      password: 'password123',
    });
    const studentToken = rStudLogin.body?.data?.token;
    record('Auth', 'Student Login', 'POST', '/api/auth/login', rStudLogin.status, 200, !!studentToken);

    const rFacLogin = await request('POST', '/api/auth/login', {
      email: 'john.smith@college.edu',
      password: 'password123',
    });
    const facultyToken = rFacLogin.body?.data?.token;
    record('Auth', 'Faculty Login', 'POST', '/api/auth/login', rFacLogin.status, 200, !!facultyToken);

    const rAdmLogin = await request('POST', '/api/auth/login', {
      email: 'admin@college.edu',
      password: 'password123',
    });
    const adminToken = rAdmLogin.body?.data?.token;
    record('Auth', 'Admin Login', 'POST', '/api/auth/login', rAdmLogin.status, 200, !!adminToken);

    const uniqueEmail = `newstudent_${Date.now()}@test.edu`;
    const rRegister = await request('POST', '/api/auth/register', {
      name: 'Bob Candidate',
      email: uniqueEmail,
      password: 'password123',
      role: 'student',
    });
    const tempUserToken = rRegister.body?.data?.token;
    const tempUserId = rRegister.body?.data?.user?._id;
    record('Auth', 'Register New User', 'POST', '/api/auth/register', rRegister.status, 201, !!tempUserToken);

    const rMe = await request('GET', '/api/auth/me', null, studentToken);
    record('Auth', 'Get Profile /api/auth/me', 'GET', '/api/auth/me', rMe.status, 200, rMe.body?.data?.email === 'alice@student.edu');

    // ----------------------------------------------------------------
    // SECTION 3: User Management APIs
    // ----------------------------------------------------------------
    console.log('\n--- 3. User Management APIs ---');
    const rUsers = await request('GET', '/api/users', null, adminToken);
    record('Users', 'List All Users (Admin)', 'GET', '/api/users', rUsers.status, 200, Array.isArray(rUsers.body?.data));

    const rUserById = await request('GET', `/api/users/${tempUserId || 'user_student_1'}`, null, adminToken);
    record('Users', 'Get User by ID', 'GET', '/api/users/:id', rUserById.status, 200, !!rUserById.body?.data?.email);

    const rUpdateUser = await request('PUT', `/api/users/${tempUserId || 'user_student_1'}`, { name: 'Bob Updated' }, adminToken);
    record('Users', 'Update User', 'PUT', '/api/users/:id', rUpdateUser.status, 200, rUpdateUser.body?.data?.name === 'Bob Updated');

    if (tempUserId) {
      const rDeleteUser = await request('DELETE', `/api/users/${tempUserId}`, null, adminToken);
      record('Users', 'Delete User (Admin)', 'DELETE', '/api/users/:id', rDeleteUser.status, 200, rDeleteUser.body?.success === true);
    }

    // ----------------------------------------------------------------
    // SECTION 4: Department APIs
    // ----------------------------------------------------------------
    console.log('\n--- 4. Department APIs ---');
    const rDepts = await request('GET', '/api/departments');
    record('Departments', 'Get Departments', 'GET', '/api/departments', rDepts.status, 200, rDepts.body?.count > 0);
    const deptId = rDepts.body?.data?.[0]?._id;

    const rDeptById = await request('GET', `/api/departments/${deptId}`);
    record('Departments', 'Get Department by ID', 'GET', `/api/departments/:id`, rDeptById.status, 200, !!rDeptById.body?.data?.name);

    const rCreateDept = await request('POST', '/api/departments', {
      name: `Information Technology ${Date.now()}`,
      code: `IT_${Math.floor(Math.random()*1000)}`,
      description: 'Department of IT',
    }, adminToken);
    record('Departments', 'Create Department (Admin)', 'POST', '/api/departments', rCreateDept.status, 201, !!rCreateDept.body?.data?._id);

    // ----------------------------------------------------------------
    // SECTION 5: Student APIs
    // ----------------------------------------------------------------
    console.log('\n--- 5. Student APIs ---');
    const rStudents = await request('GET', '/api/students', null, facultyToken);
    record('Students', 'Get Students List', 'GET', '/api/students', rStudents.status, 200, rStudents.body?.count > 0);
    const studentId = rStudents.body?.data?.[0]?._id;

    const rStudentMe = await request('GET', '/api/students/me', null, studentToken);
    record('Students', 'Get Student /me', 'GET', '/api/students/me', rStudentMe.status, 200, !!rStudentMe.body?.data?.rollNumber);

    const rStudentById = await request('GET', `/api/students/${studentId}`, null, studentToken);
    record('Students', 'Get Student by ID', 'GET', '/api/students/:id', rStudentById.status, 200, rStudentById.body?.data?._id === studentId);

    const rAchievements = await request('GET', `/api/students/${studentId}/achievements`, null, studentToken);
    record('Students', 'Get Student Achievements', 'GET', `/api/students/:id/achievements`, rAchievements.status, 200, Array.isArray(rAchievements.body?.data));

    const rInternships = await request('GET', `/api/students/${studentId}/internships`, null, studentToken);
    record('Students', 'Get Student Internships', 'GET', `/api/students/:id/internships`, rInternships.status, 200, Array.isArray(rInternships.body?.data));

    const rCertifications = await request('GET', `/api/students/${studentId}/certifications`, null, studentToken);
    record('Students', 'Get Student Certifications', 'GET', `/api/students/:id/certifications`, rCertifications.status, 200, Array.isArray(rCertifications.body?.data));

    // ----------------------------------------------------------------
    // SECTION 6: Faculty APIs
    // ----------------------------------------------------------------
    console.log('\n--- 6. Faculty APIs ---');
    const rFaculty = await request('GET', '/api/faculty', null, studentToken);
    record('Faculty', 'Get Faculty List', 'GET', '/api/faculty', rFaculty.status, 200, rFaculty.body?.count > 0);
    const facultyId = rFaculty.body?.data?.[0]?._id;

    const rFacSingle = await request('GET', `/api/faculty/${facultyId}`, null, studentToken);
    record('Faculty', 'Get Faculty by ID', 'GET', `/api/faculty/:id`, rFacSingle.status, 200, !!rFacSingle.body?.data?.designation);

    // ----------------------------------------------------------------
    // SECTION 7: Activity APIs
    // ----------------------------------------------------------------
    console.log('\n--- 7. Activity APIs ---');
    const rActs = await request('GET', '/api/activities', null, studentToken);
    record('Activities', 'Get Activities', 'GET', '/api/activities', rActs.status, 200, Array.isArray(rActs.body?.data));

    const rCreateAct = await request('POST', '/api/activities', {
      title: 'National AI Hackathon Participation',
      category: 'cat_hackathon',
      description: 'Built multimodal edge AI pipeline',
      activityDate: '2026-04-10',
      pointsRequested: 20,
    }, studentToken);
    record('Activities', 'Create Activity (Student)', 'POST', '/api/activities', rCreateAct.status, 201, !!rCreateAct.body?.data?._id);
    const testActId = rCreateAct.body?.data?._id;

    const rGetAct = await request('GET', `/api/activities/${testActId}`, null, studentToken);
    record('Activities', 'Get Activity by ID', 'GET', `/api/activities/:id`, rGetAct.status, 200, !!rGetAct.body?.data?._id);

    const rUpdateAct = await request('PUT', `/api/activities/${testActId}`, { pointsRequested: 25 }, studentToken);
    record('Activities', 'Update Activity', 'PUT', `/api/activities/:id`, rUpdateAct.status, 200, rUpdateAct.body?.data?.pointsRequested === 25);

    // ----------------------------------------------------------------
    // SECTION 8: Verification APIs
    // ----------------------------------------------------------------
    console.log('\n--- 8. Verification APIs ---');
    const rVerifyAct = await request('POST', `/api/verification/${testActId}`, {
      status: 'approved',
      pointsGranted: 25,
      remarks: 'Verified by Faculty Lead',
    }, facultyToken);
    record('Verification', 'Verify Activity (Faculty)', 'POST', `/api/verification/:activityId`, rVerifyAct.status, 200, rVerifyAct.body?.success === true);

    const rVerifyHistory = await request('GET', `/api/verification/activity/${testActId}`, null, studentToken);
    record('Verification', 'Get Verification History', 'GET', `/api/verification/activity/:activityId`, rVerifyHistory.status, 200, rVerifyHistory.body?.count >= 1);

    // ----------------------------------------------------------------
    // SECTION 9: Analytics APIs
    // ----------------------------------------------------------------
    console.log('\n--- 9. Analytics APIs ---');
    const rAnalyticsDash = await request('GET', '/api/analytics/dashboard', null, adminToken);
    record('Analytics', 'Get Dashboard Analytics', 'GET', '/api/analytics/dashboard', rAnalyticsDash.status, 200, typeof rAnalyticsDash.body?.data?.totalStudents === 'number');

    const rAnalyticsDept = await request('GET', '/api/analytics/departments', null, adminToken);
    record('Analytics', 'Get Department Analytics', 'GET', '/api/analytics/departments', rAnalyticsDept.status, 200, Array.isArray(rAnalyticsDept.body?.data));

    // ----------------------------------------------------------------
    // SECTION 10: Report APIs
    // ----------------------------------------------------------------
    console.log('\n--- 10. Report APIs ---');
    const rStudReport = await request('GET', `/api/reports/student/${studentId}`, null, studentToken);
    record('Reports', 'Get Student Report', 'GET', `/api/reports/student/:studentId`, rStudReport.status, 200, !!rStudReport.body?.data?.summary);

    const rDeptReport = await request('GET', `/api/reports/department/${deptId}`, null, adminToken);
    record('Reports', 'Get Department Report', 'GET', `/api/reports/department/:departmentId`, rDeptReport.status, 200, typeof rDeptReport.body?.data?.totalStudents === 'number');

    // ----------------------------------------------------------------
    // SECTION 11: Notification APIs
    // ----------------------------------------------------------------
    console.log('\n--- 11. Notification APIs ---');
    const rNotifs = await request('GET', '/api/notifications', null, studentToken);
    record('Notifications', 'Get Notifications', 'GET', '/api/notifications', rNotifs.status, 200, Array.isArray(rNotifs.body?.data));

    const rReadNotifs = await request('PUT', '/api/notifications/read-all', {}, studentToken);
    record('Notifications', 'Mark All Read', 'PUT', '/api/notifications/read-all', rReadNotifs.status, 200, rReadNotifs.body?.success === true);

    // ----------------------------------------------------------------
    // SECTION 12: Course APIs
    // ----------------------------------------------------------------
    console.log('\n--- 12. Course APIs ---');
    const rCourses = await request('GET', '/api/courses', null, studentToken);
    record('Courses', 'Get All Courses', 'GET', '/api/courses', rCourses.status, 200, rCourses.body?.count > 0);
    const courseId = rCourses.body?.data?.[0]?._id;

    const rCourseById = await request('GET', `/api/courses/${courseId}`, null, studentToken);
    record('Courses', 'Get Course by ID', 'GET', `/api/courses/:id`, rCourseById.status, 200, !!rCourseById.body?.data?.name);

    const testCourseCode = `CS_${Date.now().toString().slice(-4)}`;
    const rCreateCourse = await request('POST', '/api/courses', {
      code: testCourseCode,
      name: 'Cybersecurity Fundamentals',
      credits: 3,
      semester: 5,
      capacity: 35,
    }, facultyToken);
    record('Courses', 'Create Course (Faculty)', 'POST', '/api/courses', rCreateCourse.status, 201, !!rCreateCourse.body?.data?._id);
    const newCourseId = rCreateCourse.body?.data?._id;

    const rUpdateCourse = await request('PUT', `/api/courses/${newCourseId}`, { description: 'Network defense and cryptography' }, adminToken);
    record('Courses', 'Update Course (Admin)', 'PUT', `/api/courses/:id`, rUpdateCourse.status, 200, rUpdateCourse.body?.data?.description === 'Network defense and cryptography');

    const rEnroll = await request('POST', `/api/courses/${newCourseId}/enroll`, null, studentToken);
    record('Courses', 'Enroll in Course (Student)', 'POST', `/api/courses/:id/enroll`, rEnroll.status, 200, rEnroll.body?.success === true);

    const rCourseStudents = await request('GET', `/api/courses/${newCourseId}/students`, null, facultyToken);
    record('Courses', 'Get Course Students', 'GET', `/api/courses/:id/students`, rCourseStudents.status, 200, rCourseStudents.body?.count >= 1);

    const rDelCourse = await request('DELETE', `/api/courses/${newCourseId}`, null, adminToken);
    record('Courses', 'Delete Course (Admin)', 'DELETE', `/api/courses/:id`, rDelCourse.status, 200, rDelCourse.body?.success === true);

    // ----------------------------------------------------------------
    // SECTION 13: Certificate APIs
    // ----------------------------------------------------------------
    console.log('\n--- 13. Certificate APIs ---');
    const rCerts = await request('GET', '/api/certificates', null, studentToken);
    record('Certificates', 'Get Certificates', 'GET', '/api/certificates', rCerts.status, 200, Array.isArray(rCerts.body?.data));

    const rCreateCert = await request('POST', '/api/certificates', {
      title: 'Google Professional Cloud Architect',
      issuingOrganization: 'Google Cloud',
      issueDate: '2026-02-01',
      credentialId: 'GCP-PCA-9876',
      skills: ['GCP', 'Kubernetes', 'Cloud Security'],
    }, studentToken);
    record('Certificates', 'Submit Certificate (Student)', 'POST', '/api/certificates', rCreateCert.status, 201, !!rCreateCert.body?.data?._id);
    const testCertId = rCreateCert.body?.data?._id;

    const rGetCert = await request('GET', `/api/certificates/${testCertId}`, null, studentToken);
    record('Certificates', 'Get Certificate by ID', 'GET', `/api/certificates/:id`, rGetCert.status, 200, !!rGetCert.body?.data?.title);

    const rVerifyCert = await request('PUT', `/api/certificates/${testCertId}/verify`, {
      status: 'verified',
      remarks: 'Verified via Google Credential link',
    }, facultyToken);
    record('Certificates', 'Verify Certificate (Faculty)', 'PUT', `/api/certificates/:id/verify`, rVerifyCert.status, 200, rVerifyCert.body?.data?.status === 'verified');

    const rDelCert = await request('DELETE', `/api/certificates/${testCertId}`, null, studentToken);
    record('Certificates', 'Delete Certificate', 'DELETE', `/api/certificates/:id`, rDelCert.status, 200, rDelCert.body?.success === true);

    // ----------------------------------------------------------------
    // SECTION 14: Project APIs
    // ----------------------------------------------------------------
    console.log('\n--- 14. Project APIs ---');
    const rProjs = await request('GET', '/api/projects', null, studentToken);
    record('Projects', 'Get Projects', 'GET', '/api/projects', rProjs.status, 200, Array.isArray(rProjs.body?.data));

    const rCreateProj = await request('POST', '/api/projects', {
      title: 'Blockchain Based Academic Credential Verification',
      description: 'Smart contracts for verifiable digital student degrees',
      technologies: ['Solidity', 'Ethereum', 'Web3.js', 'React'],
      githubUrl: 'https://github.com/alice/cred-chain',
      status: 'completed',
    }, studentToken);
    record('Projects', 'Create Project (Student)', 'POST', '/api/projects', rCreateProj.status, 201, !!rCreateProj.body?.data?._id);
    const testProjId = rCreateProj.body?.data?._id;

    const rGetProj = await request('GET', `/api/projects/${testProjId}`, null, studentToken);
    record('Projects', 'Get Project by ID', 'GET', `/api/projects/:id`, rGetProj.status, 200, !!rGetProj.body?.data?.title);

    const rUpdateProj = await request('PUT', `/api/projects/${testProjId}`, {
      liveUrl: 'https://cred-chain-demo.net',
    }, studentToken);
    record('Projects', 'Update Project', 'PUT', `/api/projects/:id`, rUpdateProj.status, 200, rUpdateProj.body?.data?.liveUrl === 'https://cred-chain-demo.net');

    const rDelProj = await request('DELETE', `/api/projects/${testProjId}`, null, studentToken);
    record('Projects', 'Delete Project', 'DELETE', `/api/projects/:id`, rDelProj.status, 200, rDelProj.body?.success === true);

    // ----------------------------------------------------------------
    // SECTION 15: Resume APIs
    // ----------------------------------------------------------------
    console.log('\n--- 15. Resume APIs ---');
    const rResumes = await request('GET', '/api/resumes', null, studentToken);
    record('Resumes', 'Get All Resumes', 'GET', '/api/resumes', rResumes.status, 200, Array.isArray(rResumes.body?.data));

    const rMyResume = await request('GET', '/api/resumes/me', null, studentToken);
    record('Resumes', 'Get My Primary Resume', 'GET', '/api/resumes/me', rMyResume.status, 200, !!rMyResume.body?.data?.title);

    const rGenResume = await request('GET', '/api/resumes/generate', null, studentToken);
    record('Resumes', 'Auto-Generate Resume Dataset', 'GET', '/api/resumes/generate', rGenResume.status, 200, !!rGenResume.body?.data?.personalInfo?.rollNumber);

    const rCreateResume = await request('POST', '/api/resumes', {
      title: 'Alice Johnson - Systems Engineer Resume',
      summary: 'Specializing in distributed infrastructure and backend design',
      skills: ['Go', 'Rust', 'Docker', 'Kubernetes'],
      template: 'classic',
      isDefault: false,
    }, studentToken);
    record('Resumes', 'Create Custom Resume', 'POST', '/api/resumes', rCreateResume.status, 201, !!rCreateResume.body?.data?._id);
    const testResumeId = rCreateResume.body?.data?._id;

    const rGetResume = await request('GET', `/api/resumes/${testResumeId}`, null, studentToken);
    record('Resumes', 'Get Resume by ID', 'GET', `/api/resumes/:id`, rGetResume.status, 200, !!rGetResume.body?.data?.title);

    const rDelResume = await request('DELETE', `/api/resumes/${testResumeId}`, null, studentToken);
    record('Resumes', 'Delete Resume', 'DELETE', `/api/resumes/:id`, rDelResume.status, 200, rDelResume.body?.success === true);

    // ----------------------------------------------------------------
    // SECTION 16: Admin Portal APIs
    // ----------------------------------------------------------------
    console.log('\n--- 16. Admin Portal APIs ---');
    const rAdminDash = await request('GET', '/api/admin/dashboard', null, adminToken);
    record('Admin', 'Get Dashboard Analytics', 'GET', '/api/admin/dashboard', rAdminDash.status, 200, !!rAdminDash.body?.data?.users);

    const rAdminUsers = await request('GET', '/api/admin/users', null, adminToken);
    record('Admin', 'Get Users List', 'GET', '/api/admin/users', rAdminUsers.status, 200, rAdminUsers.body?.count > 0);

    const rAdminPending = await request('GET', '/api/admin/pending', null, adminToken);
    record('Admin', 'Get Pending Verifications', 'GET', '/api/admin/pending', rAdminPending.status, 200, typeof rAdminPending.body?.data?.totalPending === 'number');

    const rAdminBatch = await request('POST', '/api/admin/activities/batch-approve', {
      activityIds: [testActId],
      action: 'approve',
      pointsAwarded: 20,
      remarks: 'Batch confirmed in admin audit',
    }, adminToken);
    record('Admin', 'Batch Approve Activities', 'POST', '/api/admin/activities/batch-approve', rAdminBatch.status, 200, rAdminBatch.body?.success === true);

    const rAdminSettings = await request('GET', '/api/admin/settings', null, adminToken);
    record('Admin', 'Get System Settings', 'GET', '/api/admin/settings', rAdminSettings.status, 200, !!rAdminSettings.body?.data?.academicYear);

    const rAdminUpdateSettings = await request('PUT', '/api/admin/settings', {
      currentSemester: 'Fall 2026',
    }, adminToken);
    record('Admin', 'Update System Settings', 'PUT', '/api/admin/settings', rAdminUpdateSettings.status, 200, rAdminUpdateSettings.body?.data?.currentSemester === 'Fall 2026');

    // ----------------------------------------------------------------
    // SECTION 17: Security & Role Guards
    // ----------------------------------------------------------------
    console.log('\n--- 17. Security & Role Guards ---');
    const rNoToken = await request('GET', '/api/activities');
    record('Security', 'Block Unauthenticated Request (401)', 'GET', '/api/activities', rNoToken.status, 401, rNoToken.body?.success === false);

    const rStudentBlockedAdmin = await request('GET', '/api/admin/dashboard', null, studentToken);
    record('Security', 'Block Student from Admin Dashboard (403)', 'GET', '/api/admin/dashboard', rStudentBlockedAdmin.status, 403, rStudentBlockedAdmin.body?.success === false);

    const rStudentBlockedCourseCreate = await request('POST', '/api/courses', { code: 'HACK99', name: 'Illegal Course' }, studentToken);
    record('Security', 'Block Student from Creating Course (403)', 'POST', '/api/courses', rStudentBlockedCourseCreate.status, 403, rStudentBlockedCourseCreate.body?.success === false);

    const rStudentBlockedVerify = await request('POST', `/api/verification/${testActId}`, { status: 'approved' }, studentToken);
    record('Security', 'Block Student from Verifying Activities (403)', 'POST', `/api/verification/:id`, rStudentBlockedVerify.status, 403, rStudentBlockedVerify.body?.success === false);

    // Delete test activity
    await request('DELETE', `/api/activities/${testActId}`, null, adminToken);

    // ----------------------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------------------
    console.log('\n===============================================================');
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    const failed = total - passed;

    console.log(`TOTAL APIS TESTED : ${total}`);
    console.log(`PASSED            : ${passed}`);
    console.log(`FAILED            : ${failed}`);
    console.log('===============================================================');

    if (failed > 0) {
      console.error(`\n❌ THERE ARE ${failed} FAILED TESTS!`);
      process.exit(1);
    } else {
      console.log('\n🎉 ALL APIS ACROSS THE ENTIRE BACKEND ARE WORKING PERFECTLY WITH 0 ERRORS!');
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
}

server = app.listen(PORT, async () => {
  await runComprehensiveTests();
  server.close();
  process.exit(0);
});
