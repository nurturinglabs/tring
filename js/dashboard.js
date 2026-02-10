// dashboard.js — Live ticket display

const dashboardTickets = document.getElementById('dashboard-tickets');
const dashboardStats = document.getElementById('dashboard-stats');
const dashboardFilters = document.getElementById('dashboard-filters');

let currentFilter = 'all';
let lastTicketCount = 0;

// Language names for display
const langDisplay = {
  'hi-IN': 'हिन्दी', 'kn-IN': 'ಕನ್ನಡ', 'ta-IN': 'தமிழ்',
  'te-IN': 'తెలుగు', 'ml-IN': 'മലയാളം', 'bn-IN': 'বাংলা',
  'mr-IN': 'मराठी', 'gu-IN': 'ગુજરાતી', 'od-IN': 'ଓଡ଼ିଆ', 'pa-IN': 'ਪੰਜਾਬੀ',
  'en-IN': 'English'
};

// Pre-seeded sample tickets
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

// Initialize
function initDashboard() {
  // Seed localStorage if empty
  if (!localStorage.getItem('tring_tickets')) {
    localStorage.setItem('tring_tickets', JSON.stringify([]));
  }
  lastTicketCount = getTickets().length;
  renderDashboard();

  // Poll for new tickets every 2 seconds
  setInterval(pollForUpdates, 2000);
}

function getTickets() {
  const stored = JSON.parse(localStorage.getItem('tring_tickets') || '[]');
  return [...sampleTickets, ...stored];
}

function pollForUpdates() {
  const tickets = getTickets();
  if (tickets.length !== lastTicketCount) {
    lastTicketCount = tickets.length;
    renderDashboard(true);
  }
}

function renderDashboard(hasNew) {
  const allTickets = getTickets();

  // Update stats
  const openCount = allTickets.filter(t => t.status === 'open').length;
  const urgentCount = allTickets.filter(t => t.priority === 'urgent').length;
  const resolvedCount = allTickets.filter(t => t.status === 'resolved').length;

  dashboardStats.innerHTML = `
    <span class="stat open">${openCount} Open</span>
    <span class="stat urgent">${urgentCount} Urgent</span>
    <span class="stat resolved">${resolvedCount} Resolved</span>
  `;

  // Filter tickets
  let filtered = allTickets;
  if (currentFilter === 'urgent') {
    filtered = allTickets.filter(t => t.priority === 'urgent');
  } else if (currentFilter !== 'all') {
    filtered = allTickets.filter(t => t.category === currentFilter);
  }

  // Sort: newest first
  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Render
  dashboardTickets.innerHTML = '';
  filtered.forEach((ticket, idx) => {
    const isNew = hasNew && idx === 0 && ticket.id > 1042;
    const card = createTicketCard(ticket, isNew);
    dashboardTickets.appendChild(card);
  });

  if (filtered.length === 0) {
    dashboardTickets.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted);">No tickets match this filter.</div>';
  }
}

function createTicketCard(ticket, isNew) {
  const card = document.createElement('div');
  const priorityClass = ticket.priority === 'urgent' ? 'urgent' : '';
  const resolvedClass = ticket.status === 'resolved' ? 'resolved' : '';
  const newClass = isNew ? 'new-ticket' : '';
  card.className = `ticket-card ${priorityClass} ${resolvedClass} ${newClass}`.trim();

  const timeAgo = getTimeAgo(ticket.timestamp);

  card.innerHTML = `
    <div class="ticket-header">
      <div>
        <span class="ticket-priority ${ticket.priority}">${ticket.priority === 'urgent' ? '🔴 URGENT' : '🟡 NORMAL'}</span>
        <span class="ticket-id">#${ticket.id}</span>
        <span class="ticket-category">${capitalize(ticket.category)}</span>
      </div>
      <span class="ticket-time">${timeAgo}</span>
    </div>
    <div class="ticket-body">
      ${ticket.flat_number} · ${ticket.summary_local || ticket.summary_en} · Assigned: ${ticket.assigned_to}
    </div>
    <div class="ticket-meta">
      <span>Lang: ${langDisplay[ticket.language] || ticket.language} · ETA: ${ticket.eta}</span>
      <span class="ticket-status">
        <span class="ticket-status-dot ${ticket.status}"></span>
        ${capitalize(ticket.status)}
      </span>
    </div>
  `;
  return card;
}

function getTimeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day ago`;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Filter buttons
dashboardFilters.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    dashboardFilters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderDashboard();
  }
});

// Initialize on load
initDashboard();
