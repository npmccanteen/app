/* =====================================================
   DocTools - Flashcards
   by Munaf Wasif
   ===================================================== */

const FC_KEY = 'doctools_flashcards';

// ---------- State ----------
let decks = JSON.parse(localStorage.getItem(FC_KEY) || '[]');
let currentDeckId = null;
let studyQueue = [];
let studyIndex = 0;

// ---------- DOM ----------
const fcHome = document.getElementById('fcHome');
const fcDeckView = document.getElementById('fcDeckView');
const fcStudyView = document.getElementById('fcStudyView');
const fcDecks = document.getElementById('fcDecks');
const fcEmpty = document.getElementById('fcEmpty');
const fcDeckName = document.getElementById('fcDeckName');
const fcDeckCount = document.getElementById('fcDeckCount');
const fcCards = document.getElementById('fcCards');
const fcCardsEmpty = document.getElementById('fcCardsEmpty');
const modal = document.getElementById('fcModal');
const modalBody = document.getElementById('fcModalBody');
const modalClose = document.getElementById('fcModalClose');

// Buttons
const fcNewSet = document.getElementById('fcNewSet');
const fcImport = document.getElementById('fcImport');
const fcExport = document.getElementById('fcExport');
const fcBack = document.getElementById('fcBack');
const fcStudy = document.getElementById('fcStudy');
const fcAddCard = document.getElementById('fcAddCard');
const fcDeleteDeck = document.getElementById('fcDeleteDeck');

// Study mode elements
const fcStudyBack = document.getElementById('fcStudyBack');
const fcQuestion = document.getElementById('fcQuestion');
const fcAnswer = document.getElementById('fcAnswer');
const fcCardStudy = document.getElementById('fcCardStudy');
const fcProgressText = document.getElementById('fcProgressText');
const fcProgressFill = document.getElementById('fcProgressFill');
const fcPrev = document.getElementById('fcPrev');
const fcNext = document.getElementById('fcNext');
const fcShuffle = document.getElementById('fcShuffle');

