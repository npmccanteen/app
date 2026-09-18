/* =====================================================
   DocTools - PDF to Audio (Text-to-Speech)
   by Munaf Wasif
   ===================================================== */

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ---------- DOM ----------
const dropZone = document.getElementById('dropZone');
const input = document.getElementById('pdfInput');
const progressWrap = document.getElementById('progressWrap');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const paPlayer = document.getElementById('paPlayer');
const paFileName = document.getElementById('paFileName');
const paFileMeta = document.getElementById('paFileMeta');
const paVoice = document.getElementById('paVoice');
const paSpeed = document.getElementById('paSpeed');
const paSpeedVal = document.getElementById('paSpeedVal');
const paPitch = document.getElementById('paPitch');
const paPitchVal = document.getElementById('paPitchVal');
const paPlayPause = document.getElementById('paPlayPause');
const paStop = document.getElementById('paStop');
const paPrev = document.getElementById('paPrev');
const paNext = document.getElementById('paNext');
const paRestart = document.getElementById('paRestart');
const paNowPlaying = document.getElementById('paNowPlaying');
const paTextarea = document.getElementById('paTextarea');
const paApplyEdit = document.getElementById('paApplyEdit');

// ---------- State ----------
let fullText = '';
let sentences = [];
let currentIndex = 0;
let isPlaying = false;
let isPaused = false;
let voices = [];
let selectedVoice = null;

// ================= VOICE LOADING =================
function loadVoices() {
  voices = speechSynthesis.getVoices();
  if (!voices.length) return;

  paVoice.innerHTML = voices.map((v, i) =>
    `<option value="${i}">${v.name} (${v.lang})</option>`
  ).join('');

  // Prefer Bangla, then English (India/US/UK)
  const bn = voices.findIndex(v => v.lang.startsWith('bn'));
  const en = voices.findIndex(v => v.lang.startsWith('en-IN'))
    || voices.findIndex(v => v.lang.startsWith('en'))
    || 0;
  const pick = bn !== -1 ? bn : en;
  paVoice.selectedIndex = pick;
  selectedVoice = voices[pick];
}

speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

paVoice.onchange = () => {
  selectedVoice = voices[parseInt(paVoice.value)];
};

// ================= FILE HANDLING =================
input.addEventListener('change', (e) => handleFile(e.target.files[0]));
dropZone.addEventListener('click', () => input.click());
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFile(e.dataTransfer.files[0]);
});

async function handleFile(file) {
  if (!file || file.type !== 'application/pdf') return alert('শুধু PDF ফাইল দিন');
  stopSpeech();
  progressWrap.classList.add('show');
  progressFill.style.width = '0%';
  progressText.textContent = 'PDF পড়া হচ্ছে...';
  paPlayer.style.display = 'none';

  try {
    const bytes = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const total = pdf.numPages;
    let text = '';

    for (let i = 1; i <= total; i++) {
      progressText.textContent = `পেজ ${i}/${total} থেকে টেক্সট বের হচ্ছে...`;
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(it => it.str).join(' ');
      text += pageText + '\n\n';
      progressFill.style.width = `${(i / total) * 100}%`;
    }

    fullText = cleanText(text);
    if (!fullText.trim()) {
      throw new Error('এই PDF এ কোনো টেক্সট নেই (সম্ভবত scanned image)');
    }

    sentences = splitIntoSentences(fullText);
    currentIndex = 0;

    paFileName.textContent = '📄 ' + file.name;
    paFileMeta.textContent = `পেজ: ${total} • শব্দ: ${countWords(fullText)} • বাক্য: ${sentences.length}`;
    paTextarea.value = fullText;

    paPlayer.style.display = 'block';
    updateNowPlaying();
    progressWrap.classList.remove('show');
    paPlayer.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    alert('❌ ' + err.message);
    progressWrap.classList.remove('show');
  }
}

function cleanText(t) {
  return t
    .replace(/\s+/g, ' ')
    .replace(/([.!?।])\s*/g, '$1\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function countWords(t) {
  return t.trim().split(/\s+/).filter(Boolean).length;
}

function splitIntoSentences(text) {
  // Split by sentence terminators (Bangla + English)
  const parts = text
    .split(/(?<=[.!?।])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Merge short fragments (under 30 chars) with next sentence
  const merged = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length < 30 && i < parts.length - 1) {
      merged.push(parts[i] + ' ' + parts[i + 1]);
      i++;
    } else {
      merged.push(parts[i]);
    }
  }
  return merged;
}

