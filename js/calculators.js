/* =====================================================
   DocTools - Medical Calculators
   by Munaf Wasif
   ===================================================== */

// ---------- Calculator Definitions ----------
const CALCULATORS = [
  {
    id: 'bmi',
    name: 'BMI Calculator',
    icon: '⚖️',
    category: 'general',
    desc: 'Body Mass Index (kg/m²)',
    render: renderBMI,
  },
  {
    id: 'bsa',
    name: 'BSA (Du Bois)',
    icon: '📐',
    category: 'general',
    desc: 'Body Surface Area (m²)',
    render: renderBSA,
  },
  {
    id: 'ibw',
    name: 'Ideal Body Weight',
    icon: '🎯',
    category: 'general',
    desc: 'Devine formula based IBW',
    render: renderIBW,
  },
  {
    id: 'gfr',
    name: 'GFR (Cockcroft-Gault)',
    icon: '🫘',
    category: 'renal',
    desc: 'Creatinine Clearance estimate',
    render: renderGFR,
  },
  {
    id: 'mdrd',
    name: 'GFR (MDRD)',
    icon: '🧪',
    category: 'renal',
    desc: 'eGFR for CKD staging',
    render: renderMDRD,
  },
  {
    id: 'anion',
    name: 'Anion Gap',
    icon: '⚡',
    category: 'electrolyte',
    desc: 'Na − (Cl + HCO₃)',
    render: renderAnionGap,
  },
  {
    id: 'corrected-na',
    name: 'Corrected Sodium',
    icon: '🧂',
    category: 'electrolyte',
    desc: 'Hyperglycemia correction',
    render: renderCorrectedNa,
  },
  {
    id: 'corrected-ca',
    name: 'Corrected Calcium',
    icon: '🦴',
    category: 'electrolyte',
    desc: 'Albumin-corrected Ca',
    render: renderCorrectedCa,
  },
  {
    id: 'apgar',
    name: 'APGAR Score',
    icon: '👶',
    category: 'pediatric',
    desc: 'Newborn assessment',
    render: renderAPGAR,
  },
  {
    id: 'gcs',
    name: 'Glasgow Coma Scale',
    icon: '🧠',
    category: 'emergency',
    desc: 'Consciousness assessment',
    render: renderGCS,
  },
  {
    id: 'pediatric-dose',
    name: 'Pediatric Dose',
    icon: '💊',
    category: 'pediatric',
    desc: 'Weight-based drug dosing',
    render: renderPediatricDose,
  },
  {
    id: 'iv-fluid',
    name: 'IV Fluid (Maintenance)',
    icon: '💧',
    category: 'pediatric',
    desc: 'Holliday-Segar 4-2-1 rule',
    render: renderIVFluid,
  },
];

// ---------- DOM Elements ----------
const grid = document.getElementById('calcGrid');
const searchInput = document.getElementById('calcSearch');
const catBtns = document.querySelectorAll('#calcCategories button');
const modal = document.getElementById('calcModal');
const modalContent = document.getElementById('calcContent');
const modalClose = document.getElementById('calcClose');

let activeCat = 'all';
let searchTerm = '';

// ---------- Render Grid ----------
function renderGrid() {
  const filtered = CALCULATORS.filter(c => {
    const matchCat = activeCat === 'all' || c.category === activeCat;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm) ||
      c.desc.toLowerCase().includes(searchTerm) ||
      c.category.toLowerCase().includes(searchTerm);
    return matchCat && matchSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="calc-empty"><span>🔍</span>কোনো ক্যালকুলেটর পাওয়া যায়নি</div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => `
    <div class="calc-card" data-id="${c.id}">
      <span class="cc-icon">${c.icon}</span>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <span class="cc-cat">${c.category}</span>
    </div>
  `).join('');

  grid.querySelectorAll('.calc-card').forEach(card => {
    card.onclick = () => openCalc(card.dataset.id);
  });
}

