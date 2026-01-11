
// ─────────────── Time-alive counter ───────────────
const birthDate = new Date(2011, 5, 8, 21, 8, 0); // 8 June 2011, 9:08 PM

function updateLifeCounter() {
  const now = new Date();

  let diff = now - birthDate;
  let totalSeconds = Math.floor(diff / 1000);

  const years = Math.floor(totalSeconds / (365.25 * 24 * 60 * 60));
  totalSeconds -= Math.floor(years * 365.25 * 24 * 60 * 60);

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  totalSeconds -= days * 24 * 60 * 60;

  const hours = Math.floor(totalSeconds / (60 * 60));
  totalSeconds -= hours * 60 * 60;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  document.getElementById('lifeYears').textContent = years.toString().padStart(2, '0');
  document.getElementById('lifeDays').textContent = days.toString().padStart(2, '0');
  document.getElementById('lifeHours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('lifeMinutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('lifeSeconds').textContent = seconds.toString().padStart(2, '0');
}

updateLifeCounter();
setInterval(updateLifeCounter, 1000);


// ─────────────── Ignore Tracker ───────────────
let ignoreData = null;

// Format seconds to readable time
function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${hours}h`;
}

// Format stopwatch display (HH:MM:SS)
function formatStopwatch(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format date for history
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Calculate current ignore duration
function getCurrentIgnoreDuration(startTime) {
  if (!startTime) return 0;
  const start = new Date(startTime);
  const now = new Date();
  return Math.floor((now - start) / 1000);
}

// Create friend card HTML
function createFriendCard(friend) {
  const isIgnoring = friend.isIgnoring;
  const currentDuration = isIgnoring ? getCurrentIgnoreDuration(friend.currentIgnoreStart) : 0;
  const totalTime = friend.totalIgnoreSeconds + currentDuration;
  
  const historyHTML = friend.ignoreHistory.map(h => `
    <div class="history-item">
      <div class="history-date">${formatDate(h.start)} - ${formatDate(h.end)}</div>
      <div class="history-reason">"${h.reason}"</div>
    </div>
  `).join('');

  return `
    <div class="friend-ignore-card ${isIgnoring ? 'ignoring' : ''}" data-friend-id="${friend.id}">
      <div class="friend-header">
        <div class="friend-avatar">${friend.avatar}</div>
        <div class="friend-info">
          <h4>${friend.name}${friend.subtitle ? ` <span style="font-size:0.75rem;color:var(--text-muted);font-weight:normal;">(${friend.subtitle})</span>` : ''}</h4>
          <span class="friend-status ${isIgnoring ? 'ignoring' : 'not-ignoring'}">
            <span class="status-dot ${isIgnoring ? 'ignoring' : 'not-ignoring'}"></span>
            ${isIgnoring ? 'Ignoring Me' : 'Not Ignoring'}
          </span>
        </div>
      </div>
      
      ${isIgnoring ? `
        <div class="current-ignore-timer">
          <div class="timer-label">Current Ignore Time</div>
          <div class="timer-display" data-start="${friend.currentIgnoreStart}">${formatStopwatch(currentDuration)}</div>
        </div>
      ` : ''}
      
      <div class="friend-stats-row">
        <div class="friend-stat">
          <div class="value">${formatTime(totalTime)}</div>
          <div class="label">Total Time</div>
        </div>
        <div class="friend-stat">
          <div class="value">${friend.ignoreStreak}</div>
          <div class="label">Streak</div>
        </div>
        <div class="friend-stat">
          <div class="value">${formatTime(friend.longestIgnore)}</div>
          <div class="label">Longest</div>
        </div>
      </div>
      
      ${friend.ignoreHistory.length > 0 ? `
        <button class="ignore-history-toggle" onclick="toggleHistory(${friend.id})">
          📜 View History (${friend.ignoreHistory.length})
        </button>
        <div class="ignore-history" id="history-${friend.id}">
          ${historyHTML}
        </div>
      ` : ''}
    </div>
  `;
}

// Toggle history visibility
function toggleHistory(friendId) {
  const historyEl = document.getElementById(`history-${friendId}`);
  if (historyEl) {
    historyEl.classList.toggle('show');
  }
}

// Update overview stats
function updateOverviewStats() {
  if (!ignoreData) return;
  
  document.getElementById('totalFriends').textContent = ignoreData.stats.totalFriends;
  document.getElementById('currentlyIgnoring').textContent = ignoreData.stats.currentlyIgnoring;
  document.getElementById('totalIgnoreTime').textContent = formatTime(ignoreData.stats.totalIgnoreTime);
}

// Update all running stopwatches
function updateStopwatches() {
  const timers = document.querySelectorAll('.timer-display[data-start]');
  timers.forEach(timer => {
    const startTime = timer.getAttribute('data-start');
    const duration = getCurrentIgnoreDuration(startTime);
    timer.textContent = formatStopwatch(duration);
  });
}

// Load and render ignore data
async function loadIgnoreTracker() {
  try {
    const response = await fetch('ignore-data.json');
    ignoreData = await response.json();
    
    const grid = document.getElementById('ignoreFriendsGrid');
    if (grid) {
      grid.innerHTML = ignoreData.friends.map(createFriendCard).join('');
    }
    
    updateOverviewStats();
    
    // Update stopwatches every second
    setInterval(updateStopwatches, 1000);
    
  } catch (error) {
    console.error('Failed to load ignore tracker data:', error);
    const grid = document.getElementById('ignoreFriendsGrid');
    if (grid) {
      grid.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Unable to load ignore data 😢</p>';
    }
  }
}

// Initialize ignore tracker
loadIgnoreTracker();
