const CATEGORIES = [
  { key: "pain", label: "Customer pain", hint: "How urgent is the problem?" },
  { key: "audience", label: "Reachable audience", hint: "Can you reach likely buyers?" },
  { key: "fit", label: "Founder fit", hint: "Do you have an edge here?" },
  { key: "speed", label: "Speed to first test", hint: "Can you test it quickly?" },
  { key: "cost", label: "Low startup cost", hint: "Can you begin lean?" },
  { key: "revenue", label: "Revenue potential", hint: "Is there a clear paid outcome?" },
  { key: "evidence", label: "Evidence collected", hint: "What supports the demand?" },
];

const SAMPLE = {
  ideas: [
    {
      id: "idea-1",
      name: "RouteReady",
      description: "A simple dispatch board for independent home-service teams juggling jobs by text.",
      scores: { pain: 5, audience: 4, fit: 4, speed: 5, cost: 5, revenue: 4, evidence: 3 },
    },
    {
      id: "idea-2",
      name: "Sunday Stockroom",
      description: "Weekly inventory planning for small specialty retailers who over-order seasonal goods.",
      scores: { pain: 4, audience: 3, fit: 5, speed: 3, cost: 4, revenue: 4, evidence: 4 },
    },
    {
      id: "idea-3",
      name: "Neighbor Table",
      description: "Pre-order coordination for home cooks selling rotating meal drops locally.",
      scores: { pain: 3, audience: 4, fit: 4, speed: 4, cost: 3, revenue: 3, evidence: 2 },
    },
  ],
  weights: { pain: 20, audience: 15, fit: 15, speed: 15, cost: 10, revenue: 15, evidence: 10 },
  selectedId: "idea-1",
  window: "14 days",
  plans: {},
  completed: {},
  actions: {},
};

const STORE = "one-good-bet-v1";
const $ = (id) => document.getElementById(id);

let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    return saved && saved.ideas ? { ...structuredClone(SAMPLE), ...saved } : structuredClone(SAMPLE);
  } catch {
    return structuredClone(SAMPLE);
  }
}

function save() {
  localStorage.setItem(STORE, JSON.stringify(state));
}

function escapeHTML(value = "") {
  return value.replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[c]));
}

function score(idea) {
  const total = Object.values(state.weights).reduce((a, b) => a + Number(b), 0) || 1;
  const raw = CATEGORIES.reduce(
    (sum, c) => sum + (Number(idea.scores[c.key]) || 0) * (Number(state.weights[c.key]) || 0),
    0
  );
  return Math.round((raw / 5 / total) * 100);
}

function ranked() {
  return [...state.ideas].sort((a, b) => score(b) - score(a));
}

function strengths(idea) {
  return [...CATEGORIES]
    .sort((a, b) => idea.scores[b.key] - idea.scores[a.key])
    .slice(0, 2)
    .map((c) => c.label.toLowerCase())
    .join(" and ");
}

function risk(idea) {
  return [...CATEGORIES].sort((a, b) => idea.scores[a.key] - idea.scores[b.key])[0]?.label.toLowerCase()
    || "needs more evidence";
}

function render() {
  renderIdeas();
  renderWeights();
  renderRanking();
  renderComparison();
  renderCommitment();
  save();
}

function renderIdeas() {
  $("ideaCount").textContent = `${state.ideas.length} idea${state.ideas.length === 1 ? "" : "s"}`;
  if (!state.ideas.length) {
    $("ideaList").innerHTML = '<div class="empty-state"><h3>No ideas yet.</h3><p>Add at least three to compare them.</p></div>';
    return;
  }
  $("ideaList").innerHTML = state.ideas.map((idea, i) => `
    <article class="idea-row">
      <span class="idea-number">${String(i + 1).padStart(2, "0")}</span>
      <div class="idea-title">
        <h3>${escapeHTML(idea.name)}</h3>
        <p class="idea-desc">${escapeHTML(idea.description)}</p>
        <span>${strengths(idea)}</span>
      </div>
      <div class="score-pill">
        <strong>${score(idea)}</strong>
        <div class="score-bar"><i style="width:${score(idea)}%"></i></div>
      </div>
      <div class="idea-actions">
        <button class="icon-button edit-idea" data-id="${idea.id}" aria-label="Edit ${escapeHTML(idea.name)}">Edit</button>
        <button class="icon-button remove-idea" data-id="${idea.id}" aria-label="Remove ${escapeHTML(idea.name)}">Remove</button>
      </div>
    </article>
  `).join("");
  document.querySelectorAll(".edit-idea").forEach((b) => { b.onclick = () => openIdea(b.dataset.id); });
  document.querySelectorAll(".remove-idea").forEach((b) => { b.onclick = () => removeIdea(b.dataset.id); });
}

