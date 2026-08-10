// ── STATE ────────────────────────────────────────────────────
let currentPage = 0;
const answers = {};

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyBackground();
  renderPages();
  showPage(0);
});

function applyBackground() {
  if (CONFIG.backgroundImage) {
    document.getElementById("bgLayer").style.backgroundImage =
      `url('${CONFIG.backgroundImage}')`;
  }
}

// ── RENDER ALL PAGES ─────────────────────────────────────────
function renderPages() {
  const container = document.getElementById("pagesContainer");
  container.innerHTML = "";

  let questionNum = 0;

  CONFIG.pages.forEach((page, index) => {
    const div = document.createElement("div");
    div.className = "page";
    div.id = `page-${index}`;
    div.setAttribute("data-index", index);

    const inner = document.createElement("div");
    inner.className = "page-inner";

    // ── INTRO PAGE ──────────────────────────────────────────
    if (page.type === "intro") {
      inner.classList.add("intro-centered");

      const logo = document.createElement("img");
      logo.src = "assets/logo.png";
      logo.className = "intro-logo";
      logo.alt = "Logo";
      inner.appendChild(logo);

      const q = document.createElement("h2");
      q.className = "question-text";
      q.textContent = page.question;
      inner.appendChild(q);

      if (page.hint) {
        const hint = document.createElement("p");
        hint.className = "question-hint";
        hint.textContent = page.hint;
        inner.appendChild(hint);
      }

      const inputWrap = document.createElement("div");
      inputWrap.className = "input-wrap";

      const startBtn = document.createElement("button");
      startBtn.className = "btn-start";
      startBtn.textContent = "Begin Application →";
      startBtn.onclick = () => nextPage();
      inputWrap.appendChild(startBtn);

      inner.appendChild(inputWrap);
      div.appendChild(inner);
      container.appendChild(div);
      return;
    }

    // ── ALL OTHER PAGES ─────────────────────────────────────
    questionNum++;

    const numWrap = document.createElement("div");
    numWrap.className = "question-number";
    numWrap.innerHTML = `<span class="question-number-badge">${questionNum}</span>`;
    inner.appendChild(numWrap);

    const q = document.createElement("h2");
    q.className = "question-text";
    q.textContent = page.question;
    inner.appendChild(q);

    if (page.hint) {
      const hint = document.createElement("p");
      hint.className = "question-hint";
      hint.textContent = page.hint;
      inner.appendChild(hint);
    }

    const inputWrap = document.createElement("div");
    inputWrap.className = "input-wrap";

    if (page.type === "short") {
      const inp = document.createElement("input");
      inp.type = page.id === "email" ? "email" : "text";
      inp.className = "input-short";
      inp.placeholder = page.placeholder || "";
      inp.id = `input-${page.id}`;
      inp.addEventListener("input", () => saveAnswer(page.id, inp.value));
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") nextPage();
      });
      if (answers[page.id]) inp.value = answers[page.id];
      inputWrap.appendChild(inp);
      inputWrap.appendChild(makeOkButton());

    } else if (page.type === "multi-short") {
      page.fields.forEach((field) => {
        const fieldWrap = document.createElement("div");
        fieldWrap.className = "multi-short-field";

        const label = document.createElement("label");
        label.className = "multi-short-label";
        label.textContent = field.label;
        label.setAttribute("for", `input-${field.id}`);

        const inp = document.createElement("input");
        inp.type = field.id === "email" ? "email" : field.id === "phone" ? "tel" : "text";
        inp.className = "input-short";
        inp.placeholder = field.placeholder || "";
        inp.id = `input-${field.id}`;
        inp.addEventListener("input", () => saveAnswer(field.id, inp.value));
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            const fields = page.fields;
            const idx = fields.indexOf(field);
            if (idx < fields.length - 1) {
              document.getElementById(`input-${fields[idx + 1].id}`).focus();
            } else {
              nextPage();
            }
          }
        });
        if (answers[field.id]) inp.value = answers[field.id];

        fieldWrap.appendChild(label);
        fieldWrap.appendChild(inp);
        inputWrap.appendChild(fieldWrap);
      });
      inputWrap.appendChild(makeOkButton());

    } else if (page.type === "long") {
      const ta = document.createElement("textarea");
      ta.className = "input-long";
      ta.placeholder = page.placeholder || "";
      ta.id = `input-${page.id}`;
      ta.rows = 5;
      ta.addEventListener("input", () => saveAnswer(page.id, ta.value));
      if (answers[page.id]) ta.value = answers[page.id];
      inputWrap.appendChild(ta);
      if (index < CONFIG.pages.length - 1) inputWrap.appendChild(makeOkButton());

    } else if (page.type === "choice") {
      page.options.forEach((opt) => {
        const label = document.createElement("label");
        label.className = "choice-item";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `choice-${page.id}`;
        radio.value = opt;
        radio.addEventListener("change", () => {
          saveAnswer(page.id, opt);
          highlightChoice(page.id, opt);
          setTimeout(() => nextPage(), 400);
        });
        if (answers[page.id] === opt) {
          radio.checked = true;
          label.classList.add("selected");
        }

        const span = document.createElement("span");
        span.textContent = opt;

        label.appendChild(radio);
        label.appendChild(span);
        inputWrap.appendChild(label);
      });

    } else if (page.type === "checklist") {
      const savedArr = answers[page.id] || [];
      page.options.forEach((opt) => {
        const label = document.createElement("label");
        label.className = "choice-item";
        if (savedArr.includes(opt)) label.classList.add("selected");

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = opt;
        cb.checked = savedArr.includes(opt);
        cb.addEventListener("change", () => {
          const current = answers[page.id] || [];
          if (cb.checked) {
            saveAnswer(page.id, [...current, opt]);
          } else {
            saveAnswer(page.id, current.filter((v) => v !== opt));
          }
          label.classList.toggle("selected", cb.checked);
        });

        const span = document.createElement("span");
        span.textContent = opt;

        label.appendChild(cb);
        label.appendChild(span);
        inputWrap.appendChild(label);
      });
      inputWrap.appendChild(makeOkButton());
    }

    inner.appendChild(inputWrap);
    div.appendChild(inner);
    container.appendChild(div);
  });
}

