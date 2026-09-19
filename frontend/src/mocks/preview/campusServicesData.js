/** Facilities directory. Hours are 24-hour "HH:MM" strings; `days` uses 0 = Sunday. */
export const facilities = [
  { id: 'fac-library', name: 'Central Library', category: 'Academic', location: 'Block A, ground floor', opens: '08:00', closes: '21:00', days: [1, 2, 3, 4, 5, 6], contact: '0884-2345601', note: 'Digital library on the first floor; ID card required.' },
  { id: 'fac-labs', name: 'Computer Centre', category: 'Academic', location: 'Tech Block, second floor', opens: '09:00', closes: '17:00', days: [1, 2, 3, 4, 5, 6], contact: '0884-2345612', note: 'Open lab hours 4–5 pm for project work.' },
  { id: 'fac-medical', name: 'Health Centre', category: 'Health', location: 'Near main gate', opens: '08:30', closes: '18:00', days: [1, 2, 3, 4, 5, 6], contact: '0884-2345620', note: 'Duty doctor 10 am – 1 pm. Ambulance on call 24×7.' },
  { id: 'fac-canteen', name: 'Main Canteen', category: 'Food', location: 'Between Blocks B and C', opens: '07:30', closes: '19:00', days: [1, 2, 3, 4, 5, 6], contact: '0884-2345633', note: 'Lunch served 12:30 – 2:30 pm.' },
  { id: 'fac-sports', name: 'Sports Complex', category: 'Sports', location: 'KIET Ground', opens: '06:00', closes: '19:30', days: [0, 1, 2, 3, 4, 5, 6], contact: '0884-2345640', note: 'Indoor courts need a booking with the physical director.' },
  { id: 'fac-placement', name: 'Training and Placement Cell', category: 'Administration', location: 'Admin Block, first floor', opens: '09:30', closes: '17:00', days: [1, 2, 3, 4, 5], contact: '0884-2345650', note: 'Drop resume queries between 2 and 4 pm.' },
  { id: 'fac-accounts', name: 'Accounts Office', category: 'Administration', location: 'Admin Block, ground floor', opens: '10:00', closes: '16:00', days: [1, 2, 3, 4, 5, 6], contact: '0884-2345655', note: 'Fee counter closes at 3:30 pm.' },
  { id: 'fac-hostel', name: 'Girls Hostel Office', category: 'Residential', location: 'KIEW campus', opens: '08:00', closes: '20:00', days: [0, 1, 2, 3, 4, 5, 6], contact: '0884-2345670', note: 'Visitors 4–6 pm on Sundays.' },
]

/** Demo student's transport pass. */
export const busPass = {
  passId: 'KIET-BP-2026-0534',
  holder: 'B. Ashwini Durga',
  rollNumber: '24JN1A0534',
  route: 'Route 7',
  routeName: 'Kakinada Town – KIET Campus',
  boardingPoint: 'Gandhi Nagar',
  pickupTime: '07:40',
  busNumber: 'AP 05 TB 4471',
  driver: 'K. Raju',
  driverPhone: '9848022110',
  validFrom: '2026-07-01',
  validTo: '2026-12-31',
  feeStatus: 'paid',
  stops: [
    { name: 'Kakinada Bus Stand', time: '07:25' },
    { name: 'Gandhi Nagar', time: '07:40' },
    { name: 'Sarpavaram Junction', time: '07:55' },
    { name: 'Korangi', time: '08:15' },
    { name: 'KIET Campus', time: '08:40' },
  ],
}
