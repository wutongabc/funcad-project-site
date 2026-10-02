const paperData = {
  workflows: [
    { label: "Requirements only", support: "Requirements; agent-chosen verification", astra: 1, grok: 3 },
    { label: "Simulation tools", support: "Requirements, simulator, and tool guidance", astra: 8, grok: 10 },
    { label: "Full harness", support: "Requirement-level tests and diagnostic feedback", astra: 22, grok: 19 },
    { label: "Binary feedback", support: "Full workflow with pass/fail simulation feedback", astra: 0, grok: 8 },
  ],
  models: [
    { label: "Astra", model: "gpt-6-astra", wrapper: "Codex · High", passed: "22/46", minutes: "118.4 min", tokens: "23.87M", cost: "$42.55", value: 22 },
    { label: "Kimi", model: "kimi-code/k3", wrapper: "Kimi CLI · High*", passed: "14/46", minutes: "173.3 min", tokens: "6.85M", cost: "$3.62", value: 14 },
    { label: "Fable", model: "claude-fable-5-1-thinking-high", wrapper: "Cursor · High", passed: "32/46", minutes: "117.7 min", tokens: "11.00M", cost: "$11.45", value: 32 },
    { label: "Grok", model: "cursor-grok-4.6-xhigh", wrapper: "Cursor · Extra high", passed: "19/46", minutes: "164.9 min", tokens: "21.69M", cost: "$13.40", value: 19 },
    { label: "Grok + history", model: "cursor-grok-4.6-xhigh", wrapper: "Cursor · Extra high · ≤8 attempts", passed: "36/46", minutes: "220.6 min", tokens: "40.93M", cost: "$24.43", value: 36 },
  ],
  tasks: [
    ["BM01", "Hinged toolbox", "topology geometry"],
    ["BM02", "Rack-and-pinion gate", "motion topology contact"],
    ["BM03", "Four-bar windshield wiper", "motion topology"],
    ["BM04", "Hand-cranked egg beater", "motion topology"],
    ["BM05", "Automatically locking utility knife", "contact topology"],
    ["BM06", "Folding drying rack", "topology geometry"],
    ["BM07", "Pedal-driven cargo bicycle", "motion topology complexity"],
    ["BM08", "Pedal-operated trash bin", "contact complexity"],
    ["BM09", "Purely mechanical alarm clock", "complexity contact"],
    ["BM10", "Kitchen tongs", "contact"],
    ["BM11", "Retractable ballpoint pen", "complexity"],
    ["BM12", "Nail clipper", "motion contact"],
    ["BM13", "One-way ratcheting screwdriver", "motion contact"],
    ["BM14", "Linearly actuated scissor lift", "motion topology"],
    ["BM15", "Equal-arm balance", "contact complexity"],
    ["BM16", "Toggle clamp or press", "topology contact"],
    ["BM17", "Dry piston-pump mechanism", "motion"],
    ["BM18", "Three-digit mechanical combination lock", "complexity contact"],
    ["BM19", "Two-digit mechanical counter", "complexity"],
    ["BM20", "Three-ball batch dispenser", "contact complexity"],
    ["BM21", "Gravity-powered timer", "motion complexity"],
    ["BM22", "Crank-slider pushrod", "motion"],
    ["BM23", "Gravity-pawl ratchet turntable", "motion contact"],
    ["BM24", "Sliding-bolt door", "contact topology"],
    ["BM25", "Three-stage gear reducer", "motion topology"],
    ["BM42", "Desktop display turntable", "motion"],
    ["BM45", "Small swing door", "topology"],
    ["BM47", "Tilting desktop mirror stand", "motion geometry"],
    ["BM49", "Folding wall hook", "topology contact"],
    ["BM50", "Spring clothespin", "contact"],
    ["BM51", "Mechanical scissors", "motion contact"],
    ["BM52", "Ratchet hand winch", "motion contact"],
    ["BM53", "Spring latch door handle lock", "contact topology"],
    ["BM54", "Reversible dual-pawl ratchet wrench", "motion contact"],
    ["BM56", "Full-cycle ratchet crimping pliers", "motion contact geometry"],
    ["BM57", "Geneva indexing table with overload clutch", "motion topology complexity"],
    ["BM58", "Shopping trolley with a folding handle", "topology complexity"],
    ["BM59", "Mechanical 4×4×4 twist puzzle cube", "topology geometry"],
    ["BM60", "Twin-cylinder engine linkage", "motion topology"],
    ["BM62", "Four-station intermittent indexing table", "motion topology complexity"],
    ["W05", "Synchronized parallel gripper", "contact topology"],
    ["W07", "Releasable reduction winch with reverse locking", "motion contact"],
    ["W09", "Baby stroller", "complexity geometry"],
    ["W10", "Height-adjustable tilting worktable", "topology complexity"],
    ["W11", "Coin sorting and counting machine", "contact complexity"],
    ["W12", "Music box with interchangeable tunes", "complexity contact"],
  ].map(([id, title, tags]) => ({ id, title, tags: tags.split(" ") })),
};

const tagLabels = {
  all: "All families",
  motion: "Motion",
  topology: "Topology",
  complexity: "Complexity",
  contact: "Contact",
  geometry: "Geometry",
};

