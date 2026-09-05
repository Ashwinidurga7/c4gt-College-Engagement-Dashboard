const http = require('http');
const app = require('./app');

const PORT = 5055;
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

async function runTests() {
  const results = [];

  function record(name, method, endpoint, status, success, note = '') {
    results.push({ name, method, endpoint, status, passed: success, note });
    const mark = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${status}] ${method} ${endpoint} - ${name} ${note ? `(${note})` : ''}`);
  }

  console.log('🚀 Starting New Routes Test Suite (Course, Certificate, Project, Resume, Admin)...\n');

  try {
    // 1. Get Tokens for Student, Faculty, Admin
    const studLogin = await request('POST', '/api/auth/login', {
      email: 'alice@student.edu',
      password: 'password123',
    });
    const studentToken = studLogin.body.data?.token;

    const facLogin = await request('POST', '/api/auth/login', {
      email: 'john.smith@college.edu',
      password: 'password123',
    });
    const facultyToken = facLogin.body.data?.token;

    const admLogin = await request('POST', '/api/auth/login', {
      email: 'admin@college.edu',
      password: 'password123',
    });
    const adminToken = admLogin.body.data?.token;

    // ==========================================
    // 2. COURSE ROUTES
    // ==========================================
    console.log('\n--- Testing Course Routes ---');
    const rCourses = await request('GET', '/api/courses', null, studentToken);
    record('Get all courses', 'GET', '/api/courses', rCourses.status, rCourses.status === 200 && rCourses.body.count > 0);
    const firstCourseId = rCourses.body.data?.[0]?._id;

    const rCourseById = await request('GET', `/api/courses/${firstCourseId}`, null, studentToken);
    record('Get single course', 'GET', `/api/courses/:id`, rCourseById.status, rCourseById.status === 200);

    const rCreateCourse = await request('POST', '/api/courses', {
      code: 'CS505',
      name: 'Distributed Systems & Microservices',
      credits: 4,
      semester: 7,
      capacity: 40,
    }, facultyToken);
    record('Create course (Faculty)', 'POST', '/api/courses', rCreateCourse.status, rCreateCourse.status === 201);
    const createdCourseId = rCreateCourse.body.data?._id;

    const rUpdateCourse = await request('PUT', `/api/courses/${createdCourseId}`, {
      description: 'Advanced distributed architectures and consensus mechanisms',
    }, adminToken);
    record('Update course (Admin)', 'PUT', `/api/courses/:id`, rUpdateCourse.status, rUpdateCourse.status === 200);

    const rEnroll = await request('POST', `/api/courses/${createdCourseId}/enroll`, null, studentToken);
    record('Student enroll in course', 'POST', `/api/courses/:id/enroll`, rEnroll.status, rEnroll.status === 200);

    const rCourseStudents = await request('GET', `/api/courses/${createdCourseId}/students`, null, facultyToken);
    record('Get course enrolled students', 'GET', `/api/courses/:id/students`, rCourseStudents.status, rCourseStudents.status === 200 && rCourseStudents.body.count >= 1);

    // ==========================================
    // 3. CERTIFICATE ROUTES
    // ==========================================
    console.log('\n--- Testing Certificate Routes ---');
    const rCerts = await request('GET', '/api/certificates', null, studentToken);
    record('Get student certificates', 'GET', '/api/certificates', rCerts.status, rCerts.status === 200);

    const rCreateCert = await request('POST', '/api/certificates', {
      title: 'Meta Frontend Developer Professional Certificate',
      issuingOrganization: 'Meta / Coursera',
      issueDate: '2025-12-01',
      credentialId: 'META-CERT-7788',
      skills: ['React', 'JavaScript', 'CSS3', 'UI/UX'],
    }, studentToken);
    record('Submit new certificate', 'POST', '/api/certificates', rCreateCert.status, rCreateCert.status === 201);
    const newCertId = rCreateCert.body.data?._id;

    const rVerifyCert = await request('PUT', `/api/certificates/${newCertId}/verify`, {
      status: 'verified',
      remarks: 'Verified successfully against Coursera credential link.',
    }, facultyToken);
    record('Verify certificate (Faculty)', 'PUT', `/api/certificates/:id/verify`, rVerifyCert.status, rVerifyCert.status === 200 && rVerifyCert.body.data?.status === 'verified');

    // ==========================================
    // 4. PROJECT ROUTES
    // ==========================================
    console.log('\n--- Testing Project Routes ---');
    const rProjects = await request('GET', '/api/projects', null, studentToken);
    record('Get student projects', 'GET', '/api/projects', rProjects.status, rProjects.status === 200 && rProjects.body.count > 0);

    const rCreateProj = await request('POST', '/api/projects', {
      title: 'Autonomous Drone Navigation System',
      description: 'Computer vision based obstacle avoidance system using ROS and OpenCV.',
      technologies: ['Python', 'OpenCV', 'ROS', 'TensorFlow'],
      githubUrl: 'https://github.com/alice/drone-nav',
      status: 'completed',
    }, studentToken);
    record('Create project', 'POST', '/api/projects', rCreateProj.status, rCreateProj.status === 201);
    const newProjId = rCreateProj.body.data?._id;

    const rGetProj = await request('GET', `/api/projects/${newProjId}`, null, studentToken);
    record('Get project by ID', 'GET', `/api/projects/:id`, rGetProj.status, rGetProj.status === 200);

    // ==========================================
    // 5. RESUME ROUTES
    // ==========================================
    console.log('\n--- Testing Resume Routes ---');
    const rResumes = await request('GET', '/api/resumes', null, studentToken);
    record('Get resumes list', 'GET', '/api/resumes', rResumes.status, rResumes.status === 200);

    const rMyResume = await request('GET', '/api/resumes/me', null, studentToken);
    record('Get primary student resume', 'GET', '/api/resumes/me', rMyResume.status, rMyResume.status === 200);

    const rGenResume = await request('GET', '/api/resumes/generate', null, studentToken);
    record('Auto-generate structured resume data', 'GET', '/api/resumes/generate', rGenResume.status, rGenResume.status === 200 && !!rGenResume.body.data?.personalInfo);

    const rCreateResume = await request('POST', '/api/resumes', {
      title: 'Alice Johnson - Cloud & AI Specialist Resume',
      summary: 'Focused on cloud computing and distributed systems.',
      skills: ['AWS', 'Docker', 'React', 'Node.js', 'Python'],
      template: 'minimal',
    }, studentToken);
    record('Create custom resume', 'POST', '/api/resumes', rCreateResume.status, rCreateResume.status === 201);

    // ==========================================
    // 6. ADMIN ROUTES & ROLE GUARDS
    // ==========================================
    console.log('\n--- Testing Admin Routes & Role Guards ---');
    const rAdminForbidden = await request('GET', '/api/admin/dashboard', null, studentToken);
    record('Student access to admin dashboard blocked', 'GET', '/api/admin/dashboard', rAdminForbidden.status, rAdminForbidden.status === 403, 'Forbidden as expected');

    const rAdminDash = await request('GET', '/api/admin/dashboard', null, adminToken);
    record('Admin dashboard stats', 'GET', '/api/admin/dashboard', rAdminDash.status, rAdminDash.status === 200 && !!rAdminDash.body.data?.users);

    const rAdminUsers = await request('GET', '/api/admin/users', null, adminToken);
    record('Admin get all users', 'GET', '/api/admin/users', rAdminUsers.status, rAdminUsers.status === 200 && rAdminUsers.body.count > 0);

    const rAdminPending = await request('GET', '/api/admin/pending', null, adminToken);
    record('Admin pending verifications', 'GET', '/api/admin/pending', rAdminPending.status, rAdminPending.status === 200 && typeof rAdminPending.body.data?.totalPending === 'number');

    const rAdminBatch = await request('POST', '/api/admin/activities/batch-approve', {
      activityIds: ['act_2'],
      action: 'approve',
      pointsAwarded: 25,
      remarks: 'Batch verified by System Admin',
    }, adminToken);
    record('Admin batch approve activities', 'POST', '/api/admin/activities/batch-approve', rAdminBatch.status, rAdminBatch.status === 200);

    const rAdminSettings = await request('GET', '/api/admin/settings', null, adminToken);
    record('Admin get system settings', 'GET', '/api/admin/settings', rAdminSettings.status, rAdminSettings.status === 200 && !!rAdminSettings.body.data?.academicYear);

    const rAdminUpdateSettings = await request('PUT', '/api/admin/settings', {
      academicYear: '2026-2027',
      portalMaintenance: false,
    }, adminToken);
    record('Admin update system settings', 'PUT', '/api/admin/settings', rAdminUpdateSettings.status, rAdminUpdateSettings.status === 200 && rAdminUpdateSettings.body.data?.academicYear === '2026-2027');

    // Summary
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    const failed = total - passed;

    console.log('\n=========================================');
    console.log(`Test Execution Finished: ${passed}/${total} Passed, ${failed} Failed`);
    console.log('=========================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
}

server = app.listen(PORT, async () => {
  await runTests();
  server.close();
  process.exit(0);
});