function renderWeights() {
  const total = Object.values(state.weights).reduce((a, b) => a + Number(b), 0);
  $("weightTotal").textContent = `${total}% total weight${total !== 100 ? " · scores normalized" : ""}`;
  $("weightsGrid").innerHTML = CATEGORIES.map((c) => `
    <div class="weight-control">
      <label for="weight-${c.key}"><span>${c.label}</span><b>${state.weights[c.key]}%</b></label>
      <input id="weight-${c.key}" data-key="${c.key}" type="range" min="0" max="30" step="5" value="${state.weights[c.key]}">
    </div>
  `).join("");
  document.querySelectorAll(".weight-control input").forEach((input) => {
    input.oninput = () => {
      state.weights[input.dataset.key] = Number(input.value);
      render();
    };
  });
}

function renderRanking() {
  const list = ranked();
  $("rankingList").innerHTML = list.length
    ? list.map((idea, i) => `
      <div class="rank-row">
        <span class="rank-num">${String(i + 1).padStart(2, "0")}</span>
        <div class="rank-name">
          <h3>${escapeHTML(idea.name)}</h3>
          <p>Strong in ${strengths(idea)}. Weakest: ${risk(idea)}.</p>
        </div>
        <strong class="rank-score">${score(idea)}</strong>
      </div>
    `).join("")
    : "<p>No ideas to rank yet.</p>";
}

function renderComparison() {
  const top = ranked().slice(0, 3);
  $("comparisonGrid").innerHTML = top.length
    ? top.map((idea, i) => `
      <article class="compare-card">
        <span class="compare-rank">#${i + 1}</span>
        <h3>${escapeHTML(idea.name)}</h3>
        <p>${escapeHTML(idea.description)}</p>
        <div class="compare-total">${score(idea)}</div>
        ${CATEGORIES.map((c) => `
          <div class="metric">
            <span>${c.label}</span>
            <div class="metric-line"><i style="width:${idea.scores[c.key] * 20}%"></i></div>
            <b>${idea.scores[c.key]}/5</b>
          </div>
        `).join("")}
        <p class="tradeoff"><strong>Trade-off.</strong> Strong ${escapeHTML(strengths(idea))}. Weakest signal is ${escapeHTML(risk(idea))}.</p>
      </article>
    `).join("")
    : '<div class="empty-state"><h3>Add ideas to compare.</h3></div>';
}

function defaultPlan(idea) {
  return {
    customer: "Small operators solving this with spreadsheets, notes, or messages",
    assumption: `${idea.name} solves a problem urgent enough that someone will change their current process`,
    test: "Interview 5 target customers and show them a clickable concept",
    signal: "3 of 5 ask to try it or agree to a paid pilot",
    budget: "$150 max",
    milestone: "First validated customer signal",
  };
}

function defaultActions(idea) {
  return [
    `Write a one-sentence problem statement for ${idea.name}`,
    "List 15 people who match the target customer",
    "Invite the first five people to a 20-minute interview",
    "Run three problem interviews without pitching",
    "Summarize repeated pains and current workarounds",
    "Show the smallest solution concept to five prospects",
    "Review the success signal and decide: proceed, adjust, or stop",
  ];
}

function ensurePlan(id) {
  const idea = state.ideas.find((i) => i.id === id);
  if (!idea) return;
  if (!state.plans[id]) state.plans[id] = defaultPlan(idea);
  if (!state.actions[id]) state.actions[id] = defaultActions(idea);
  if (!state.completed[id]) state.completed[id] = Array(7).fill(false);
}