const previewSources = {
  BM04: ["preview-BM04.png", "Astra"],
  BM08: ["preview-BM08.png", "Astra"],
  BM11: ["preview-BM11.png", "Fable · HF"],
  BM14: ["preview-BM14.png", "Grok"],
  BM16: ["preview-BM16.png", "Fable · HF"],
  BM20: ["preview-BM20.png", "Astra"],
  BM21: ["preview-BM21.png", "Astra"],
  BM23: ["preview-BM23.png", "Fable · HF"],
  BM45: ["preview-BM45.png", "Astra"],
  BM49: ["preview-BM49.png", "Grok"],
  BM50: ["preview-BM50.png", "Fable · HF"],
  BM52: ["preview-BM52.png", "Fable · HF"],
  BM56: ["preview-BM56.png", "Astra"],
  BM59: ["preview-BM59.png", "Astra"],
  BM60: ["preview-BM60.png", "Astra"],
  W09: ["preview-W09.png", "Fable · HF"],
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCharts() {
  const chart = document.querySelector("#workflow-chart");
  chart.innerHTML = paperData.workflows.map((item) => `
    <div class="bar-row">
      <span class="bar-label">${escapeHtml(item.label)}</span>
      <div class="bar-track" aria-label="${escapeHtml(item.label)}: Astra ${item.astra} and Grok ${item.grok} tasks">
        <div class="bar-fill astra" style="width: ${(item.astra / 46) * 100}%"></div>
        <div class="bar-fill grok" style="width: ${(item.grok / 46) * 100}%"></div>
      </div>
      <span class="bar-value">${item.astra}/${item.grok}</span>
    </div>
  `).join("");

  document.querySelector("#model-table").innerHTML = paperData.models.map((item) => `
    <tr><td class="agent-cell"><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.model)} · ${escapeHtml(item.wrapper)}</small></td><td>${escapeHtml(item.passed)}</td><td>${escapeHtml(item.minutes)}</td><td>${escapeHtml(item.tokens)}</td><td>${escapeHtml(item.cost)}</td></tr>
  `).join("");

  document.querySelector("#comparison-grid").innerHTML = [
    '<div class="comparison-head">Workflow</div><div class="comparison-head">Astra</div><div class="comparison-head">Grok</div>',
    ...paperData.workflows.flatMap((item) => [
      `<div class="workflow-name">${escapeHtml(item.label)}<small>${escapeHtml(item.support)}</small></div>`,
      `<div>${item.astra ? `<span class="pass-mark">${item.astra}/46</span>` : '<span class="partial-mark">0/46</span>'}</div>`,
      `<div>${item.grok ? `<span class="pass-mark">${item.grok}/46</span>` : '<span class="partial-mark">0/46</span>'}</div>`,
    ]),
  ].join("");
}

function renderBenchmark(filter = "all", reveal = false) {
  if (!reveal) {
    document.querySelector("#benchmark-count").textContent = "46 registered families · choose a lens to reveal the cards";
    document.querySelector("#benchmark-grid").innerHTML = '<div class="benchmark-empty">Family cards are hidden until you select a filter above.</div>';
    return;
  }
  const items = filter === "all" ? paperData.tasks : paperData.tasks.filter((item) => item.tags.includes(filter));
  document.querySelector("#benchmark-count").textContent = `${items.length} of 46 registered families`;
  document.querySelector("#benchmark-grid").innerHTML = items.map((item) => `
    <details class="benchmark-card">
      <summary>
        <span class="family-id">${escapeHtml(item.id)}</span>
        <span class="benchmark-title">${escapeHtml(item.title)}</span>
        <span class="task-tags">${item.tags.map((tag) => `<span>${escapeHtml(tagLabels[tag])}</span>`).join("")}</span>
        <span class="expand-icon" aria-hidden="true">+</span>
      </summary>
      <div class="benchmark-detail">
        ${previewSources[item.id] ? `<figure class="benchmark-preview"><img src="assets/family-previews/${escapeHtml(previewSources[item.id][0])}" alt="Preview of ${escapeHtml(item.title)} from the ${escapeHtml(previewSources[item.id][1])} run" loading="lazy" /><figcaption>${escapeHtml(previewSources[item.id][1])} preview</figcaption></figure>` : '<div class="benchmark-preview benchmark-preview-empty">No family-specific preview is included in the local paper gallery.</div>'}
        <div class="benchmark-detail-copy"><strong>${escapeHtml(item.title)}</strong><p>Registered family ${escapeHtml(item.id)}. Tags: ${item.tags.map((tag) => escapeHtml(tagLabels[tag])).join(", ")}.</p></div>
      </div>
    </details>
  `).join("");
}

function renderFilters() {
  const filters = document.querySelector("#benchmark-filters");
  filters.innerHTML = Object.entries(tagLabels).map(([key, label], index) => `
    <button class="filter-button" type="button" data-filter="${key}" aria-pressed="false">${label}</button>
  `).join("");
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    filters.querySelectorAll(".filter-button").forEach((node) => {
      const active = node === button;
      node.classList.toggle("active", active);
      node.setAttribute("aria-pressed", String(active));
    });
    renderBenchmark(button.dataset.filter, true);
  });
}

function setupTheme() {
  const toggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let saved = "";
  try { saved = localStorage.getItem("funcad-theme") || ""; } catch (_) { /* file:// may not expose storage */ }
  const applyTheme = (dark) => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    toggle.setAttribute("aria-pressed", String(dark));
    if (themeColor) themeColor.setAttribute("content", dark ? "#101a1d" : "#f3f2ed");
  };
  applyTheme(saved === "dark");
  toggle.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    applyTheme(dark);
    try { localStorage.setItem("funcad-theme", dark ? "dark" : "light"); } catch (_) { /* optional */ }
  });
}

function setupReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  elements.forEach((element) => {
    const delay = element.dataset.delay;
    if (delay) element.style.transitionDelay = `${delay}ms`;
  });
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

function setupComparisonLinks() {
  const href = window.location.hostname === "zigeng.duckdns.org" ? "/harness/demo/" : "/comparison_demo/viewer/";
  document.querySelectorAll('a[href="/harness/demo/"]').forEach((link) => { link.href = href; });
}

renderCharts();
renderFilters();
renderBenchmark();
setupTheme();
setupReveal();
setupComparisonLinks();