// ---------- Save ----------
function save() {
  localStorage.setItem(FC_KEY, JSON.stringify(decks));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ---------- Home view ----------
function renderDecks() {
  if (!decks.length) {
    fcDecks.innerHTML = '';
    fcEmpty.style.display = 'block';
    return;
  }
  fcEmpty.style.display = 'none';

  fcDecks.innerHTML = decks.map(d => `
    <div class="fc-deck" data-id="${d.id}">
      <h3>📚 ${escapeHtml(d.name)}</h3>
      <p>${d.cards.length} টি card</p>
      <span class="fc-deck-badge">Deck</span>
    </div>
  `).join('');

  fcDecks.querySelectorAll('.fc-deck').forEach(el => {
    el.onclick = () => openDeck(el.dataset.id);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ---------- Deck view ----------
function openDeck(id) {
  currentDeckId = id;
  const deck = decks.find(d => d.id === id);
  if (!deck) return;

  fcDeckName.textContent = '📚 ' + deck.name;
  fcDeckCount.textContent = deck.cards.length + ' টি card';

  renderCards();
  fcHome.style.display = 'none';
  fcDeckView.style.display = 'block';
  fcStudyView.style.display = 'none';
}

function renderCards() {
  const deck = decks.find(d => d.id === currentDeckId);
  if (!deck) return;

  if (!deck.cards.length) {
    fcCards.innerHTML = '';
    fcCardsEmpty.style.display = 'block';
    return;
  }
  fcCardsEmpty.style.display = 'none';

  fcCards.innerHTML = deck.cards.map((c, i) => `
    <div class="fc-card-item">
      <button class="ci-del" data-i="${i}">✕</button>
      <div class="ci-q">Q: ${escapeHtml(c.q)}</div>
      <div class="ci-a">A: ${escapeHtml(c.a)}</div>
    </div>
  `).join('');

  fcCards.querySelectorAll('.ci-del').forEach(btn => {
    btn.onclick = () => {
      const i = parseInt(btn.dataset.i);
      deck.cards.splice(i, 1);
      save();
      renderCards();
      fcDeckCount.textContent = deck.cards.length + ' টি card';
    };
  });
}

function goHome() {
  fcHome.style.display = 'block';
  fcDeckView.style.display = 'none';
  fcStudyView.style.display = 'none';
  currentDeckId = null;
  renderDecks();
}

fcBack.onclick = goHome;
fcStudyBack.onclick = () => {
  openDeck(currentDeckId);
};

// ---------- Modal helpers ----------
function openModal(html) {
  modalBody.innerHTML = html;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
modalClose.onclick = closeModal;
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// ---------- New deck ----------
fcNewSet.onclick = () => {
  openModal(`
    <h3>📚 নতুন Deck</h3>
    <form id="newDeckForm">
      <label>Deck এর নাম</label>
      <input type="text" id="deckName" placeholder="যেমন: Pharmacology - Antibiotics" required autofocus />
      <button type="submit" class="fc-modal-submit">তৈরি করুন</button>
    </form>
  `);
  setTimeout(() => document.getElementById('deckName').focus(), 100);
  document.getElementById('newDeckForm').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('deckName').value.trim();
    if (!name) return;
    decks.push({ id: uid(), name, cards: [] });
    save();
    closeModal();
    renderDecks();
  };
};

// ---------- Add card ----------
fcAddCard.onclick = () => {
  if (!currentDeckId) return;
  openModal(`
    <h3>📝 নতুন Card</h3>
    <form id="newCardForm">
      <label>প্রশ্ন (Question)</label>
      <textarea id="cardQ" placeholder="যেমন: What is the mechanism of Penicillin?" required autofocus></textarea>
      <label>উত্তর (Answer)</label>
      <textarea id="cardA" placeholder="যেমন: Inhibits cell wall synthesis (transpeptidase)" required></textarea>
      <button type="submit" class="fc-modal-submit">যোগ করুন</button>
    </form>
  `);
  setTimeout(() => document.getElementById('cardQ').focus(), 100);
  document.getElementById('newCardForm').onsubmit = (e) => {
    e.preventDefault();
    const q = document.getElementById('cardQ').value.trim();
    const a = document.getElementById('cardA').value.trim();
    if (!q || !a) return;

    const deck = decks.find(d => d.id === currentDeckId);
    deck.cards.push({ q, a });
    save();
    closeModal();
    renderCards();
    fcDeckCount.textContent = deck.cards.length + ' টি card';
  };
};

// ---------- Delete deck ----------
fcDeleteDeck.onclick = () => {
  if (!currentDeckId) return;
  const deck = decks.find(d => d.id === currentDeckId);
  if (!confirm(`"${deck.name}" deck টি মুছে ফেলবেন?`)) return;
  decks = decks.filter(d => d.id !== currentDeckId);
  save();
  goHome();
};

// ---------- Study mode ----------
fcStudy.onclick = () => {
  if (!currentDeckId) return;
  const deck = decks.find(d => d.id === currentDeckId);
  if (!deck.cards.length) return alert('আগে card যোগ করুন');

  studyQueue = deck.cards.map((_, i) => i);
  studyIndex = 0;

  fcHome.style.display = 'none';
  fcDeckView.style.display = 'none';
  fcStudyView.style.display = 'block';
  showCard();
};

function showCard() {
  const deck = decks.find(d => d.id === currentDeckId);
  if (!studyQueue.length) return;
  const card = deck.cards[studyQueue[studyIndex]];

  fcCardStudy.classList.remove('flipped');
  setTimeout(() => {
    fcQuestion.textContent = card.q;
    fcAnswer.textContent = card.a;
  }, 150);

  fcProgressText.textContent = `${studyIndex + 1} / ${studyQueue.length}`;
  fcProgressFill.style.width = `${((studyIndex + 1) / studyQueue.length) * 100}%`;
  fcPrev.disabled = studyIndex === 0;
  fcNext.disabled = studyIndex === studyQueue.length - 1;
}

fcCardStudy.onclick = () => {
  fcCardStudy.classList.toggle('flipped');
};

fcPrev.onclick = () => {
  if (studyIndex > 0) {
    studyIndex--;
    showCard();
  }
};
fcNext.onclick = () => {
  if (studyIndex < studyQueue.length - 1) {
    studyIndex++;
    showCard();
  }
};

fcShuffle.onclick = () => {
  for (let i = studyQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [studyQueue[i], studyQueue[j]] = [studyQueue[j], studyQueue[i]];
  }
  studyIndex = 0;
  showCard();
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (fcStudyView.style.display === 'none') return;
  if (e.key === 'ArrowLeft') fcPrev.click();
  if (e.key === 'ArrowRight') fcNext.click();
  if (e.key === ' ') {
    e.preventDefault();
    fcCardStudy.click();
  }
});

// ---------- Import / Export ----------
fcExport.onclick = () => {
  if (!decks.length) return alert('কোনো deck নেই');
  const data = JSON.stringify(decks, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `doctools-flashcards-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

fcImport.onclick = () => {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'application/json';
  inp.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error('Invalid format');
        // Merge decks
        data.forEach(d => {
          if (d.name && Array.isArray(d.cards)) {
            decks.push({ id: uid(), name: d.name, cards: d.cards });
          }
        });
        save();
        renderDecks();
        alert('✅ Import সফল হয়েছে');
      } catch (err) {
        alert('❌ ফাইল পড়া গেল না: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  inp.click();
};

// ---------- Init ----------
renderDecks();
