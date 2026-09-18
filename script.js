// Dropdown numbers ජනනය කිරීමේ helper function
function populateSelect(className, start, end, formatTwoDigits = false) {
  document.querySelectorAll('.' + className).forEach(sel => {
    sel.innerHTML = '<option value="">........</option>';
    for (let i = start; i <= end; i++) {
      let val = (formatTwoDigits && i < 10) ? '0' + i : i.toString();
      let opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      sel.appendChild(opt);
    }
  });
}

function initForm() {
  // 1. Static dropdowns වල මුලට තිත් option එකක් එක් කිරීම
  document.querySelectorAll('#kendaraya-content select:not([class*="auto-fill"]):not(#clock_minute)').forEach(sel => {
    // දැනටමත් තිත් option එකක් නැත්නම් පමණක් එක් කරයි
    if (!sel.querySelector('option[value=""]')) {
      const emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = '........';
      sel.insertBefore(emptyOpt, sel.firstChild);
      sel.selectedIndex = 0;
      initTwoKundaliCharts();
    }
  });

  // 2. වර්ෂ සහ දින
  populateSelect('auto-fill-year', 1940, 2040);
  populateSelect('auto-fill-shaka', 1850, 1960);
  populateSelect('auto-fill-31', 1, 31, true);

  // 3. පළමු පේළියේ පැය (1-12) සහ විනාඩි (00-59)
  populateSelect('auto-fill-12-hours', 1, 12, true);
  populateSelect('auto-fill-60-min', 0, 59, true);

  // 4. දශා කාල
  populateSelect('auto-fill-zero-to-25', 0, 25, true);
  populateSelect('auto-fill-months', 0, 12, true);
  populateSelect('auto-fill-days', 0, 31, true);

  // 5. ඔරලෝසු වේලාව පසු වී විනාඩි (0 සිට 60 දක්වා සිංහලෙන් සහ අංකයෙන්)
  const minSelect = document.getElementById('clock_minute');
  if (minSelect) {
    const sinhalaNumbers = [
      "බිංදුව (00)", "එක (01)", "දෙක (02)", "තුන (03)", "හතර (04)", "පහ (05)",
      "හය (06)", "හත (07)", "අට (08)", "නමය (09)", "දහය (10)",
      "එකොළහ (11)", "දොළහ (12)", "දහතුන (13)", "දාහතර (14)", "පහළොව (15)",
      "දාසය (16)", "දාහත (17)", "දහඅට (18)", "දහනවය (19)", "විස්ස (20)",
      "විසිඑක (21)", "විසිදෙක (22)", "විසිතුන (23)", "විසිහතර (24)", "විසිපහ (25)",
      "විසිහය (26)", "විසිහත (27)", "විසිඅට (28)", "විසිමනවය (29)", "තිහ (30)",
      "තිස්එක (31)", "තිස්දෙක (32)", "තිස්තුන (33)", "තිස්හතර (34)", "තිස්පහ (35)",
      "තිස්හය (36)", "තිස්හත (37)", "තිස්අට (38)", "තිස්නමය (39)", "හතළිහ (40)",
      "හතළිස්එක (41)", "හතළිස්දෙක (42)", "හතළිස්තුන (43)", "හතළිස්හතර (44)", "හතළිස්පහ (45)",
      "හතළිස්හය (46)", "හතළිස්හත (47)", "හතළිස්අට (48)", "හතළිස්නමය (49)", "පනහ (50)",
      "පනස්එක (51)", "පනස්දෙක (52)", "පනස්තුන (53)", "පනස්හතර (54)", "පනස්පහ (55)",
      "පනස්හය (56)", "පනස්හත (57)", "පනස්අට (58)", "පනස්නමය (59)"
    ];

    minSelect.innerHTML = '<option value="">........</option>';
    sinhalaNumbers.forEach(item => {
      let opt = document.createElement('option');
      opt.value = item;
      opt.textContent = item;
      minSelect.appendChild(opt);
    });
  }
}

