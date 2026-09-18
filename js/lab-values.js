/* =====================================================
   DocTools - Normal Lab Values
   by Munaf Wasif
   ===================================================== */

const LAB_VALUES = [
  // ============ HEMATOLOGY ============
  {
    category: 'hematology',
    name: 'Hemoglobin (Hb)',
    note: 'Male: 13-17 • Female: 12-15',
    range: '13 – 17',
    unit: 'g/dL',
    gender: 'male',
  },
  {
    category: 'hematology',
    name: 'Hemoglobin (Hb) — Female',
    range: '12 – 15',
    unit: 'g/dL',
  },
  {
    category: 'hematology',
    name: 'Total WBC Count',
    range: '4,000 – 11,000',
    unit: '/µL',
  },
  {
    category: 'hematology',
    name: 'Platelet Count',
    range: '1.5 – 4.5',
    unit: 'lakh/µL',
  },
  {
    category: 'hematology',
    name: 'Hematocrit (PCV)',
    note: 'Male 40-52% • Female 36-48%',
    range: '40 – 52',
    unit: '%',
  },
  {
    category: 'hematology',
    name: 'MCV',
    note: 'Microcytic <80 • Macrocytic >100',
    range: '80 – 100',
    unit: 'fL',
  },
  {
    category: 'hematology',
    name: 'MCH',
    range: '27 – 33',
    unit: 'pg',
  },
  {
    category: 'hematology',
    name: 'MCHC',
    range: '32 – 36',
    unit: 'g/dL',
  },
  {
    category: 'hematology',
    name: 'ESR',
    note: 'Male 0-15 • Female 0-20',
    range: '0 – 15',
    unit: 'mm/hr',
  },
  {
    category: 'hematology',
    name: 'Reticulocyte Count',
    range: '0.5 – 2.5',
    unit: '%',
  },
  {
    category: 'hematology',
    name: 'Neutrophils',
    range: '40 – 75',
    unit: '%',
  },
  {
    category: 'hematology',
    name: 'Lymphocytes',
    range: '20 – 45',
    unit: '%',
  },
  {
    category: 'hematology',
    name: 'Eosinophils',
    range: '1 – 6',
    unit: '%',
  },
  {
    category: 'hematology',
    name: 'Monocytes',
    range: '2 – 10',
    unit: '%',
  },
  {
    category: 'hematology',
    name: 'Basophils',
    range: '0 – 1',
    unit: '%',
  },

  // ============ BIOCHEMISTRY ============
  {
    category: 'biochemistry',
    name: 'Random Blood Glucose',
    range: '70 – 140',
    unit: 'mg/dL',
  },
  {
    category: 'biochemistry',
    name: 'Fasting Blood Glucose',
    range: '70 – 100',
    unit: 'mg/dL',
  },
  {
    category: 'biochemistry',
    name: 'Post-prandial (2h)',
    range: '< 140',
    unit: 'mg/dL',
  },
  {
    category: 'biochemistry',
    name: 'HbA1c',
    note: 'Normal <5.7 • Prediabetes 5.7-6.4 • Diabetes ≥6.5',
    range: '< 5.7',
    unit: '%',
  },
  {
    category: 'biochemistry',
    name: 'Serum Urea',
    range: '15 – 45',
    unit: 'mg/dL',
  },
  {
    category: 'biochemistry',
    name: 'Blood Urea Nitrogen (BUN)',
    range: '7 – 20',
    unit: 'mg/dL',
  },
  {
    category: 'biochemistry',
    name: 'Serum Creatinine',
    note: 'Male 0.7-1.3 • Female 0.6-1.1',
    range: '0.7 – 1.3',
    unit: 'mg/dL',
  },
  {
    category: 'biochemistry',
    name: 'Serum Uric Acid',
    note: 'Male 3.4-7.0 • Female 2.4-6.0',
    range: '3.4 – 7.0',
    unit: 'mg/dL',
  },
  {
    category: 'biochemistry',
    name: 'Serum Total Protein',
    range: '6.0 – 8.3',
    unit: 'g/dL',
  },
  {
    category: 'biochemistry',
    name: 'Serum Albumin',
    range: '3.5 – 5.5',
    unit: 'g/dL',
  },
  {
    category: 'biochemistry',
    name: 'Serum Globulin',
    range: '2.0 – 3.5',
    unit: 'g/dL',
  },

  // ============ RENAL ============
  {
    category: 'renal',
    name: 'Serum Sodium (Na⁺)',
    range: '135 – 145',
    unit: 'mEq/L',
  },
  {
    category: 'renal',
    name: 'Serum Potassium (K⁺)',
    range: '3.5 – 5.0',
    unit: 'mEq/L',
  },
  {
    category: 'renal',
    name: 'Serum Chloride (Cl⁻)',
    range: '96 – 106',
    unit: 'mEq/L',
  },
  {
    category: 'renal',
    name: 'Serum Bicarbonate (HCO₃⁻)',
    range: '22 – 28',
    unit: 'mEq/L',
  },
  {
    category: 'renal',
    name: 'Serum Calcium (Total)',
    range: '8.5 – 10.5',
    unit: 'mg/dL',
  },
  {
    category: 'renal',
    name: 'Serum Ionized Calcium',
    range: '4.5 – 5.6',
    unit: 'mg/dL',
  },
  {
    category: 'renal',
    name: 'Serum Phosphate',
    range: '2.5 – 4.5',
    unit: 'mg/dL',
  },
  {
    category: 'renal',
    name: 'Serum Magnesium',
    range: '1.7 – 2.2',
    unit: 'mg/dL',
  },

  // ============ LIVER ============
  {
    category: 'liver',
    name: 'Total Bilirubin',
    range: '0.2 – 1.2',
    unit: 'mg/dL',
  },
  {
    category: 'liver',
    name: 'Direct Bilirubin',
    range: '0.0 – 0.3',
    unit: 'mg/dL',
  },
  {
    category: 'liver',
    name: 'Indirect Bilirubin',
    range: '0.2 – 0.9',
    unit: 'mg/dL',
  },
  {
    category: 'liver',
    name: 'ALT (SGPT)',
    range: '7 – 56',
    unit: 'U/L',
  },
  {
    category: 'liver',
    name: 'AST (SGOT)',
    range: '10 – 40',
    unit: 'U/L',
  },
  {
    category: 'liver',
    name: 'ALP (Alkaline Phosphatase)',
    range: '44 – 147',
    unit: 'U/L',
  },
  {
    category: 'liver',
    name: 'GGT',
    note: 'Male 8-61 • Female 5-36',
    range: '8 – 61',
    unit: 'U/L',
  },

  // ============ ELECTROLYTE (Extra) ============
  {
    category: 'electrolyte',
    name: 'Anion Gap',
    range: '8 – 12',
    unit: 'mEq/L',
  },
  {
    category: 'electrolyte',
    name: 'Serum Osmolality',
    range: '275 – 295',
    unit: 'mOsm/kg',
  },

  // ============ THYROID ============
  {
    category: 'thyroid',
    name: 'TSH',
    note: 'Adult normal range',
    range: '0.4 – 4.0',
    unit: 'mIU/L',
  },
  {
    category: 'thyroid',
    name: 'Free T4 (FT4)',
    range: '0.8 – 1.8',
    unit: 'ng/dL',
  },
  {
    category: 'thyroid',
    name: 'Free T3 (FT3)',
    range: '2.3 – 4.2',
    unit: 'pg/mL',
  },
  {
    category: 'thyroid',
    name: 'Total T4',
    range: '5.0 – 12.0',
    unit: 'µg/dL',
  },
  {
    category: 'thyroid',
    name: 'Total T3',
    range: '80 – 200',
    unit: 'ng/dL',
  },

  // ============ LIPID ============
  {
    category: 'lipid',
    name: 'Total Cholesterol',
    range: '< 200',
    unit: 'mg/dL',
  },
  {
    category: 'lipid',
    name: 'LDL Cholesterol',
    note: 'Optimal <100 • High ≥160',
    range: '< 100',
    unit: 'mg/dL',
  },
  {
    category: 'lipid',
    name: 'HDL Cholesterol',
    note: 'Male >40 • Female >50',
    range: '> 40',
    unit: 'mg/dL',
  },
  {
    category: 'lipid',
    name: 'Triglycerides',
    range: '< 150',
    unit: 'mg/dL',
  },
  {
    category: 'lipid',
    name: 'VLDL',
    range: '5 – 40',
    unit: 'mg/dL',
  },

  // ============ ABG ============
  {
    category: 'abg',
    name: 'pH (Arterial)',
    range: '7.35 – 7.45',
    unit: '',
  },
  {
    category: 'abg',
    name: 'PaO₂',
    range: '80 – 100',
    unit: 'mmHg',
  },
  {
    category: 'abg',
    name: 'PaCO₂',
    range: '35 – 45',
    unit: 'mmHg',
  },
  {
    category: 'abg',
    name: 'HCO₃⁻ (Arterial)',
    range: '22 – 26',
    unit: 'mEq/L',
  },
  {
    category: 'abg',
    name: 'SaO₂',
    range: '95 – 100',
    unit: '%',
  },
  {
    category: 'abg',
    name: 'Base Excess',
    range: '-2 to +2',
    unit: 'mEq/L',
  },

  // ============ COAGULATION ============
  {
    category: 'coagulation',
    name: 'PT (Prothrombin Time)',
    range: '11 – 13.5',
    unit: 'seconds',
  },
  {
    category: 'coagulation',
    name: 'INR',
    range: '0.8 – 1.2',
    unit: '',
  },
  {
    category: 'coagulation',
    name: 'aPTT',
    range: '25 – 35',
    unit: 'seconds',
  },
  {
    category: 'coagulation',
    name: 'Bleeding Time',
    range: '2 – 7',
    unit: 'minutes',
  },
  {
    category: 'coagulation',
    name: 'Clotting Time',
    range: '4 – 10',
    unit: 'minutes',
  },
  {
    category: 'coagulation',
    name: 'D-dimer',
    range: '< 500',
    unit: 'ng/mL',
  },

  // ============ CARDIAC ============
  {
    category: 'cardiac',
    name: 'Troponin I',
    range: '< 0.04',
    unit: 'ng/mL',
  },
  {
    category: 'cardiac',
    name: 'Troponin T',
    range: '< 0.1',
    unit: 'ng/mL',
  },
  {
    category: 'cardiac',
    name: 'CK-MB',
    range: '< 25',
    unit: 'U/L',
  },
  {
    category: 'cardiac',
    name: 'BNP',
    range: '< 100',
    unit: 'pg/mL',
  },
  {
    category: 'cardiac',
    name: 'NT-proBNP',
    note: '<125 (<75 yrs) • <450 (≥75 yrs)',
    range: '< 125',
    unit: 'pg/mL',
  },
  {
    category: 'cardiac',
    name: 'CK (Total)',
    range: '30 – 200',
    unit: 'U/L',
  },

  // ============ URINE ============
  {
    category: 'urine',
    name: 'Urine Specific Gravity',
    range: '1.005 – 1.030',
    unit: '',
  },
  {
    category: 'urine',
    name: 'Urine pH',
    range: '4.5 – 8.0',
    unit: '',
  },
  {
    category: 'urine',
    name: 'Urine Protein (24h)',
    range: '< 150',
    unit: 'mg/day',
  },
  {
    category: 'urine',
    name: 'Urine Glucose',
    range: 'Negative',
    unit: '',
  },
  {
    category: 'urine',
    name: 'Urine Ketones',
    range: 'Negative',
    unit: '',
  },
  {
    category: 'urine',
    name: 'Urine RBC',
    range: '0 – 2',
    unit: '/HPF',
  },
  {
    category: 'urine',
    name: 'Urine WBC',
    range: '0 – 5',
    unit: '/HPF',
  },
];

