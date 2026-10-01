/**
 * Loads the campus content the portal ships with (clubs, events, announcements) into
 * MongoDB, from the same files the frontend uses, so there is one source for it.
 *
 *   npm run seed:campus
 *
 * Only missing records are added: anything already in the database, including edits
 * admins made through the portal, is left untouched, so it is safe to run again.
 * No student records (attendance, results, CGPA) are created here.
 */
const path = require('path');
const { pathToFileURL } = require('url');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Club = require('../models/Club');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');

const frontendData = (file) => import(pathToFileURL(path.join(__dirname, '../frontend/src/mocks', file)).href);

/** Inserts records whose _id is not in the collection yet. Returns how many were added. */
async function addMissing(Model, records) {
  if (!records.length) return 0;
  const result = await Model.bulkWrite(
    records.map((record) => ({
      updateOne: {
        filter: { _id: record._id },
        update: { $setOnInsert: record },
        upsert: true,
      },
    }))
  );
  return result.upsertedCount;
}

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Add it to .env (see .env.example).');
    process.exit(1);
  }

  const { clubsData } = await frontendData('clubsData.js');
  const { campusEvents, campusAnnouncements } = await frontendData('campusData.js');

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

  const now = new Date();
  const stamp = (record) => ({ ...record, createdAt: record.createdAt ? new Date(record.createdAt) : now });

  const results = [
    ['clubs', clubsData.length, await addMissing(Club, clubsData.map(stamp))],
    ['events', campusEvents.length, await addMissing(Event, campusEvents.map(stamp))],
    ['announcements', campusAnnouncements.length, await addMissing(Announcement, campusAnnouncements.map(stamp))],
  ];

  console.table(results.map(([collection, total, added]) => ({ collection, inSource: total, added, alreadyThere: total - added })));
}

main()
  .catch((error) => {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
