/* =====================================================
   DocTools - Study Timer (Countdown + Pomodoro)
   by Munaf Wasif
   ===================================================== */

// ==================== TAB SWITCHER ====================
const tabs = document.querySelectorAll('.st-tab');
const panels = document.querySelectorAll('.st-panel');

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  };
});

// ==================== COUNTDOWN ====================
const CD_KEY = 'doctools_countdowns';
const cdName = document.getElementById('cdName');
const cdDate = document.getElementById('cdDate');
const cdAddBtn = document.getElementById('cdAddBtn');
const cdList = document.getElementById('cdList');
const cdEmpty = document.getElementById('cdEmpty');

let countdowns = JSON.parse(localStorage.getItem(CD_KEY) || '[]');

function saveCountdowns() {
  localStorage.setItem(CD_KEY, JSON.stringify(countdowns));
}

function formatDate(iso) {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} • ${hh}:${mm}`;
}

function renderCountdowns() {
  if (!countdowns.length) {
    cdList.innerHTML = '';
    cdEmpty.style.display = 'block';
    return;
  }
  cdEmpty.style.display = 'none';

  // Sort by nearest first
  countdowns.sort((a, b) => new Date(a.date) - new Date(b.date));

  cdList.innerHTML = countdowns.map((cd, i) => {
    const now = Date.now();
    const target = new Date(cd.date).getTime();
    const diff = target - now;
    const past = diff <= 0;

    let days = 0, hrs = 0, min = 0, sec = 0;
    if (!past) {
      days = Math.floor(diff / (1000 * 60 * 60 * 24));
      hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      sec = Math.floor((diff % (1000 * 60)) / 1000);
    }

    return `
      <div class="cd-card ${past ? 'past' : ''}" data-index="${i}">
        <button class="cd-delete" data-del="${i}">✕</button>
        <div class="cd-name">${cd.name}</div>
        <div class="cd-date">📅 ${formatDate(cd.date)}</div>
        ${past
          ? `<div class="cd-days">✓</div><div class="cd-days-label">সম্পন্ন</div>`
          : `<div class="cd-days">${days}</div>
             <div class="cd-days-label">দিন বাকি</div>
             <div class="cd-timer">
               <div>${String(hrs).padStart(2,'0')}h</div>
               <div>${String(min).padStart(2,'0')}m</div>
               <div>${String(sec).padStart(2,'0')}s</div>
             </div>`
        }
      </div>
    `;
  }).join('');

  // Attach delete
  cdList.querySelectorAll('[data-del]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const i = parseInt(btn.dataset.del);
      countdowns.splice(i, 1);
      saveCountdowns();
      renderCountdowns();
    };
  });
}

cdAddBtn.onclick = () => {
  const name = cdName.value.trim();
  const date = cdDate.value;
  if (!name) return alert('পরীক্ষার নাম দিন');
  if (!date) return alert('তারিখ ও সময় দিন');

  countdowns.push({ name, date });
  saveCountdowns();
  cdName.value = '';
  cdDate.value = '';
  renderCountdowns();
};

// Live update every second
setInterval(() => {
  if (countdowns.length) renderCountdowns();
}, 1000);

renderCountdowns();

// ==================== POMODORO ====================
const POMO_STATS_KEY = 'doctools_pomodoro_stats';

const MODES = {
  focus: { label: 'Focus', minutes: 25, color: '#0d6efd' },
  short: { label: 'Short Break', minutes: 5, color: '#16a34a' },
  long: { label: 'Long Break', minutes: 15, color: '#8b5cf6' },
};

const pomoTime = document.getElementById('pomoTime');
const pomoProgress = document.getElementById('pomoProgress');
const pomoStart = document.getElementById('pomoStart');
const pomoReset = document.getElementById('pomoReset');
const pomoModes = document.querySelectorAll('.pomo-mode');
const pomoSessions = document.getElementById('pomoSessions');
const pomoTotal = document.getElementById('pomoTotal');

let currentMode = 'focus';
let remainingSec = MODES.focus.minutes * 60;
let totalSec = remainingSec;
let timerInterval = null;
let isRunning = false;

let stats = JSON.parse(localStorage.getItem(POMO_STATS_KEY) || '{"sessions":0,"minutes":0,"date":""}');

function checkResetStats() {
  const today = new Date().toDateString();
  if (stats.date !== today) {
    stats = { sessions: 0, minutes: 0, date: today };
    localStorage.setItem(POMO_STATS_KEY, JSON.stringify(stats));
  }
}

function renderStats() {
  checkResetStats();
  pomoSessions.textContent = stats.sessions;
  pomoTotal.textContent = stats.minutes;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateCircle() {
  const circumference = 2 * Math.PI * 108; // 678.58
  const progress = remainingSec / totalSec;
  const offset = circumference * (1 - progress);
  pomoProgress.style.strokeDashoffset = offset;
  pomoProgress.style.stroke = MODES[currentMode].color;
}

function updateTime() {
  pomoTime.textContent = formatTime(remainingSec);
  updateCircle();
  document.title = isRunning
    ? `${formatTime(remainingSec)} • DocTools`
    : 'Study Timer - DocTools';
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {}
}

function tick() {
  if (remainingSec <= 0) {
    clearInterval(timerInterval);
    isRunning = false;
    pomoStart.textContent = '▶️ শুরু';
    playBeep();

    // Count stats only on focus complete
    if (currentMode === 'focus') {
      checkResetStats();
      stats.sessions += 1;
      stats.minutes += MODES.focus.minutes;
      localStorage.setItem(POMO_STATS_KEY, JSON.stringify(stats));
      renderStats();
    }

    // Notification
    if (Notification.permission === 'granted') {
      new Notification('DocTools 🍅', {
        body: currentMode === 'focus'
          ? 'Focus session শেষ! Break নিন।'
          : 'Break শেষ! আবার পড়তে বসুন।',
        icon: '../icons/icon-192.png',
      });
    }
    return;
  }
  remainingSec--;
  updateTime();
}

function startTimer() {
  if (isRunning) {
    // Pause
    clearInterval(timerInterval);
    isRunning = false;
    pomoStart.textContent = '▶️ চালু';
    document.title = 'Study Timer - DocTools';
  } else {
    // Start
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    isRunning = true;
    pomoStart.textContent = '⏸️ Pause';
    timerInterval = setInterval(tick, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  remainingSec = MODES[currentMode].minutes * 60;
  totalSec = remainingSec;
  pomoStart.textContent = '▶️ শুরু';
  updateTime();
  document.title = 'Study Timer - DocTools';
}

pomoStart.onclick = startTimer;
pomoReset.onclick = resetTimer;

pomoModes.forEach(btn => {
  btn.onclick = () => {
    pomoModes.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    resetTimer();
  };
});

// Initialize
updateTime();
renderStats();