function makeOkButton() {
  const wrap = document.createElement("div");

  const btn = document.createElement("button");
  btn.className = "btn-ok";
  btn.innerHTML = `OK <span style="font-size:0.85rem">✓</span>`;
  btn.onclick = () => nextPage();
  wrap.appendChild(btn);

  const hint = document.createElement("p");
  hint.className = "btn-ok-hint";
  hint.textContent = "press Enter ↵";
  wrap.appendChild(hint);

  return wrap;
}

function highlightChoice(pageId, selectedVal) {
  const page = CONFIG.pages.find((p) => p.id === pageId);
  if (!page) return;
  const labels = document.querySelectorAll(`#page-${CONFIG.pages.indexOf(page)} .choice-item`);
  labels.forEach((lbl) => {
    lbl.classList.toggle("selected", lbl.querySelector("input").value === selectedVal);
  });
}

// ── NAVIGATION ───────────────────────────────────────────────
function showPage(index) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((p, i) => {
    p.classList.remove("active", "exit-left", "exit-right");
    if (i < index) p.classList.add("exit-left");
    else if (i > index) p.style.display = "none";
  });

  const target = document.getElementById(`page-${index}`);
  if (target) {
    target.style.display = "flex";
    void target.offsetWidth;
    target.classList.add("active");
  }

  updateNav(index);
  updateProgress(index);

  setTimeout(() => {
    const inp = target && target.querySelector("input:not([type=radio]):not([type=checkbox]), textarea");
    if (inp) inp.focus();
  }, 350);
}

function nextPage() {
  const page = CONFIG.pages[currentPage];

  if (page.type === "multi-short") {
    const requiredFields = page.fields.filter((f) => f.required !== false);
    const missing = requiredFields.some((f) => !hasAnswer(f.id));
    if (missing) {
      shakeCurrentPage();
      requiredFields.forEach((f) => {
        const inp = document.getElementById(`input-${f.id}`);
        if (inp && !inp.value.trim()) inp.classList.add("input-error");
        if (inp) inp.addEventListener("input", () => inp.classList.remove("input-error"), { once: true });
      });
      return;
    }
  } else if (page.type !== "intro" && page.type !== "choice") {
    if (page.required && !hasAnswer(page.id)) {
      shakeCurrentPage();
      return;
    }
  }

  if (currentPage < CONFIG.pages.length - 1) {
    const old = document.getElementById(`page-${currentPage}`);
    old.classList.remove("active");
    old.classList.add("exit-left");
    setTimeout(() => { old.style.display = "none"; }, 400);

    currentPage++;
    const next = document.getElementById(`page-${currentPage}`);
    next.style.display = "flex";
    void next.offsetWidth;
    next.classList.add("active");

    updateNav(currentPage);
    updateProgress(currentPage);

    setTimeout(() => {
      const inp = next.querySelector("input:not([type=radio]):not([type=checkbox]), textarea");
      if (inp) inp.focus();
    }, 350);
  }
}

