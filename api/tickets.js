// api/tickets.js — Simple ticket API (localStorage is client-side, this is for any server-side needs)

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // Return sample tickets for initial dashboard load
    const sampleTickets = [
      {
        id: 1040,
        category: 'housekeeping',
        flat_number: 'C-301',
        priority: 'normal',
        summary_en: 'Common area cleaning needed',
        summary_local: 'பொது பகுதி சுத்தம்',
        assigned_to: 'Lakshmi',
        eta: '4 hours',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'resolved',
        language: 'ta-IN'
      },
      {
        id: 1041,
        category: 'electrical',
        flat_number: 'A-105',
        priority: 'normal',
        summary_en: 'Corridor light not working',
        summary_local: 'गलियारे की लाइट',
        assigned_to: 'Suresh',
        eta: '2 hours',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'open',
        language: 'hi-IN'
      },
      {
        id: 1042,
        category: 'plumbing',
        flat_number: 'B-204',
        priority: 'urgent',
        summary_en: 'Bathroom pipe leaking',
        summary_local: 'ಬಾತ್ರೂಮ್ ಪೈಪ್ ಲೀಕ್',
        assigned_to: 'Ramesh',
        eta: '30 minutes',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        status: 'open',
        language: 'kn-IN'
      }
    ];

    return res.status(200).json({ tickets: sampleTickets });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