const CATEGORY_LABELS = {
  hematology: '🩸 Hematology',
  biochemistry: '🧬 Biochemistry',
  renal: '🫘 Renal Function',
  liver: '🫀 Liver Function',
  electrolyte: '⚡ Electrolytes',
  thyroid: '🦋 Thyroid',
  lipid: '🧈 Lipid Profile',
  abg: '💨 Arterial Blood Gas',
  coagulation: '🩹 Coagulation',
  cardiac: '❤️ Cardiac Markers',
  urine: '💧 Urine Analysis',
};

// ---------- DOM ----------
const listEl = document.getElementById('lvList');
const emptyEl = document.getElementById('lvEmpty');
const searchInput = document.getElementById('lvSearch');
const catBtns = document.querySelectorAll('#lvCategories button');

let activeCat = 'all';
let searchTerm = '';

// ---------- Render ----------
function render() {
  const filtered = LAB_VALUES.filter(v => {
    const matchCat = activeCat === 'all' || v.category === activeCat;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      (v.note && v.note.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  if (!filtered.length) {
    listEl.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  // Group by category
  const grouped = {};
  filtered.forEach(v => {
    if (!grouped[v.category]) grouped[v.category] = [];
    grouped[v.category].push(v);
  });

  let html = '';
  for (const cat in grouped) {
    html += `<div class="lv-cat-heading">${CATEGORY_LABELS[cat] || cat}</div>`;
    grouped[cat].forEach(v => {
      html += `
        <div class="lv-row">
          <div class="lv-row-left">
            <div class="lv-row-name">
              ${v.name}
              ${v.note ? `<small>${v.note}</small>` : ''}
            </div>
          </div>
          <div class="lv-row-right">
            <div class="lv-row-range">${v.range}</div>
            ${v.unit ? `<div class="lv-row-unit">${v.unit}</div>` : ''}
          </div>
        </div>
      `;
    });
  }
  listEl.innerHTML = html;
}

// ---------- Events ----------
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.trim();
  render();
});

catBtns.forEach(btn => {
  btn.onclick = () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    render();
  };
});

// ---------- Init ----------
render();