function prevPage() {
  if (currentPage > 0) {
    const old = document.getElementById(`page-${currentPage}`);
    old.classList.remove("active");
    old.classList.add("exit-right");
    setTimeout(() => { old.style.display = "none"; old.classList.remove("exit-right"); }, 400);

    currentPage--;
    const prev = document.getElementById(`page-${currentPage}`);
    prev.classList.remove("exit-left", "exit-right");
    prev.style.display = "flex";
    void prev.offsetWidth;
    prev.classList.add("active");

    updateNav(currentPage);
    updateProgress(currentPage);
  }
}

function updateNav(index) {
  const btnBack = document.getElementById("btnBack");
  const btnNext = document.getElementById("btnNext");
  const btnSubmit = document.getElementById("btnSubmit");
  const isLast = index === CONFIG.pages.length - 1;
  const isEnding = CONFIG.pages[index].type === "ending";

  btnBack.style.display = index === 0 ? "none" : "inline-block";
  btnNext.style.display = "none";
  btnSubmit.style.display = (isLast && !isEnding) ? "inline-block" : "none";
}

function updateProgress(index) {
  const pct = (index / (CONFIG.pages.length - 1)) * 100;
  document.getElementById("progressBar").style.width = pct + "%";
}

// ── ANSWERS ──────────────────────────────────────────────────
function saveAnswer(id, value) {
  answers[id] = value;
}

function hasAnswer(id) {
  const val = answers[id];
  if (Array.isArray(val)) return val.length > 0;
  return val && val.trim().length > 0;
}

function shakeCurrentPage() {
  const el = document.getElementById(`page-${currentPage}`);
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 500);
}

// ── SUBMIT ───────────────────────────────────────────────────
async function submitForm() {
  const lastPage = CONFIG.pages[currentPage];
  if (lastPage.required && !hasAnswer(lastPage.id)) {
    shakeCurrentPage();
    return;
  }

  const btnSubmit = document.getElementById("btnSubmit");
  btnSubmit.textContent = "Sending…";
  btnSubmit.disabled = true;

  const formData = new FormData();
  CONFIG.pages.forEach((page) => {
    if (page.type === "intro") return;
    if (page.type === "multi-short") {
      page.fields.forEach((field) => {
        const val = answers[field.id];
        if (val) formData.append(field.label, val);
      });
      return;
    }
    const val = answers[page.id];
    if (val !== undefined && val !== "") {
      const value = Array.isArray(val) ? val.join(", ") : val;
      formData.append(page.question, value);
    }
  });
  formData.append("_subject", "New Coaching Application");
  formData.append("email", answers["email"] || "");
  formData.append("_replyto", answers["email"] || "");

  try {
    const res = await fetch(CONFIG.formspreeEndpoint, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      showEnding();
    } else {
      const data = await res.json();
      const msg = data.errors
        ? data.errors.map((e) => e.message || e.field).join(", ")
        : (data.error || "Unknown error. Please try again.");
      alert("Submission failed: " + msg);
      btnSubmit.textContent = "Submit Application";
      btnSubmit.disabled = false;
    }
  } catch (err) {
    alert("Network error. Please check your connection and try again.");
    btnSubmit.textContent = "Submit Application";
    btnSubmit.disabled = false;
  }
}

function showEnding() {
  document.getElementById("pagesContainer").style.display = "none";
  document.getElementById("navButtons").style.display = "none";
  document.getElementById("progressBar").style.width = "100%";
  const ty = document.getElementById("thankyouScreen");
  ty.innerHTML = `
    <div class="thankyou-inner">
      <div class="thankyou-icon">✦</div>
      <h1>You're all done.</h1>
      <p>Message <strong>"Finished"</strong> to <strong>@kvn.ngon</strong> on Instagram</p>
      <p style="margin-top:8px; opacity:0.6">Excited to speak to you soon!</p>
      <a href="https://www.instagram.com/kvn.ngon/" target="_blank" class="btn-start" style="display:inline-block; margin-top:32px; text-decoration:none">
        Open Instagram →
      </a>
    </div>
  `;
  ty.style.display = "flex";
  void ty.offsetWidth;
  ty.classList.add("active");
}