// Reset ක්‍රියාවලිය
function resetDefaults() {
  const form = document.getElementById('kendaraya-form');
  if (form) {
    form.reset();
  }

  document.querySelectorAll('#kendaraya-content select').forEach(sel => {
    sel.selectedIndex = 0;
    sel.value = '';
  });

  const status = document.getElementById('status');
  if (status) {
    status.style.display = 'inline';
    status.textContent = '🔄 සියල්ල Clear විය!';
    setTimeout(() => { status.style.display = 'none'; }, 2000);
  }
}

// PDF Download ක්‍රියාවලිය
function saveAsPDF() {
  const status = document.getElementById('status');
  if (status) {
    status.style.display = 'inline';
    status.textContent = 'PDF එක සකස් වෙමින් පවතී...';
  }

  const element = document.getElementById('kendaraya-content');
  const clone = element.cloneNode(true);

  // Chart සහ පෝරමයේ ඇති සියලුම Dropdown සාමාන්‍ය Text බවට පත් කිරීම
  const selects = element.querySelectorAll('select');
  const cloneSelects = clone.querySelectorAll('select');

  for (let i = 0; i < selects.length; i++) {
    const span = document.createElement('span');
    const val = selects[i].value;

    if (selects[i].classList.contains('k-graha-sel')) {
      // ග්‍රහ අකුර (.. නම් හිස්ව තබයි)
      span.textContent = val ? val : '';
      span.style.fontWeight = 'bold';
      span.style.fontSize = '12px';
      span.style.color = '#000';
    } else if (selects[i].classList.contains('lagna-pick')) {
      // මැද ලග්න නම
      span.textContent = val ? val : '........';
      span.style.fontWeight = 'bold';
      span.style.fontSize = '14px';
      span.style.color = '#000';
    } else {
      // සාමාන්‍ය පේළි වල drop down
      span.textContent = val ? ' ' + val + ' ' : ' ............ ';
      span.style.fontWeight = 'bold';
      span.style.borderBottom = '1px dotted #444';
      span.style.padding = '0 4px';
    }

    cloneSelects[i].parentNode.replaceChild(span, cloneSelects[i]);
  }

  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'Kendaraya_Document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(clone).save().then(() => {
    if (status) {
      status.textContent = '✅ PDF එක සාර්ථකව Download විය!';
      setTimeout(() => { status.style.display = 'none'; }, 3000);
    }
  }).catch(() => {
    if (status) status.textContent = '❌ දෝෂයක් සිදු විය.';
  });
}

// ලග්න ලැයිස්තුව
const lagnaList = [
  "මේෂ", "වෘෂභ", "මිථුන", "කටක", "සිංහ", "කන්‍යා",
  "තුලා", "වෘශ්චික", "ධනු", "මකර", "කුම්භ", "මීන"
];

// ග්‍රහයන් 9 දෙනාගේ කෙටි නාම
const shortGrahas = [
  { val: "", text: ".." },
  { val: "ර", text: "ර" },
  { val: "ච", text: "ච" },
  { val: "කු", text: "කු" },
  { val: "බු", text: "බු" },
  { val: "ගු", text: "ගු" },
  { val: "(ගු)", text: "(ගු)" },
  { val: "ශු", text: "ශු" },
  { val: "ශ", text: "ශ" },
  { val: "රා", text: "රා" },
  { val: "කේ", text: "කේ" }
];

function initTwoKundaliCharts() {
  // 1. මැද ලග්න Dropdowns දෙක පිරවීම
  ['c1_lagna', 'c2_lagna'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = '<option value="">....</option>';
      lagnaList.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = l;
        el.appendChild(opt);
      });
    }
  });

  // Default values
  if (document.getElementById('c1_lagna')) document.getElementById('c1_lagna').value = "සිංහ";
  if (document.getElementById('c2_lagna')) document.getElementById('c2_lagna').value = "තුලා";

  // 2. සෑම slot (.g-box) එකකටම එක Dropdown එකක් පමණක් සෑදීම
  document.querySelectorAll('.g-box').forEach(box => {
    box.innerHTML = '';
    const sel = document.createElement('select');
    sel.className = 'k-graha-sel';
    shortGrahas.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.val;
      opt.textContent = g.text;
      sel.appendChild(opt);
    });
    box.appendChild(sel);
  });
}

document.addEventListener('DOMContentLoaded', initForm);