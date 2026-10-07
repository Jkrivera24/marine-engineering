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
    days: {}, // { "2026-10-07": { entries: [], water: 0 } }
    weights: [], // { date, kg }
  });

  let state = load();
  let selectedDate = todayKey();
  let shipExpanded = false;
  let toastTimer = null;

  const $ = (id) => document.getElementById(id);

  function todayKey() {
    const d = new Date();
    return isoDate(d);
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
      };
    } catch {
      return defaultState();
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function dayBucket(date = selectedDate) {
    if (!state.days[date]) {
      state.days[date] = { entries: [], water: 0 };
    }
    return state.days[date];
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
    const d = parseKey(key);
    const yday = shiftDate(todayKey(), -1);
    if (key === yday) return "Yesterday";
    return d.toLocaleDateString(undefined, {
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

  function renderShipChips() {
    const wrap = $("ship-food-chips");
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
    $("entry-count").textContent = `${day.entries.length} item${
      day.entries.length === 1 ? "" : "s"
    }`;

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
                <div class="entry-meta">P ${round1(e.protein)}g · C ${round1(
                e.carbs
              )}g · F ${round1(e.fat)}g</div>
              </div>
              <div class="entry-cals">${Math.round(e.kcal)}</div>
              <button type="button" class="entry-del" data-del="${e.id}" aria-label="Remove">×</button>
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
    const calPct = Math.min(100, (t.kcal / g.kcal) * 100);
    const proPct = Math.min(100, (t.protein / g.protein) * 100);
    const ring = $("cal-ring");
    const circ = 2 * Math.PI * 52;
    const used = Math.min(1, t.kcal / g.kcal);
    ring.style.strokeDasharray = String(circ);
    ring.style.strokeDashoffset = String(circ * (1 - used));
    ring.classList.toggle("over", t.kcal > g.kcal);

    $("cal-remaining").textContent = String(remaining);
    $("cal-summary").textContent = `${Math.round(t.kcal)} / ${g.kcal}`;
    $("pro-summary").textContent = `${round1(t.protein)} / ${g.protein} g`;
    $("cal-bar").style.width = `${calPct}%`;
    $("pro-bar").style.width = `${proPct}%`;
    $("carb-val").textContent = String(round1(t.carbs));
    $("fat-val").textContent = String(round1(t.fat));
    $("water-val").textContent = String(t.water);
    $("date-label").textContent = formatDateLabel(selectedDate);
  }

  function renderWeight() {
    const latest = latestWeight();
    const { startKg, goalKg } = state.goals;
    const span = Math.max(0.1, startKg - goalKg);
    if (!latest) {
      $("weight-latest").textContent = "—";
      $("weight-bar").style.width = "0%";
      $("weight-note").textContent =
        "Log your first weigh-in to track progress to 72 kg.";
      return;
    }
    const lost = startKg - latest.kg;
    const pct = Math.max(0, Math.min(100, (lost / span) * 100));
    $("weight-latest").textContent = `${latest.kg.toFixed(1)} kg`;
    $("weight-bar").style.width = `${pct}%`;
    const toGo = Math.max(0, latest.kg - goalKg);
    $("weight-note").textContent =
      toGo <= 0
        ? "Goal reached — hold and recomp."
        : `${lost.toFixed(1)} kg down · ${toGo.toFixed(1)} kg to goal`;

    const hist = $("weight-history");
    if (hist) {
      hist.innerHTML = [...state.weights]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 12)
        .map(
          (w) =>
            `<li><span>${w.date}</span><strong>${w.kg.toFixed(1)} kg</strong></li>`
        )
        .join("");
    }
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
          <span>P ${round1(f.protein)}g · C ${round1(f.carbs)}g · F ${round1(
          f.fat
        )}g</span>
        </div>
        <em>${Math.round(f.kcal)} kcal</em>
      </button>`
      )
      .join("");
  }

  function render() {
    renderMetrics();
    renderShipChips();
    renderDiary();
    renderWeight();
  }

  function findFood(id) {
    return allFoods().find((f) => f.id === id);
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

  function bind() {
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

    $("log-weight-btn").addEventListener("click", () => {
      $("weight-date").value = todayKey();
      const latest = latestWeight();
      $("weight-input").value = latest ? String(latest.kg) : "80";
      renderWeight();
      openSheet("weight");
    });
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
      $("custom-name").value = "";
      $("custom-kcal").value = "";
      $("custom-pro").value = "";
      $("custom-carb").value = "";
      $("custom-fat").value = "";
    });

    $("export-data").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vessel-macro-log-${todayKey()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast("Backup downloaded");
    });

    $("import-data").addEventListener("click", () => $("import-file").click());
    $("import-file").addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        state = {
          ...defaultState(),
          ...parsed,
          goals: { ...defaultState().goals, ...(parsed.goals || {}) },
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
  render();
  registerSW();
})();
