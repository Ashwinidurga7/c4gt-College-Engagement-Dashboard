import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import { students } from '../../frontend/src/data/academicData.js';
import { institutionalFaculty, institutionalHods, campusWorkers, transportDrivers } from '../../frontend/src/data/adminData.js';

async function seedCohort() {
  console.log('Connecting to Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected! Seeding complete cohort into Atlas...');

  const db = mongoose.connection.db;

  // 1. Seed complete students cohort
  console.log(`Seeding ${students.length} students...`);
  for (const s of students) {
    const doc = {
      _id: s.id || `stu_${s.rollNumber.toLowerCase()}`,
      rollNumber: s.rollNumber,
      name: s.name,
      email: s.email,
      campus: s.campus,
      college: s.college,
      branch: s.branch,
      branchName: s.branchName,
      department: { name: s.branchName, code: s.branch },
      year: s.year,
      semester: s.semester,
      section: s.section,
      residence: s.residence,
      hostelBlock: s.hostelBlock,
      busRoute: s.busRoute,
      boardingPoint: s.boardingPoint,
      teamId: s.teamId,
      teamRole: s.teamRole,
      attendance: s.attendance,
      monthlyAttendance: s.monthlyAttendance,
      fees: s.fees,
      transport: s.transport,
      results: s.results,
      cgpa: Number(s.cgpa) || 8.0,
      activeBacklogs: s.activeBacklogs || 0,
      backlogStatus: s.backlogStatus,
      driveEligible: s.driveEligible,
      internship: s.internship,
      clubs: s.clubs,
      toastmastersMember: Boolean(s.toastmastersMember),
      roboticsMember: Boolean(s.roboticsMember),
      smartCityMember: Boolean(s.smartCityMember),
      kiotAttended: Boolean(s.kiotAttended),
      hackathonAttended: Boolean(s.hackathonAttended),
      hubMember: Boolean(s.hubMember),
      user: {
        _id: `user_${s.rollNumber.toLowerCase()}`,
        name: s.name,
        email: s.email,
        rollNumber: s.rollNumber,
      },
    };

    const { _id, ...restDoc } = doc;
    await db.collection('students').updateOne(
      { rollNumber: s.rollNumber },
      { $set: restDoc, $setOnInsert: { _id } },
      { upsert: true }
    );
  }
  console.log(`✅ All ${students.length} students seeded into Atlas 'students' collection!`);

  // 2. Seed faculty
  console.log(`Seeding ${institutionalFaculty.length} faculty...`);
  for (const f of institutionalFaculty) {
    const facId = `fac_${f.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await db.collection('faculties').updateOne(
      { name: f.name, department: f.department },
      {
        $set: {
          name: f.name,
          designation: f.designation,
          department: { name: f.department, code: f.department },
          campus: f.campus,
          qualification: f.qualification,
          experience: f.experience,
          phone: f.phone,
          email: f.email,
          user: {
            name: f.name,
            email: f.email,
          },
        },
        $setOnInsert: { _id: facId },
      },
      { upsert: true }
    );
  }
  console.log(`✅ All ${institutionalFaculty.length} faculty seeded into Atlas!`);

  // 3. Seed HODs
  console.log(`Seeding ${institutionalHods.length} HODs...`);
  for (const h of institutionalHods) {
    const hodId = `hod_${h.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await db.collection('hods').updateOne(
      { name: h.name, campus: h.campus },
      {
        $set: {
          name: h.name,
          designation: h.designation,
          department: { name: h.department, code: h.department },
          campus: h.campus,
          experience: h.experience,
          qualification: h.qualification,
          cabin: h.cabin,
          phone: h.phone,
          email: h.email,
          user: {
            name: h.name,
            email: h.email,
          },
        },
        $setOnInsert: { _id: hodId },
      },
      { upsert: true }
    );
  }
  console.log(`✅ All ${institutionalHods.length} HODs seeded into Atlas!`);

  // 4. Seed Drivers into transports
  console.log(`Seeding ${transportDrivers.length} transport drivers...`);
  for (const d of transportDrivers) {
    const busId = `bus_${d.busNumber.replace(/[^a-zA-Z0-9]/g, '_')}`;
    await db.collection('transports').updateOne(
      { busNumber: d.busNumber },
      {
        $set: {
          busNumber: d.busNumber,
          driverName: d.driverName,
          driverPhone: d.phone,
          phone: d.phone,
          license: d.license,
          route: d.route,
          destination: d.destination,
          campus: d.campus,
          capacity: d.capacity,
          allocatedStudents: d.allocatedStudents || Math.floor(d.capacity * 0.9),
          status: d.status,
          isFleetRoute: true,
        },
        $setOnInsert: { _id: busId },
      },
      { upsert: true }
    );
  }
  console.log(`✅ All ${transportDrivers.length} fleet routes seeded into Atlas!`);

  // 5. Seed Workers
  console.log(`Seeding ${campusWorkers.length} campus workers...`);
  for (const w of campusWorkers) {
    const wkId = `wk_${w.empId.replace(/[^a-zA-Z0-9]/g, '_')}`;
    await db.collection('workers').updateOne(
      { empId: w.empId },
      {
        $set: { ...w },
        $setOnInsert: { _id: wkId },
      },
      { upsert: true }
    );
  }
  console.log(`✅ All ${campusWorkers.length} campus workers seeded into Atlas!`);

  console.log('COMPLETE MULTI-CAMPUS INSTITUTIONAL DATABASE SEEDED INTO MONGODB ATLAS!');
  process.exit(0);
}

seedCohort().catch(err => {
  console.error('Cohort seeding error:', err);
  process.exit(1);
});
