const app = require('./app');
const http = require('http');

let server;
let baseUrl;

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  return { status: res.status, data };
}

async function login(email, password) {
  const res = await request('POST', '/api/auth/login', { email, password });
  const token = res.data?.token || res.data?.data?.token;
  if (!token) {
    throw new Error(`Login failed for ${email}: ${JSON.stringify(res.data)}`);
  }
  return token;
}

async function runTests() {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
  console.log(`Test server running at ${baseUrl}`);

  try {
    console.log('\n--- 1. Authenticate Students from all 3 Colleges ---');
    const kietToken = await login('alice@student.edu', 'password123');
    console.log('✅ Student (KIET) logged in successfully');

    const kietPlusToken = await login('farooq@student.edu', 'password123');
    console.log('✅ Student (KIET+) logged in successfully');

    const kiewToken = await login('geeta@student.edu', 'password123');
    console.log('✅ Student (KIEW) logged in successfully');

    const adminToken = await login('admin@college.edu', 'password123');
    console.log('✅ Admin logged in successfully');

    console.log('\n--- 2. Verify Club Visibility for KIET Student ---');
    const resKiet = await request('GET', '/api/clubs', null, kietToken);
    console.log(`Status: ${resKiet.status}, Count: ${resKiet.data.count}`);
    const kietClubs = resKiet.data.data;
    console.log('Clubs seen by KIET student:');
    kietClubs.forEach((c) => console.log(`  - ${c.name} (College: ${c.college}, Status: ${c.status})`));
    if (kietClubs.length !== 4) throw new Error(`Expected 4 clubs, got ${kietClubs.length}`);

    console.log('\n--- 3. Verify Club Visibility for KIET+ Student ---');
    const resKietPlus = await request('GET', '/api/clubs', null, kietPlusToken);
    console.log(`Status: ${resKietPlus.status}, Count: ${resKietPlus.data.count}`);
    const kietPlusClubs = resKietPlus.data.data;
    console.log('Clubs seen by KIET+ student:');
    kietPlusClubs.forEach((c) => console.log(`  - ${c.name} (College: ${c.college}, Status: ${c.status})`));
    if (kietPlusClubs.length !== 4) throw new Error(`Expected 4 clubs, got ${kietPlusClubs.length}`);

    console.log('\n--- 4. Verify Club Visibility for KIEW Student ---');
    const resKiew = await request('GET', '/api/clubs', null, kiewToken);
    console.log(`Status: ${resKiew.status}, Count: ${resKiew.data.count}`);
    const kiewClubs = resKiew.data.data;
    console.log('Clubs seen by KIEW student:');
    kiewClubs.forEach((c) => console.log(`  - ${c.name} (College: ${c.college}, Status: ${c.status})`));
    if (kiewClubs.length !== 4) throw new Error(`Expected 4 clubs, got ${kiewClubs.length}`);

    // Verify all 4 expected clubs are present in all lists
    const expectedClubNames = ['Global Coding Club', 'C4GT-Hub', 'Toastmaster Club', 'NCC & NSS'];
    for (const name of expectedClubNames) {
      if (!kietClubs.some((c) => c.name === name)) throw new Error(`KIET student missing ${name}`);
      if (!kietPlusClubs.some((c) => c.name === name)) throw new Error(`KIET+ student missing ${name}`);
      if (!kiewClubs.some((c) => c.name === name)) throw new Error(`KIEW student missing ${name}`);
    }
    console.log('✅ All 4 active clubs correctly returned to students of KIET, KIET+, and KIEW without filtering!');

    // Verify inactive club is NOT visible to students
    if (kietClubs.some((c) => c.status === 'inactive' || c.isActive === false)) {
      throw new Error('Inactive club found in student results!');
    }
    console.log('✅ Inactive club correctly excluded from student visibility');

    console.log('\n--- 5. Verify Student Dashboard Integration ---');
    const resDashboard = await request('GET', '/api/students/dashboard', null, kietToken);
    console.log(`Dashboard response status: ${resDashboard.status}`);
    if (!resDashboard.data.data.clubsSummary || resDashboard.data.data.clubsSummary.total !== 4) {
      throw new Error(`Expected 4 clubs in dashboard, got ${resDashboard.data.data.clubsSummary?.total}`);
    }
    console.log('✅ Student dashboard successfully returns all 4 active clubs in clubsSummary');

    console.log('\n--- 6. Verify Admin Club Management ---');
    // Admin attempts to create a club with invalid college
    const resBadCollege = await request('POST', '/api/clubs', {
      name: 'Invalid College Club',
      college: 'UNKNOWN_COLLEGE',
    }, adminToken);
    console.log(`Invalid college rejection status: ${resBadCollege.status} (expected 400)`);
    if (resBadCollege.status !== 400) throw new Error('Failed to reject invalid college');

    // Admin creates a new club in KIEW
    const resCreate = await request('POST', '/api/clubs', {
      name: 'AI & Data Science Club',
      code: 'AIDS',
      college: 'KIEW',
      category: 'Technical',
      description: 'Advancing Artificial Intelligence, ML models, and Data Analytics.',
      membersCount: 40,
    }, adminToken);
    console.log(`Create club status: ${resCreate.status}`);
    const createdClub = resCreate.data.data;
    console.log(`Created club: ${createdClub.name} (id: ${createdClub._id}, college: ${createdClub.college})`);

    // Verify KIET student can immediately see the new KIEW club!
    const resKietAfterCreate = await request('GET', '/api/clubs', null, kietToken);
    console.log(`KIET student now sees ${resKietAfterCreate.data.count} clubs (expected 5)`);
    if (resKietAfterCreate.data.count !== 5) throw new Error('Student did not see newly created club across college');

    // Admin updates the club
    const resUpdate = await request('PUT', `/api/clubs/${createdClub._id}`, {
      description: 'Updated description for AI & Data Science Club',
      membersCount: 55,
    }, adminToken);
    console.log(`Update club status: ${resUpdate.status}, membersCount: ${resUpdate.data.data.membersCount}`);

    // Admin deactivates the club
    const resDeactivate = await request('PUT', `/api/clubs/${createdClub._id}/deactivate`, null, adminToken);
    console.log(`Deactivate club status: ${resDeactivate.status}, new status: ${resDeactivate.data.data.status}`);

    // Verify student no longer sees the deactivated club
    const resKietAfterDeactivate = await request('GET', '/api/clubs', null, kietToken);
    console.log(`KIET student sees ${resKietAfterDeactivate.data.count} clubs after deactivation (expected 4)`);
    if (resKietAfterDeactivate.data.count !== 4) throw new Error('Deactivated club still visible to student');

    // Admin reactivates the club
    const resActivate = await request('PUT', `/api/clubs/${createdClub._id}/activate`, null, adminToken);
    console.log(`Reactivate club status: ${resActivate.status}, new status: ${resActivate.data.data.status}`);

    // Verify student sees it again
    const resKietAfterActivate = await request('GET', '/api/clubs', null, kietToken);
    console.log(`KIET student sees ${resKietAfterActivate.data.count} clubs after reactivation (expected 5)`);
    if (resKietAfterActivate.data.count !== 5) throw new Error('Reactivated club not visible to student');

    // Admin deletes the club
    const resDelete = await request('DELETE', `/api/clubs/${createdClub._id}`, null, adminToken);
    console.log(`Delete club status: ${resDelete.status}`);

    // Verify club is deleted
    const resKietAfterDelete = await request('GET', '/api/clubs', null, kietToken);
    console.log(`KIET student sees ${resKietAfterDelete.data.count} clubs after deletion (expected 4)`);
    if (resKietAfterDelete.data.count !== 4) throw new Error('Deleted club still returned');

    console.log('\n--- 7. Verify RBAC Security on Club Management ---');
    // Student attempts to create club
    const resStudentCreate = await request('POST', '/api/clubs', {
      name: 'Hacker Club',
      college: 'KIET',
    }, kietToken);
    console.log(`Student create attempt status: ${resStudentCreate.status} (expected 403)`);
    if (resStudentCreate.status !== 403) throw new Error('Student was able to create a club!');

    // Student attempts to delete club
    const resStudentDelete = await request('DELETE', '/api/clubs/club_1', null, kietToken);
    console.log(`Student delete attempt status: ${resStudentDelete.status} (expected 403)`);
    if (resStudentDelete.status !== 403) throw new Error('Student was able to delete a club!');

    console.log('\n=========================================');
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('=========================================\n');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  if (server) server.close();
  process.exit(1);
});