// ---------- Open Modal ----------
function openCalc(id) {
  const calc = CALCULATORS.find(c => c.id === id);
  if (!calc) return;
  modalContent.innerHTML = calc.render();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  calc.attach?.();
  // Attach generic submit handler based on id
  attachHandler(id);
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.onclick = closeModal;
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// ---------- Search & Filter ----------
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.toLowerCase().trim();
  renderGrid();
});

catBtns.forEach(btn => {
  btn.onclick = () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    renderGrid();
  };
});

// =====================================================
// CALCULATOR RENDER FUNCTIONS
// =====================================================

function renderBMI() {
  return `
    <h2 class="calc-title">⚖️ BMI Calculator</h2>
    <p class="calc-desc">Body Mass Index নির্ণয় করে (kg/m²)। Adult দের জন্য প্রযোজ্য।</p>
    <form class="calc-form" id="calcForm">
      <label>ওজন (kg)</label>
      <input type="number" id="weight" placeholder="যেমন: 70" step="0.1" required />
      <label>উচ্চতা (cm)</label>
      <input type="number" id="height" placeholder="যেমন: 170" step="0.1" required />
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderBSA() {
  return `
    <h2 class="calc-title">📐 Body Surface Area (Du Bois)</h2>
    <p class="calc-desc">Chemotherapy dosing, cardiac index ইত্যাদির জন্য BSA দরকার হয়।</p>
    <form class="calc-form" id="calcForm">
      <label>ওজন (kg)</label>
      <input type="number" id="weight" placeholder="70" step="0.1" required />
      <label>উচ্চতা (cm)</label>
      <input type="number" id="height" placeholder="170" step="0.1" required />
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderIBW() {
  return `
    <h2 class="calc-title">🎯 Ideal Body Weight (Devine)</h2>
    <p class="calc-desc">Ventilator settings, drug dosing এ ব্যবহার হয়।</p>
    <form class="calc-form" id="calcForm">
      <label>Gender</label>
      <div class="radio-group">
        <label><input type="radio" name="gender" value="male" checked /><span>Male</span></label>
        <label><input type="radio" name="gender" value="female" /><span>Female</span></label>
      </div>
      <label>উচ্চতা (cm)</label>
      <input type="number" id="height" placeholder="170" step="0.1" required />
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderGFR() {
  return `
    <h2 class="calc-title">🫘 GFR (Cockcroft-Gault)</h2>
    <p class="calc-desc">Creatinine Clearance estimate — drug dosing এ গুরুত্বপূর্ণ।</p>
    <form class="calc-form" id="calcForm">
      <label>Age (years)</label>
      <input type="number" id="age" placeholder="40" required />
      <label>Gender</label>
      <div class="radio-group">
        <label><input type="radio" name="gender" value="male" checked /><span>Male</span></label>
        <label><input type="radio" name="gender" value="female" /><span>Female</span></label>
      </div>
      <label>Weight (kg)</label>
      <input type="number" id="weight" placeholder="70" step="0.1" required />
      <label>Serum Creatinine (mg/dL)</label>
      <input type="number" id="scr" placeholder="1.0" step="0.01" required />
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderMDRD() {
  return `
    <h2 class="calc-title">🧪 eGFR (MDRD)</h2>
    <p class="calc-desc">CKD staging এর জন্য — 4-variable MDRD equation।</p>
    <form class="calc-form" id="calcForm">
      <label>Age (years)</label>
      <input type="number" id="age" placeholder="40" required />
      <label>Gender</label>
      <div class="radio-group">
        <label><input type="radio" name="gender" value="male" checked /><span>Male</span></label>
        <label><input type="radio" name="gender" value="female" /><span>Female</span></label>
      </div>
      <label>Serum Creatinine (mg/dL)</label>
      <input type="number" id="scr" placeholder="1.0" step="0.01" required />
      <label>Race</label>
      <select id="race">
        <option value="non-black">Non-Black</option>
        <option value="black">Black</option>
      </select>
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderAnionGap() {
  return `
    <h2 class="calc-title">⚡ Anion Gap</h2>
    <p class="calc-desc">Metabolic acidosis এর differential diagnosis এ সাহায্য করে।</p>
    <form class="calc-form" id="calcForm">
      <label>Sodium (mEq/L)</label>
      <input type="number" id="na" placeholder="140" step="0.1" required />
      <label>Chloride (mEq/L)</label>
      <input type="number" id="cl" placeholder="100" step="0.1" required />
      <label>Bicarbonate (mEq/L)</label>
      <input type="number" id="hco3" placeholder="24" step="0.1" required />
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderCorrectedNa() {
  return `
    <h2 class="calc-title">🧂 Corrected Sodium</h2>
    <p class="calc-desc">Hyperglycemia তে sodium correction।</p>
    <form class="calc-form" id="calcForm">
      <label>Measured Sodium (mEq/L)</label>
      <input type="number" id="na" placeholder="135" step="0.1" required />
      <label>Blood Glucose (mg/dL)</label>
      <input type="number" id="glucose" placeholder="300" step="0.1" required />
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderCorrectedCa() {
  return `
    <h2 class="calc-title">🦴 Corrected Calcium</h2>
    <p class="calc-desc">Hypoalbuminemia তে calcium correction।</p>
    <form class="calc-form" id="calcForm">
      <label>Measured Calcium (mg/dL)</label>
      <input type="number" id="ca" placeholder="9.0" step="0.1" required />
      <label>Serum Albumin (g/dL)</label>
      <input type="number" id="alb" placeholder="4.0" step="0.1" required />
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderAPGAR() {
  return `
    <h2 class="calc-title">👶 APGAR Score</h2>
    <p class="calc-desc">Newborn assessment — 1 min ও 5 min এ মূল্যায়ন।</p>
    <form class="calc-form" id="calcForm">
      <label>Appearance (Color)</label>
      <select id="appearance">
        <option value="0">0 — Pale / Blue all over</option>
        <option value="1">1 — Blue extremities, pink body</option>
        <option value="2" selected>2 — Pink all over</option>
      </select>
      <label>Pulse (Heart Rate)</label>
      <select id="pulse">
        <option value="0">0 — Absent</option>
        <option value="1">1 — &lt;100 bpm</option>
        <option value="2" selected>2 — ≥100 bpm</option>
      </select>
      <label>Grimace (Reflex)</label>
      <select id="grimace">
        <option value="0">0 — No response</option>
        <option value="1">1 — Grimace only</option>
        <option value="2" selected>2 — Cry / active withdrawal</option>
      </select>
      <label>Activity (Muscle Tone)</label>
      <select id="activity">
        <option value="0">0 — Limp</option>
        <option value="1">1 — Some flexion</option>
        <option value="2" selected>2 — Active motion</option>
      </select>
      <label>Respiration</label>
      <select id="respiration">
        <option value="0">0 — Absent</option>
        <option value="1">1 — Slow / irregular</option>
        <option value="2" selected>2 — Good, crying</option>
      </select>
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderGCS() {
  return `
    <h2 class="calc-title">🧠 Glasgow Coma Scale</h2>
    <p class="calc-desc">Consciousness level assessment (3-15)।</p>
    <form class="calc-form" id="calcForm">
      <label>Eye Opening (E)</label>
      <select id="eye">
        <option value="1">1 — None</option>
        <option value="2">2 — To pain</option>
        <option value="3">3 — To speech</option>
        <option value="4" selected>4 — Spontaneous</option>
      </select>
      <label>Verbal Response (V)</label>
      <select id="verbal">
        <option value="1">1 — None</option>
        <option value="2">2 — Incomprehensible sounds</option>
        <option value="3">3 — Inappropriate words</option>
        <option value="4">4 — Confused</option>
        <option value="5" selected>5 — Oriented</option>
      </select>
      <label>Motor Response (M)</label>
      <select id="motor">
        <option value="1">1 — None</option>
        <option value="2">2 — Decerebrate</option>
        <option value="3">3 — Decorticate</option>
        <option value="4">4 — Withdraws from pain</option>
        <option value="5">5 — Localizes pain</option>
        <option value="6" selected>6 — Obeys commands</option>
      </select>
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderPediatricDose() {
  return `
    <h2 class="calc-title">💊 Pediatric Dose</h2>
    <p class="calc-desc">Weight-based dose calculation (mg/kg/dose)।</p>
    <form class="calc-form" id="calcForm">
      <label>Child Weight (kg)</label>
      <input type="number" id="weight" placeholder="15" step="0.1" required />
      <label>Dose (mg/kg/dose)</label>
      <input type="number" id="dose" placeholder="10" step="0.01" required />
      <label>Frequency (times per day) — optional</label>
      <input type="number" id="freq" placeholder="3" step="1" />
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

function renderIVFluid() {
  return `
    <h2 class="calc-title">💧 IV Fluid Maintenance</h2>
    <p class="calc-desc">Holliday-Segar 4-2-1 rule অনুযায়ী maintenance fluid।</p>
    <form class="calc-form" id="calcForm">
      <label>Weight (kg)</label>
      <input type="number" id="weight" placeholder="20" step="0.1" required />
      <button type="submit" class="calc-submit">হিসাব করুন</button>
      <div class="calc-result" id="calcResult"></div>
    </form>
  `;
}

// =====================================================
// ATTACH HANDLERS (Per Calculator)
// =====================================================

function attachHandler(id) {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('calcResult');
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const data = {};
    form.querySelectorAll('input, select').forEach(el => {
      if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else if (el.value !== '') {
        data[el.id] = parseFloat(el.value);
      }
    });

    const out = computeResult(id, data);
    result.className = 'calc-result show ' + (out.level || 'good');
    result.innerHTML = `
      <div class="cr-value">${out.value}</div>
      <div class="cr-label">${out.label}</div>
      ${out.note ? `<div class="cr-note">${out.note}</div>` : ''}
    `;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
}

// =====================================================
// COMPUTE LOGIC
// =====================================================

function computeResult(id, d) {
  switch (id) {

    case 'bmi': {
      const h = d.height / 100;
      const bmi = d.weight / (h * h);
      let level = 'good', cat = 'Normal';
      if (bmi < 18.5) { level = 'warn'; cat = 'Underweight'; }
      else if (bmi >= 25 && bmi < 30) { level = 'warn'; cat = 'Overweight'; }
      else if (bmi >= 30) { level = 'danger'; cat = 'Obese'; }
      return {
        value: bmi.toFixed(1) + ' kg/m²',
        label: 'BMI — ' + cat,
        level,
        note: '< 18.5 Underweight • 18.5–24.9 Normal • 25–29.9 Overweight • ≥30 Obese'
      };
    }

    case 'bsa': {
      const bsa = Math.sqrt((d.height * d.weight) / 3600);
      return {
        value: bsa.toFixed(3) + ' m²',
        label: 'Body Surface Area (Du Bois)',
        level: 'good',
        note: 'Average adult BSA ≈ 1.7 m²'
      };
    }

    case 'ibw': {
      const inches = d.height / 2.54;
      const over5ft = Math.max(0, inches - 60);
      const ibw = d.gender === 'male'
        ? 50 + 2.3 * over5ft
        : 45.5 + 2.3 * over5ft;
      return {
        value: ibw.toFixed(1) + ' kg',
        label: 'Ideal Body Weight (Devine)',
        level: 'good',
        note: 'Male: 50 kg + 2.3 kg/inch >5ft • Female: 45.5 kg + 2.3 kg/inch >5ft'
      };
    }

    case 'gfr': {
      let crcl = ((140 - d.age) * d.weight) / (72 * d.scr);
      if (d.gender === 'female') crcl *= 0.85;
      let level = 'good', stage = 'Normal';
      if (crcl < 15) { level = 'danger'; stage = 'Kidney failure'; }
      else if (crcl < 30) { level = 'danger'; stage = 'Severe ↓'; }
      else if (crcl < 60) { level = 'warn'; stage = 'Moderate ↓'; }
      else if (crcl < 90) { level = 'warn'; stage = 'Mild ↓'; }
      return {
        value: crcl.toFixed(1) + ' mL/min',
        label: 'Creatinine Clearance