function renderCommitment() {
  if (state.selectedId && !state.ideas.some((i) => i.id === state.selectedId)) state.selectedId = "";
  $("selectedIdea").innerHTML = '<option value="">Choose one idea…</option>' + state.ideas.map((i) =>
    `<option value="${i.id}" ${state.selectedId === i.id ? "selected" : ""}>${escapeHTML(i.name)} · ${score(i)}/100</option>`
  ).join("");
  $("commitmentWindow").value = state.window;

  const idea = state.ideas.find((i) => i.id === state.selectedId);
  if (!idea) {
    $("commitStatement").textContent = "Select one idea to write the plan.";
    $("planTitle").textContent = "Choose an idea";
    $("planFields").innerHTML = "<p>Select one idea to create the validation brief.</p>";
    $("actionList").innerHTML = "";
    updateProgress([]);
    return;
  }

  ensurePlan(idea.id);
  const plan = state.plans[idea.id];
  $("commitStatement").innerHTML = `For the next <strong>${escapeHTML(state.window)}</strong>, test <strong>${escapeHTML(idea.name)}</strong>.`;
  $("planTitle").textContent = idea.name;

  const fields = [
    ["customer", "Target customer", "Who feels this pain?"],
    ["assumption", "Riskiest assumption", "What must be true?"],
    ["test", "Smallest test", "What creates evidence fastest?"],
    ["signal", "Success signal", "What result justifies another step?"],
    ["budget", "Budget cap", "What will you spend?"],
    ["milestone", "First milestone", "What are you progressing toward?"],
  ];
  $("planFields").innerHTML = fields.map(([key, label, placeholder]) => `
    <div class="plan-field">
      <label for="plan-${key}">${label}</label>
      <textarea id="plan-${key}" data-key="${key}" rows="2" placeholder="${placeholder}">${escapeHTML(plan[key] || "")}</textarea>
    </div>
  `).join("");

  document.querySelectorAll(".plan-field input, .plan-field textarea").forEach((el) => {
    el.oninput = () => {
      state.plans[idea.id][el.dataset.key] = el.value;
      save();
    };
  });

  const actions = state.actions[idea.id];
  const done = state.completed[idea.id];
  $("actionList").innerHTML = actions.map((action, i) => `
    <label class="action-item ${done[i] ? "done" : ""}">
      <input type="checkbox" data-index="${i}" ${done[i] ? "checked" : ""}>
      <span>${String(i + 1).padStart(2, "0")}</span>
      <textarea rows="2" aria-label="Action ${i + 1}" data-action="${i}">${escapeHTML(action)}</textarea>
    </label>
  `).join("");

  document.querySelectorAll(".action-item input[type=checkbox]").forEach((el) => {
    el.onchange = () => {
      state.completed[idea.id][el.dataset.index] = el.checked;
      renderCommitment();
      save();
    };
  });
  document.querySelectorAll("[data-action]").forEach((el) => {
    el.oninput = () => {
      state.actions[idea.id][el.dataset.action] = el.value;
      save();
    };
  });
  updateProgress(done);
}

function updateProgress(done) {
  const complete = done.filter(Boolean).length;
  const pct = done.length ? Math.round((complete / 7) * 100) : 0;
  $("progressValue").textContent = `${pct}%`;
  $("progressRing").style.setProperty("--progress", `${pct}%`);
  $("actionProgress").textContent = `${complete} of 7 complete`;
}

function openIdea(id = "") {
  const idea = state.ideas.find((i) => i.id === id);
  $("editingId").value = id;
  $("dialogEyebrow").textContent = idea ? "Edit idea" : "New idea";
  $("dialogTitle").textContent = idea ? "Update idea" : "Add an idea";
  $("ideaName").value = idea?.name || "";
  $("ideaDescription").value = idea?.description || "";
  $("scoringForm").innerHTML = CATEGORIES.map((c) => `
    <div class="score-control">
      <div class="score-label">
        <span>${c.label}</span>
        <small id="value-${c.key}">${idea?.scores[c.key] || 3} / 5</small>
      </div>
      <input name="${c.key}" type="range" min="1" max="5" value="${idea?.scores[c.key] || 3}" aria-label="${c.label}: ${c.hint}">
    </div>
  `).join("");
  document.querySelectorAll(".score-control input").forEach((el) => {
    el.oninput = () => { $(`value-${el.name}`).textContent = `${el.value} / 5`; };
  });
  $("formError").textContent = "";
  $("ideaDialog").showModal();
}

function removeIdea(id) {
  const idea = state.ideas.find((i) => i.id === id);
  if (!idea || !confirm(`Remove “${idea.name}”?`)) return;
  state.ideas = state.ideas.filter((i) => i.id !== id);
  if (state.selectedId === id) state.selectedId = "";
  render();
}

$("addIdeaButton").onclick = () => openIdea();
$("cancelDialog").onclick = () => $("ideaDialog").close();
$("closeDialog").onclick = () => $("ideaDialog").close();
$("ideaForm").onsubmit = (e) => {
  e.preventDefault();
  const name = $("ideaName").value.trim();
  const description = $("ideaDescription").value.trim();
  if (!name || !description) {
    $("formError").textContent = "Add a name and a one-sentence description.";
    return;
  }
  const id = $("editingId").value || `idea-${Date.now()}`;
  const scores = Object.fromEntries(CATEGORIES.map((c) => [c.key, Number(document.querySelector(`[name="${c.key}"]`).value)]));
  const existing = state.ideas.findIndex((i) => i.id === id);
  const idea = { id, name, description, scores };
  if (existing >= 0) state.ideas[existing] = idea;
  else state.ideas.push(idea);
  $("ideaDialog").close();
  render();
};
$("selectedIdea").onchange = (e) => {
  state.selectedId = e.target.value;
  if (state.selectedId) ensurePlan(state.selectedId);
  render();
};
$("commitmentWindow").onchange = (e) => {
  state.window = e.target.value;
  render();
};
$("resetButton").onclick = () => $("resetDialog").showModal();
$("confirmReset").onclick = (e) => {
  e.preventDefault();
  state = {
    ideas: [],
    weights: { ...SAMPLE.weights },
    selectedId: "",
    window: "14 days",
    plans: {},
    completed: {},
    actions: {},
  };
  $("resetDialog").close();
  render();
};

render();
