// Realtime Server-Sent Events (SSE) Manager
const clients = new Set();

/**
 * Broadcast an event payload to all connected SSE clients
 * @param {Object} data 
 */
function broadcastRealtimeEvent(data) {
  const eventPayload = {
    id: data.id || `evt_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    title: data.title || 'Campus Event',
    category: data.category || 'General',
    user: data.user || 'System',
    time: data.time || new Date().toISOString(),
    ...data,
  };

  const formatted = `data: ${JSON.stringify(eventPayload)}\n\n`;

  for (const client of clients) {
    try {
      client.write(formatted);
    } catch (err) {
      clients.delete(client);
    }
  }

  return eventPayload;
}

/**
 * Add a new SSE client response stream
 * @param {Object} req 
 * @param {Object} res 
 */
function addSseClient(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.write('\n');

  clients.add(res);

  // Send initial connected confirmation
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Connected to KIET Realtime Stream', timestamp: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    clients.delete(res);
  });
}

/**
 * Get active connection count
 */
function getClientCount() {
  return clients.size;
}

// Background activity generator for continuous live campus activity feed
const sampleActions = [
  { category: 'C4GT Hub', user: 'G. Sai Vamsi', action: 'submitted PR for Open Governance portal' },
  { category: 'GCC', user: 'Alice Johnson', action: 'solved Hard Dynamic Programming challenge' },
  { category: 'Toastmasters', user: 'K. Priya', action: 'delivered Prepared Speech at KIET Chapter' },
  { category: 'Internships', user: 'M. Rahul', action: 'secured Summer Internship at Tech Mahindra' },
  { category: 'Certifications', user: 'D. Suresh', action: 'verified AWS Cloud Practitioner badge' },
  { category: 'KIET Robotics', user: 'B. Varun', action: 'calibrated autonomous rover obstacle sensors' },
  { category: 'Attendance', user: 'System', action: 'updated morning lecture attendance for Section 3-A' },
  { category: 'Sports', user: 'Cricket Club', action: 'announced KPL 2026 Quarter-Final fixtures' },
];

let backgroundInterval = null;
function startBackgroundFeed(intervalMs = 12000) {
  if (backgroundInterval) return;
  backgroundInterval = setInterval(() => {
    if (clients.size > 0) {
      const sample = sampleActions[Math.floor(Math.random() * sampleActions.length)];
      broadcastRealtimeEvent({
        category: sample.category,
        title: `${sample.category} — ${sample.action}`,
        user: sample.user,
        time: new Date().toISOString(),
      });
    }
  }, intervalMs);
}

// Start immediately
startBackgroundFeed();

module.exports = {
  broadcastRealtimeEvent,
  addSseClient,
  getClientCount,
  startBackgroundFeed,
};
