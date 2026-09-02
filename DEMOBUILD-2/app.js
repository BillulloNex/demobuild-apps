const STORAGE_KEY = 'shopify-launch-checklist-v1';

const GROUPS = [
  {
    name: 'Payments',
    tasks: [
      'Connect payment provider (Shopify Payments or PayPal)',
      'Run a test order in draft mode',
    ],
  },
  {
    name: 'Products',
    tasks: [
      'Add at least one product with photos and price',
      'Set inventory tracking if you stock items',
      'Write product descriptions customers can scan',
    ],
  },
  {
    name: 'Legal',
    tasks: [
      'Publish refund and return policy',
      'Add privacy policy page',
      'Set store contact email and business address',
    ],
  },
  {
    name: 'Shipping',
    tasks: [
      'Configure shipping zones and rates',
      'Set handling time customers see at checkout',
    ],
  },
  {
    name: 'Go-live',
    tasks: [
      'Remove storefront password',
      'Connect custom domain',
      'Submit sitemap to Google Search Console',
    ],
  },
];

const FLAT = GROUPS.flatMap((g) => g.tasks.map((t) => ({ group: g.name, text: t })));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return FLAT.map(() => false);
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  const state = loadState();
  const root = document.getElementById('checklist');
  root.innerHTML = '';
  let idx = 0;
  for (const g of GROUPS) {
    const sec = document.createElement('section');
    sec.innerHTML = `<h2>${g.name}</h2>`;
    for (const t of g.tasks) {
      const i = idx++;
      const id = `task-${i}`;
      const label = document.createElement('label');
      if (state[i]) label.classList.add('done');
      label.innerHTML = `<input type="checkbox" id="${id}" ${state[i] ? 'checked' : ''}><span class="desc">${t}</span>`;
      label.querySelector('input').addEventListener('change', (e) => {
        state[i] = e.target.checked;
        saveState(state);
        label.classList.toggle('done', state[i]);
        updateProgress(state);
      });
      sec.appendChild(label);
    }
    root.appendChild(sec);
  }
  updateProgress(state);
}

function updateProgress(state) {
  const done = state.filter(Boolean).length;
  const total = FLAT.length;
  document.getElementById('progressBar').style.width = `${(done / total) * 100}%`;
  document.getElementById('progressText').textContent = `${done} / ${total} complete`;
}

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all checkboxes?')) return;
  saveState(FLAT.map(() => false));
  render();
});

render();
