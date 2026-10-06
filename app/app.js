const state = {
  view: "home",
  contextId: null,
  symptomId: null,
  stepIndex: 0,
  data: null,
};

const els = {
  views: {
    home: document.getElementById("view-home"),
    troubleshoot: document.getElementById("view-troubleshoot"),
    reference: document.getElementById("view-reference"),
    checklist: document.getElementById("view-checklist"),
  },
  stage: document.getElementById("wizard-stage"),
  progress: document.getElementById("wizard-progress"),
  safetyStrip: document.getElementById("safety-strip"),
  safetyList: document.getElementById("safety-list"),
  copyBtn: document.getElementById("copy-checklist"),
  copyStatus: document.getElementById("copy-status"),
  form: document.getElementById("checklist-form"),
};

async function loadData() {
  const res = await fetch("./data/procedures.json");
  if (!res.ok) throw new Error("Could not load procedures.json");
  state.data = await res.json();
  els.safetyList.innerHTML = state.data.safetyRules
    .map((rule) => `<li>${escapeHtml(rule)}</li>`)
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setView(view) {
  state.view = view;
  Object.entries(els.views).forEach(([name, node]) => {
    if (!node) return;
    const isHome = name === "home";
    if (isHome) {
      node.classList.toggle("hidden", view !== "home");
      node.hidden = view !== "home";
    } else {
      node.classList.toggle("hidden", view !== name);
    }
  });

  document.querySelectorAll("[data-nav]").forEach((btn) => {
    const target = btn.getAttribute("data-nav");
    if (btn.tagName === "BUTTON" && btn.closest(".topnav")) {
      btn.setAttribute("aria-current", target === view ? "page" : "false");
    }
  });

  if (view === "troubleshoot") {
    els.safetyStrip.hidden = false;
    renderWizard();
  } else {
    els.safetyStrip.hidden = true;
  }

  if (view !== "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function renderProgress() {
  const items = ["Context", "Symptom", "Steps"];
  let current = 0;
  if (state.contextId) current = 1;
  if (state.symptomId) current = 2;

  els.progress.innerHTML = items
    .map((label, index) => {
      const cls = index < current ? "done" : index === current ? "current" : "";
      return `<li class="${cls}">${index + 1}. ${label}</li>`;
    })
    .join("");
}

function renderWizard() {
  renderProgress();

  if (!state.contextId) {
    els.stage.innerHTML = `
      <p class="step-meta">Where is the unlisted alarm presenting?</p>
      <div class="choice-grid">
        ${state.data.contexts
          .map(
            (ctx) => `
          <button type="button" class="choice" data-choose-context="${ctx.id}">
            <h3>${escapeHtml(ctx.title)}</h3>
            <p>${escapeHtml(ctx.summary)}</p>
          </button>`
          )
          .join("")}
      </div>`;
    return;
  }

  const context = state.data.contexts.find((c) => c.id === state.contextId);
  if (!state.symptomId) {
    els.stage.innerHTML = `
      <p class="step-meta">${escapeHtml(context.short)} · pick the closest symptom</p>
      <div class="choice-grid">
        ${context.symptoms
          .map(
            (sym) => `
          <button type="button" class="choice" data-choose-symptom="${sym.id}">
            <h3>${escapeHtml(sym.title)}</h3>
            <p>${escapeHtml(sym.detail)}</p>
          </button>`
          )
          .join("")}
      </div>
      <div class="wizard-nav">
        <button type="button" class="btn ghost" data-wizard="back">Back</button>
      </div>`;
    return;
  }

  const symptom = context.symptoms.find((s) => s.id === state.symptomId);
  const steps = state.data.steps[state.symptomId] || [];
  const step = steps[state.stepIndex];
  const isLast = state.stepIndex >= steps.length - 1;

  if (!step) {
    els.stage.innerHTML = `<p>No steps found for this path.</p>`;
    return;
  }

  els.stage.innerHTML = `
    <div class="step-block">
      <p class="step-meta">${escapeHtml(context.title)} → ${escapeHtml(symptom.title)} · Step ${state.stepIndex + 1} of ${steps.length}</p>
      <h3>${escapeHtml(step.title)}</h3>
      <h4>Do</h4>
      <ul>${step.actions.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>
      <h4>Check</h4>
      <ul>${step.checks.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
      ${
        step.ifMissing
          ? `<div class="callout"><strong>If documentation is missing:</strong> ${escapeHtml(step.ifMissing)}</div>`
          : ""
      }
      <div class="wizard-nav">
        <button type="button" class="btn ghost" data-wizard="back">Back</button>
        ${
          isLast
            ? `<button type="button" class="btn primary" data-wizard="restart">Start another path</button>
               <button type="button" class="btn ghost" data-nav="checklist">Open checklist</button>`
            : `<button type="button" class="btn primary" data-wizard="next">Next step</button>`
        }
      </div>
    </div>`;
}

function wizardBack() {
  if (state.symptomId) {
    if (state.stepIndex > 0) {
      state.stepIndex -= 1;
    } else {
      state.symptomId = null;
      state.stepIndex = 0;
    }
  } else if (state.contextId) {
    state.contextId = null;
  }
  renderWizard();
}

function wizardNext() {
  const steps = state.data.steps[state.symptomId] || [];
  if (state.stepIndex < steps.length - 1) {
    state.stepIndex += 1;
    renderWizard();
  }
}

function wizardRestart() {
  state.contextId = null;
  state.symptomId = null;
  state.stepIndex = 0;
  renderWizard();
}

function buildChecklistSummary(formData) {
  const lines = [
    "UNLISTED ALARM INVESTIGATION",
    `System: ${formData.get("system") || "—"}`,
    `Identifier/tag: ${formData.get("identifier") || "—"}`,
    `Source: ${formData.get("source") || "—"}`,
    `Priority/category: ${formData.get("priority") || "—"}`,
    `When: ${formData.get("when") || "—"}`,
    `Context: ${formData.get("context") || "—"}`,
    "",
    "Evidence:",
    `- Screen/log export: ${formData.get("ev_photo") ? "yes" : "no"}`,
    `- Maker catalogue: ${formData.get("ev_maker") ? "yes" : "no"}`,
    `- Ship alarm list/IOM: ${formData.get("ev_list") ? "yes" : "no"}`,
    `- Field comparison: ${formData.get("ev_field") ? "yes" : "no"}`,
    `- Power/earth/comms: ${formData.get("ev_power") ? "yes" : "no"}`,
    "",
    `Observed condition: ${formData.get("condition") || "—"}`,
    `Corrective action: ${formData.get("action") || "—"}`,
    `Inhibit/set-point change: ${formData.get("inhibit") || "—"}`,
    `Follow-up owner: ${formData.get("owner") || "—"}`,
  ];
  return lines.join("\n");
}

async function copyChecklist() {
  const summary = buildChecklistSummary(new FormData(els.form));
  try {
    await navigator.clipboard.writeText(summary);
    els.copyStatus.textContent = "Summary copied.";
  } catch {
    els.copyStatus.textContent = "Copy failed — select and copy manually.";
  }
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    event.preventDefault();
    const target = nav.getAttribute("data-nav");
    if (target === "troubleshoot" && !state.contextId && !state.symptomId) {
      state.stepIndex = 0;
    }
    setView(target === "home" ? "home" : target);
    return;
  }

  const contextBtn = event.target.closest("[data-choose-context]");
  if (contextBtn) {
    state.contextId = contextBtn.getAttribute("data-choose-context");
    state.symptomId = null;
    state.stepIndex = 0;
    renderWizard();
    return;
  }

  const symptomBtn = event.target.closest("[data-choose-symptom]");
  if (symptomBtn) {
    state.symptomId = symptomBtn.getAttribute("data-choose-symptom");
    state.stepIndex = 0;
    renderWizard();
    return;
  }

  const wizard = event.target.closest("[data-wizard]");
  if (wizard) {
    const action = wizard.getAttribute("data-wizard");
    if (action === "back") wizardBack();
    if (action === "next") wizardNext();
    if (action === "restart") wizardRestart();
  }
});

els.copyBtn?.addEventListener("click", copyChecklist);

els.form?.addEventListener("reset", () => {
  els.copyStatus.textContent = "";
});

loadData()
  .then(() => setView("home"))
  .catch((err) => {
    console.error(err);
    els.stage.innerHTML = `<p>Failed to load troubleshooting data. Open this app over a local server so <code>data/procedures.json</code> can load.</p>`;
  });
