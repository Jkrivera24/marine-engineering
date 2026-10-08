(() => {
  const STORAGE_KEY = "vessel-macro-log-v1";
  const MEALS = ["breakfast", "lunch", "dinner", "snack"];
  const MEAL_LABELS = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snacks",
  };

  const defaultState = () => ({
    goals: {
      kcal: 2000,
      protein: 140,
      startKg: 80,
      goalKg: 72,
    },
    customFoods: [],
    days: {},
    weights: [],
    // workoutLogs: { "2026-10-07": { workoutId, exercises: { id: { done, weight, reps } }, completedAt } }
    workoutLogs: {},
  });

  let state = load();
  let selectedDate = todayKey();
  let shipExpanded = false;
  let toastTimer = null;
  let activePanel = "food";
  let activeWorkoutId = suggestWorkoutId();

  const $ = (id) => document.getElementById(id);
  const plan = () => window.WORKOUT_PLAN || { workouts: [], schedule: [], nutrition: [] };

  function todayKey() {
    return isoDate(new Date());
  }

  function isoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function parseKey(key) {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function shiftDate(key, delta) {
    const d = parseKey(key);
    d.setDate(d.getDate() + delta);
    return isoDate(d);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return {
        ...defaultState(),
        ...parsed,
        goals: { ...defaultState().goals, ...(parsed.goals || {}) },
        workoutLogs: parsed.workoutLogs || {},
      };
    } catch {
      return defaultState();
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function dayBucket(date = selectedDate) {
    if (!state.days[date]) state.days[date] = { entries: [], water: 0 };
    return state.days[date];
  }

  function workoutLog(date = selectedDate, workoutId = activeWorkoutId) {
    const key = `${date}:${workoutId}`;
    if (!state.workoutLogs[key]) {
      state.workoutLogs[key] = {
        date,
        workoutId,
        exercises: {},
        completedAt: null,
      };
    }
    return state.workoutLogs[key];
  }

  function allFoods() {
    return [...(window.FOOD_DB || []), ...state.customFoods];
  }

  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 1800);
  }

  function guessMeal() {
    const h = new Date().getHours();
    if (h < 10) return "breakfast";
    if (h < 15) return "lunch";
    if (h < 20) return "dinner";
    return "snack";
  }

  function suggestWorkoutId() {
    const map = { 1: "day1", 2: "day2", 4: "day4", 5: "day5" };
    return map[new Date().getDay()] || "day1";
  }

  function getWorkout(id) {
    return plan().workouts.find((w) => w.id === id) || plan().workouts[0];
  }

  function addEntry(food, meal = guessMeal()) {
    const day = dayBucket();
    day.entries.push({
      id: crypto.randomUUID(),
      foodId: food.id || null,
      name: food.name,
      kcal: Number(food.kcal) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0,
      meal,
      at: new Date().toISOString(),
    });
    save();
    render();
    toast(`Added ${food.name}`);
  }

  function removeEntry(id) {
    const day = dayBucket();
    day.entries = day.entries.filter((e) => e.id !== id);
    save();
    render();
  }

  function totals(date = selectedDate) {
    const day = dayBucket(date);
    return day.entries.reduce(
      (acc, e) => {
        acc.kcal += e.kcal;
        acc.protein += e.protein;
        acc.carbs += e.carbs;
        acc.fat += e.fat;
        return acc;
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0, water: day.water || 0 }
    );
  }

  function latestWeight() {
    if (!state.weights.length) return null;
    return [...state.weights].sort((a, b) => b.date.localeCompare(a.date))[0];
  }

  function formatDateLabel(key) {
    if (key === todayKey()) return "Today";
    if (key === shiftDate(todayKey(), -1)) return "Yesterday";
    return parseKey(key).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function openSheet(name) {
    $(`${name}-backdrop`).hidden = false;
    $(`${name}-sheet`).hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeSheet(name) {
    $(`${name}-backdrop`).hidden = true;
    $(`${name}-sheet`).hidden = true;
    if (
      $("food-backdrop").hidden &&
      $("weight-backdrop").hidden &&
      $("settings-backdrop").hidden
    ) {
      document.body.style.overflow = "";
    }
  }

  function setPanel(name) {
    activePanel = name;
    document.querySelectorAll(".panel").forEach((p) => {
      p.hidden = p.dataset.panel !== name;
    });
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.nav === name);
    });
    $("date-nav").hidden = name !== "food";
    render();
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function youtubeId(url) {
    if (!url) return "";
    const m = String(url).match(/[?&]v=([\w-]{11})/) || String(url).match(/youtu\.be\/([\w-]{11})/);
    return m ? m[1] : "";
  }

  /* ---------- FOOD RENDER ---------- */
  function renderShipChips() {
    const wrap = $("ship-food-chips");
    if (!wrap) return;
    const foods = allFoods().filter((f) => (f.tags || []).includes("ship"));
    wrap.classList.toggle("collapsed", !shipExpanded);
    wrap.innerHTML = foods
      .map(
        (f) =>
          `<button type="button" class="chip" data-food-id="${f.id}">${escapeHtml(
            f.name.replace(/^Mess:\s*/, "")
          )} <b>${Math.round(f.kcal)}</b></button>`
      )
      .join("");
    $("toggle-ship-foods").textContent = shipExpanded ? "Show less" : "Show all";
  }

  function renderDiary() {
    const day = dayBucket();
    const host = $("meal-sections");
    const has = day.entries.length > 0;
    $("empty-hint").hidden = has;
    $("entry-count").textContent = `${day.entries.length} item${day.entries.length === 1 ? "" : "s"}`;
    host.innerHTML = MEALS.map((meal) => {
      const items = day.entries.filter((e) => e.meal === meal);
      if (!items.length) return "";
      const mealKcal = items.reduce((s, e) => s + e.kcal, 0);
      return `
        <div class="meal-block">
          <p class="meal-title">${MEAL_LABELS[meal]} · ${Math.round(mealKcal)} kcal</p>
          ${items
            .map(
              (e) => `
            <div class="entry">
              <div>
                <div class="entry-name">${escapeHtml(e.name)}</div>
                <div class="entry-meta">P ${round1(e.protein)}g · C ${round1(e.carbs)}g · F ${round1(e.fat)}g</div>
              </div>
              <div class="entry-cals">${Math.round(e.kcal)}</div>
              <button type="button" class="entry-del" data-del="${e.id}" aria-label="Remove">&times;</button>
            </div>`
            )
            .join("")}
        </div>`;
    }).join("");
  }

  function renderMetrics() {
    const t = totals();
    const g = state.goals;
    const remaining = Math.round(g.kcal - t.kcal);
    const ring = $("cal-ring");
    const circ = 2 * Math.PI * 52;
    const used = Math.min(1, t.kcal / g.kcal);
    ring.style.strokeDasharray = String(circ);
    ring.style.strokeDashoffset = String(circ * (1 - used));
    ring.classList.toggle("over", t.kcal > g.kcal);
    $("cal-remaining").textContent = String(remaining);
    $("cal-summary").textContent = `${Math.round(t.kcal)} / ${g.kcal}`;
    $("pro-summary").textContent = `${round1(t.protein)} / ${g.protein} g`;
    $("cal-bar").style.width = `${Math.min(100, (t.kcal / g.kcal) * 100)}%`;
    $("pro-bar").style.width = `${Math.min(100, (t.protein / g.protein) * 100)}%`;
    $("carb-val").textContent = String(round1(t.carbs));
    $("fat-val").textContent = String(round1(t.fat));
    $("water-val").textContent = String(t.water);
    $("date-label").textContent = formatDateLabel(selectedDate);
  }

  function renderSearch(query) {
    const q = query.trim().toLowerCase();
    const results = allFoods()
      .filter((f) => !q || f.name.toLowerCase().includes(q))
      .slice(0, 40);
    $("search-results").innerHTML = results
      .map(
        (f) => `
      <button type="button" class="result-item" data-food-id="${f.id}">
        <div>
          <strong>${escapeHtml(f.name)}</strong>
          <span>P ${round1(f.protein)}g · C ${round1(f.carbs)}g · F ${round1(f.fat)}g</span>
        </div>
        <em>${Math.round(f.kcal)} kcal</em>
      </button>`
      )
      .join("");
  }

  /* ---------- TRAIN RENDER ---------- */
  function renderSchedule() {
    const list = $("schedule-list");
    if (!list) return;
    const todayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
    list.innerHTML = plan().schedule
      .map((row) => {
        const isToday =
          String(row.day).includes(todayName) ||
          (todayName === "Wed" && row.session.includes("Rest") && row.day === "Wed");
        const train = row.workoutId
          ? `<button type="button" class="text-btn schedule-open" data-open-workout="${row.workoutId}">Open</button>`
          : `<span class="muted">Rest</span>`;
        return `
          <div class="schedule-row ${isToday ? "is-today" : ""}">
            <div>
              <strong>${escapeHtml(row.day)}</strong>
              <span>${escapeHtml(row.session)} · ${escapeHtml(row.duration || "")}</span>
            </div>
            ${train}
          </div>`;
      })
      .join("");
  }

  function renderDayTabs() {
    const tabs = $("day-tabs");
    if (!tabs) return;
    tabs.innerHTML = plan()
      .workouts.map(
        (w) => `
      <button type="button" class="day-tab ${w.id === activeWorkoutId ? "active" : ""}" data-workout="${w.id}" role="tab" aria-selected="${w.id === activeWorkoutId}">
        <b>${escapeHtml(w.short)}</b>
        <span>${escapeHtml(w.focus)}</span>
      </button>`
      )
      .join("");
  }

  function renderWorkoutDetail() {
    const host = $("workout-detail");
    if (!host) return;
    const w = getWorkout(activeWorkoutId);
    if (!w) {
      host.innerHTML = "<p class='empty-hint'>Workout plan failed to load.</p>";
      return;
    }
    const log = workoutLog(selectedDate, w.id);
    const doneCount = w.exercises.filter((ex) => log.exercises[ex.id]?.done).length;
    const complete = Boolean(log.completedAt);

    host.innerHTML = `
      <div class="workout-head">
        <div>
          <h2>${escapeHtml(w.title)}</h2>
          <p class="lede">${escapeHtml(w.warmup || "")}</p>
        </div>
        <div class="workout-meta">
          <span>${escapeHtml(w.duration)}</span>
          <span>${doneCount}/${w.exercises.length} done</span>
        </div>
      </div>
      <div class="ex-list">
        ${w.exercises
          .map((ex) => {
            const row = log.exercises[ex.id] || { done: false, weight: "", reps: "" };
            const vid = youtubeId(ex.video);
            const thumb = vid
              ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`
              : "";
            return `
            <article class="ex-card ${row.done ? "is-done" : ""}" data-ex="${ex.id}">
              <div class="ex-top">
                <label class="check">
                  <input type="checkbox" data-ex-done="${ex.id}" ${row.done ? "checked" : ""} />
                  <span class="check-ui" aria-hidden="true"></span>
                </label>
                <div class="ex-copy">
                  <h3>${escapeHtml(ex.name)}</h3>
                  <p>${escapeHtml(ex.setsReps)} · rest ${escapeHtml(ex.rest || "-")}</p>
                  <p class="ex-cues">${escapeHtml(ex.cues || "")}</p>
                  <p class="ex-gear">${escapeHtml(ex.equipment || "")}</p>
                </div>
              </div>
              <div class="ex-tools">
                <label class="mini-field">Weight<input type="text" inputmode="decimal" data-ex-weight="${ex.id}" value="${escapeHtml(row.weight || "")}" placeholder="kg" /></label>
                <label class="mini-field">Reps<input type="text" inputmode="numeric" data-ex-reps="${ex.id}" value="${escapeHtml(row.reps || "")}" placeholder="e.g. 10" /></label>
                ${
                  ex.video
                    ? `<a class="video-btn" href="${escapeHtml(ex.video)}" target="_blank" rel="noopener noreferrer">
                        ${thumb ? `<img src="${thumb}" alt="" loading="lazy" />` : ""}
                        <span>Form video</span>
                      </a>`
                    : ""
                }
              </div>
            </article>`;
          })
          .join("")}
      </div>
      <p class="workout-notes">${escapeHtml(w.notes || "")}</p>
      <button type="button" class="primary-btn full" id="complete-workout">
        ${complete ? "Workout saved ? — tap to update" : "Mark workout complete"}
      </button>
    `;
  }

  /* ---------- PROGRESS RENDER ---------- */
  function renderWeight() {
    const latest = latestWeight();
    const { startKg, goalKg } = state.goals;
    const span = Math.max(0.1, startKg - goalKg);
    if (!latest) {
      $("weight-latest").textContent = "—";
      $("weight-bar").style.width = "0%";
      $("weight-note").textContent = "Log your first weigh-in to track progress to 72 kg.";
    } else {
      const lost = startKg - latest.kg;
      const pct = Math.max(0, Math.min(100, (lost / span) * 100));
      const toGo = Math.max(0, latest.kg - goalKg);
      $("weight-latest").textContent = `${latest.kg.toFixed(1)} kg`;
      $("weight-bar").style.width = `${pct}%`;
      $("weight-note").textContent =
        toGo <= 0
          ? "Goal reached — hold and recomp."
          : `${lost.toFixed(1)} kg down · ${toGo.toFixed(1)} kg to goal`;
    }

    const hist = $("weight-history");
    if (hist) {
      hist.innerHTML = [...state.weights]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 12)
        .map((w) => `<li><span>${w.date}</span><strong>${w.kg.toFixed(1)} kg</strong></li>`)
        .join("");
    }
  }

  function renderSessions() {
    const list = $("session-list");
    const empty = $("session-empty");
    const sessions = Object.values(state.workoutLogs)
      .filter((s) => s.completedAt)
      .sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)));
    $("session-count").textContent = String(sessions.length);
    empty.hidden = sessions.length > 0;
    list.innerHTML = sessions
      .slice(0, 20)
      .map((s) => {
        const w = getWorkout(s.workoutId);
        const done = Object.values(s.exercises || {}).filter((e) => e.done).length;
        const total = w?.exercises?.length || 0;
        return `<li>
          <div>
            <strong>${escapeHtml(w?.short || s.workoutId)}</strong>
            <span>${escapeHtml(s.date)} · ${done}/${total} exercises</span>
          </div>
          <button type="button" class="text-btn" data-open-workout="${s.workoutId}" data-jump-train="1">View</button>
        </li>`;
      })
      .join("");
  }

  function renderNutrition() {
    const host = $("nutrition-list");
    if (!host) return;
    host.innerHTML = (plan().nutrition || [])
      .map(
        (n) => `
      <div class="tip-row">
        <strong>${escapeHtml(n.topic)}</strong>
        <span>${escapeHtml(n.guide)}</span>
      </div>`
      )
      .join("");
  }

  function render() {
    renderMetrics();
    renderShipChips();
    renderDiary();
    renderWeight();
    if (activePanel === "train") {
      renderSchedule();
      renderDayTabs();
      renderWorkoutDetail();
    }
    if (activePanel === "progress") {
      renderSessions();
      renderNutrition();
    }
  }

  function findFood(id) {
    return allFoods().find((f) => f.id === id);
  }

  function openWeightSheet() {
    $("weight-date").value = todayKey();
    const latest = latestWeight();
    $("weight-input").value = latest ? String(latest.kg) : "80";
    renderWeight();
    openSheet("weight");
  }

  function bind() {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => setPanel(btn.dataset.nav));
    });

    $("prev-day").addEventListener("click", () => {
      selectedDate = shiftDate(selectedDate, -1);
      render();
    });
    $("next-day").addEventListener("click", () => {
      selectedDate = shiftDate(selectedDate, 1);
      render();
    });
    $("date-label").addEventListener("click", () => {
      selectedDate = todayKey();
      render();
    });

    $("add-food-btn").addEventListener("click", () => {
      $("meal-select").value = guessMeal();
      $("food-search").value = "";
      renderSearch("");
      openSheet("food");
      setTimeout(() => $("food-search").focus(), 50);
    });
    $("close-food").addEventListener("click", () => closeSheet("food"));
    $("food-backdrop").addEventListener("click", () => closeSheet("food"));
    $("food-search").addEventListener("input", (e) => renderSearch(e.target.value));

    $("search-results").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-food-id]");
      if (!btn) return;
      const food = findFood(btn.dataset.foodId);
      if (!food) return;
      addEntry(food, $("meal-select").value);
      closeSheet("food");
    });

    $("ship-food-chips").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-food-id]");
      if (!btn) return;
      const food = findFood(btn.dataset.foodId);
      if (food) addEntry(food);
    });

    $("toggle-ship-foods").addEventListener("click", () => {
      shipExpanded = !shipExpanded;
      renderShipChips();
    });

    $("meal-sections").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-del]");
      if (!btn) return;
      removeEntry(btn.dataset.del);
    });

    $("add-water-btn").addEventListener("click", () => {
      const day = dayBucket();
      day.water = Math.min(20, (day.water || 0) + 1);
      save();
      render();
      toast("Water +1");
    });

    $("log-weight-btn").addEventListener("click", openWeightSheet);
    $("log-weight-btn-2").addEventListener("click", openWeightSheet);
    $("close-weight").addEventListener("click", () => closeSheet("weight"));
    $("weight-backdrop").addEventListener("click", () => closeSheet("weight"));
    $("save-weight").addEventListener("click", () => {
      const kg = Number($("weight-input").value);
      const date = $("weight-date").value || todayKey();
      if (!kg || kg < 40 || kg > 200) {
        toast("Enter a valid weight");
        return;
      }
      state.weights = state.weights.filter((w) => w.date !== date);
      state.weights.push({ date, kg });
      save();
      closeSheet("weight");
      render();
      toast(`Saved ${kg.toFixed(1)} kg`);
    });

    $("open-settings").addEventListener("click", () => {
      $("goal-kcal").value = state.goals.kcal;
      $("goal-pro").value = state.goals.protein;
      $("goal-start").value = state.goals.startKg;
      $("goal-end").value = state.goals.goalKg;
      openSheet("settings");
    });
    $("close-settings").addEventListener("click", () => closeSheet("settings"));
    $("settings-backdrop").addEventListener("click", () => closeSheet("settings"));
    $("save-settings").addEventListener("click", () => {
      state.goals.kcal = Number($("goal-kcal").value) || 2000;
      state.goals.protein = Number($("goal-pro").value) || 140;
      state.goals.startKg = Number($("goal-start").value) || 80;
      state.goals.goalKg = Number($("goal-end").value) || 72;
      save();
      closeSheet("settings");
      render();
      toast("Targets saved");
    });

    $("save-custom").addEventListener("click", () => {
      const name = $("custom-name").value.trim();
      const kcal = Number($("custom-kcal").value);
      if (!name || !kcal) {
        toast("Name + calories required");
        return;
      }
      const food = {
        id: `custom-${Date.now()}`,
        name,
        kcal,
        protein: Number($("custom-pro").value) || 0,
        carbs: Number($("custom-carb").value) || 0,
        fat: Number($("custom-fat").value) || 0,
        tags: ["custom", "ship"],
      };
      state.customFoods.unshift(food);
      save();
      addEntry(food, $("meal-select").value);
      closeSheet("food");
      ["custom-name", "custom-kcal", "custom-pro", "custom-carb", "custom-fat"].forEach(
        (id) => ($(id).value = "")
      );
    });

    $("export-data").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vessel-fit-backup-${todayKey()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast("Backup downloaded");
    });

    $("import-data").addEventListener("click", () => $("import-file").click());
    $("import-file").addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        state = {
          ...defaultState(),
          ...parsed,
          goals: { ...defaultState().goals, ...(parsed.goals || {}) },
          workoutLogs: parsed.workoutLogs || {},
        };
        save();
        render();
        closeSheet("settings");
        toast("Backup imported");
      } catch {
        toast("Import failed");
      }
      e.target.value = "";
    });

    // Train interactions (delegated)
    $("day-tabs").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-workout]");
      if (!btn) return;
      activeWorkoutId = btn.dataset.workout;
      renderDayTabs();
      renderWorkoutDetail();
    });

    $("schedule-list").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open-workout]");
      if (!btn) return;
      activeWorkoutId = btn.dataset.openWorkout;
      setPanel("train");
      renderDayTabs();
      renderWorkoutDetail();
      $("workout-detail").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("session-list").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open-workout]");
      if (!btn) return;
      activeWorkoutId = btn.dataset.openWorkout;
      setPanel("train");
    });

    $("workout-detail").addEventListener("change", (e) => {
      const done = e.target.closest("[data-ex-done]");
      if (done) {
        const id = done.dataset.exDone;
        const log = workoutLog();
        log.exercises[id] = {
          ...(log.exercises[id] || {}),
          done: done.checked,
          weight: log.exercises[id]?.weight || "",
          reps: log.exercises[id]?.reps || "",
        };
        save();
        renderWorkoutDetail();
      }
    });

    $("workout-detail").addEventListener("input", (e) => {
      const weight = e.target.closest("[data-ex-weight]");
      const reps = e.target.closest("[data-ex-reps]");
      if (!weight && !reps) return;
      const id = (weight || reps).dataset.exWeight || (weight || reps).dataset.exReps;
      const log = workoutLog();
      const current = log.exercises[id] || { done: false, weight: "", reps: "" };
      if (weight) current.weight = weight.value;
      if (reps) current.reps = reps.value;
      log.exercises[id] = current;
      save();
    });

    $("workout-detail").addEventListener("click", (e) => {
      if (e.target.closest("#complete-workout")) {
        const log = workoutLog();
        log.completedAt = new Date().toISOString();
        // mark remaining unchecked? leave as-is; user may partial complete
        save();
        renderWorkoutDetail();
        toast("Workout saved");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeSheet("food");
        closeSheet("weight");
        closeSheet("settings");
      }
    });
  }

  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  bind();
  setPanel("food");
  registerSW();
})();