// ================= SPEECH =================
function speakCurrent() {
  if (!sentences.length) return;
  speechSynthesis.cancel();

  const text = sentences[currentIndex];
  const utter = new SpeechSynthesisUtterance(text);
  if (selectedVoice) utter.voice = selectedVoice;
  utter.rate = parseFloat(paSpeed.value);
  utter.pitch = parseFloat(paPitch.value);
  utter.volume = 1;

  utter.onend = () => {
    if (!isPlaying) return;
    if (currentIndex < sentences.length - 1) {
      currentIndex++;
      updateNowPlaying();
      speakCurrent();
    } else {
      // Finished
      isPlaying = false;
      isPaused = false;
      updatePlayButton();
      paNowPlaying.textContent = '✅ শেষ হয়েছে';
    }
  };

  utter.onerror = (e) => {
    if (e.error === 'interrupted' || e.error === 'canceled') return;
    console.warn('TTS error:', e.error);
  };

  speechSynthesis.speak(utter);
}

function pauseSpeech() {
  if (isPlaying && !isPaused) {
    speechSynthesis.pause();
    isPaused = true;
  }
}

function resumeSpeech() {
  if (isPlaying && isPaused) {
    speechSynthesis.resume();
    isPaused = false;
  }
}

function stopSpeech() {
  isPlaying = false;
  isPaused = false;
  speechSynthesis.cancel();
  updatePlayButton();
}

function updatePlayButton() {
  if (isPlaying && !isPaused) {
    paPlayPause.textContent = '⏸️';
  } else {
    paPlayPause.textContent = '▶️';
  }
}

function updateNowPlaying() {
  if (!sentences.length) return;
  paNowPlaying.textContent = sentences[currentIndex] || '—';
}

// ================= CONTROLS =================
paPlayPause.onclick = () => {
  if (!sentences.length) return;

  if (!isPlaying) {
    // Start from current
    isPlaying = true;
    isPaused = false;
    speakCurrent();
    updatePlayButton();
  } else if (isPaused) {
    resumeSpeech();
    updatePlayButton();
  } else {
    pauseSpeech();
    updatePlayButton();
  }
};

paStop.onclick = () => {
  stopSpeech();
};

paRestart.onclick = () => {
  stopSpeech();
  currentIndex = 0;
  updateNowPlaying();
  isPlaying = true;
  isPaused = false;
  speakCurrent();
  updatePlayButton();
};

paPrev.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateNowPlaying();
    if (isPlaying) {
      speechSynthesis.cancel();
      isPaused = false;
      speakCurrent();
    }
  }
};

paNext.onclick = () => {
  if (currentIndex < sentences.length - 1) {
    currentIndex++;
    updateNowPlaying();
    if (isPlaying) {
      speechSynthesis.cancel();
      isPaused = false;
      speakCurrent();
    }
  }
};

paSpeed.oninput = () => {
  paSpeedVal.textContent = parseFloat(paSpeed.value).toFixed(1) + 'x';
  if (isPlaying) {
    // Restart current sentence with new speed
    speechSynthesis.cancel();
    isPaused = false;
    speakCurrent();
  }
};

paPitch.oninput = () => {
  paPitchVal.textContent = parseFloat(paPitch.value).toFixed(1);
  if (isPlaying) {
    speechSynthesis.cancel();
    isPaused = false;
    speakCurrent();
  }
};

// ================= TEXT EDIT =================
paApplyEdit.onclick = () => {
  const newText = paTextarea.value.trim();
  if (!newText) return;
  stopSpeech();
  fullText = cleanText(newText);
  sentences = splitIntoSentences(fullText);
  currentIndex = 0;
  paFileMeta.textContent = `শব্দ: ${countWords(fullText)} • বাক্য: ${sentences.length}`;
  updateNowPlaying();
  alert('✅ টেক্সট আপডেট হয়েছে');
};

// ================= CLEANUP =================
window.addEventListener('beforeunload', () => {
  speechSynthesis.cancel();
});
