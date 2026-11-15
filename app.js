// ============================================================
// FLAY · web
// ============================================================

// --- Publicaciones de Instagram que se muestran en la web ---
// Pegá acá los links de los reels o carruseles (uno por línea, entre comillas).
// Ejemplo: "https://www.instagram.com/reel/ABC123xyz/",
const INSTAGRAM_POSTS = [
  "https://www.instagram.com/p/DdCnHwulp5J/",
  "https://www.instagram.com/p/DfQTcE7GSwx/",
  "https://www.instagram.com/reel/DeVCz5PBT_9/",
  "https://www.instagram.com/reel/Da6S8rwoT3b/",
  "https://www.instagram.com/reel/DaObMx9op_t/",
  "https://www.instagram.com/p/DeAcPdtFn7M/",
];

// --- Formulario de Google donde se guardan las inscripciones ---
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf58OdvinF5eaTSvVMkHU8w32RkkpvW_I8r_XxRUAmolPcRrQ/formResponse";
const FIELDS = {
  email: "entry.1556369182",
  nombre: "entry.152698058",
  whatsapp: "entry.667020779",
  instagram: "entry.939797652",
  pais: "entry.1017570590",
  documento: "entry.382823400",
  experiencia: "entry.218443980",
  lesion: "entry.654245027",
  emergencia: "entry.2059080734",
  enteraste: "entry.1841219614",
  opcion: "entry.369849225",
  pago: "entry.822253862",
  origen: "entry.1436939125",
  dieta: "entry.588393791",
  alergias: "entry.547080666",
  acepto: "entry.2109138769",
};

// ---------- menú ----------
const nav = document.getElementById("nav");
const menu = document.getElementById("menu");
document.getElementById("burger").addEventListener("click", () => menu.classList.toggle("open"));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- carga de fotos un poco antes de llegar a ellas ----------
const imgIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    const img = e.target;
    img.removeAttribute("loading");
    if (!img.complete || !img.naturalWidth) img.src = img.getAttribute("src");
    imgIO.unobserve(img);
  }
}), { rootMargin: "800px 0px" });
document.querySelectorAll('img[loading="lazy"]').forEach(img => imgIO.observe(img));

// ---------- animaciones al bajar ----------
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// grupos que entran uno detrás del otro
const STAGGER = [".cards", ".checks", ".stats .row", ".includes", ".prices", ".pay", ".buda", ".steps", ".faq details", ".facts", ".ig-grid", ".cta-card"];
STAGGER.forEach(sel => document.querySelectorAll(sel).forEach(group => {
  const kids = sel === ".faq details" ? [group] : [...group.children];
  group.classList.remove("rv");
  kids.forEach((k, i) => { k.classList.add("rv"); k.style.setProperty("--d", (i * 0.09).toFixed(2) + "s"); });
}));
// fotos de la galería: se "descubren"
document.querySelectorAll(".mosaic").forEach(m => {
  m.classList.remove("rv");
  [...m.children].forEach((img, i) => { img.classList.add("clip"); img.style.setProperty("--d", ((i % 4) * 0.12).toFixed(2) + "s"); });
});
// columnas que entran de costado
document.querySelectorAll(".intro .grid > .rv:first-child, .contenido .grid > .rv:first-child, .vgrid > .rv:first-child, .inscripcion .side").forEach(el => el.classList.add("from-l"));
document.querySelectorAll(".lugar .txt, .vbox").forEach(el => el.classList.add("from-r"));
document.querySelectorAll(".team, .tuto").forEach(el => el.classList.add("zoom"));

// números que cuentan
function countUp(el) {
  const to = +el.dataset.count, from = +(el.dataset.from || 0), t0 = performance.now(), dur = 1600;
  const step = now => {
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  e.target.querySelectorAll?.("[data-count]").forEach(n => !calm && countUp(n));
  io.unobserve(e.target);
}), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".rv, .clip").forEach(el => io.observe(el));

// movimiento suave de fotos grandes (parallax) + barra de progreso
const bar = document.createElement("div"); bar.className = "progress"; document.body.appendChild(bar);
let ticking = false;
function onMove() {
  const y = window.scrollY, H = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${H > 0 ? y / H : 0})`;
  ticking = false;
}
window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onMove); } }, { passive: true });
onMove();

// ---------- portada: fotos que cambian solas ----------
const slides = [...document.querySelectorAll("#slides img")];
if (slides.length > 1) {
  const load = img => { if (img.dataset.src && !img.getAttribute("src")) img.src = img.dataset.src; };
  const dots = document.createElement("div"); dots.className = "dots";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Foto " + (i + 1));
    if (i === 0) b.classList.add("on");
    b.addEventListener("click", () => { show(i); restart(); });
    dots.appendChild(b);
  });
  document.getElementById("slides").appendChild(dots);
  let cur = 0, timer;
  function show(i) {
    load(slides[i]);
    const go = () => {
      slides[cur].classList.remove("on"); dots.children[cur].classList.remove("on");
      cur = i;
      slides[cur].classList.add("on"); dots.children[cur].classList.add("on");
      load(slides[(cur + 1) % slides.length]);
    };
    if (slides[i].complete && slides[i].naturalWidth) go(); else slides[i].addEventListener("load", go, { once: true });
  }
  const restart = () => { clearInterval(timer); timer = setInterval(() => show((cur + 1) % slides.length), 4000); };
  setTimeout(() => load(slides[1]), 800);
  if (!calm) restart();
}

// ---------- galería que se abre en grande ----------
const lbImgs = [...document.querySelectorAll(".mosaic img, .buda img")];
if (lbImgs.length) {
  const lb = document.createElement("div");
  lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Galería de fotos");
  lb.innerHTML = '<img alt=""><button class="x" aria-label="Cerrar">×</button><button class="prev" aria-label="Foto anterior">‹</button><button class="next" aria-label="Foto siguiente">›</button><div class="cap"></div>';
  document.body.appendChild(lb);
  const big = lb.querySelector("img"), cap = lb.querySelector(".cap");
  let at = 0;
  const showLb = i => {
    at = (i + lbImgs.length) % lbImgs.length;
    big.classList.remove("ready");
    big.onload = () => big.classList.add("ready");
    big.src = lbImgs[at].getAttribute("src"); big.alt = lbImgs[at].alt;
    cap.textContent = lbImgs[at].alt + "  ·  " + (at + 1) + " / " + lbImgs.length;
    if (big.complete) big.classList.add("ready");
  };
  const openLb = i => { showLb(i); lb.classList.add("open"); document.body.classList.add("locked"); };
  const closeLb = () => { lb.classList.remove("open"); document.body.classList.remove("locked"); };
  lbImgs.forEach((img, i) => img.addEventListener("click", () => openLb(i)));
  lb.querySelector(".x").addEventListener("click", closeLb);
  lb.querySelector(".prev").addEventListener("click", e => { e.stopPropagation(); showLb(at - 1); });
  lb.querySelector(".next").addEventListener("click", e => { e.stopPropagation(); showLb(at + 1); });
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(at - 1);
    if (e.key === "ArrowRight") showLb(at + 1);
  });
  let x0 = null;
  lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) showLb(at + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

// ---------- cuenta regresiva ----------
const count = document.getElementById("count");
if (count) {
  const to = new Date(count.dataset.to).getTime();
  const el = u => count.querySelector(`[data-u="${u}"]`);
  const pad = n => String(n).padStart(2, "0");
  const tick = () => {
    let s = Math.max(0, Math.floor((to - Date.now()) / 1000));
    if (s === 0) { count.querySelector("small").textContent = "¡Ya empezó FLAY 2027!"; }
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    el("d").textContent = d; el("h").textContent = pad(h); el("m").textContent = pad(m); el("s").textContent = pad(s);
  };
  tick(); setInterval(tick, 1000);
}

// ---------- mapa (se carga al acercarse) ----------
const mapa = document.getElementById("mapaFrame");
if (mapa) {
  const mIO = new IntersectionObserver(es => {
    if (!es[0].isIntersecting) return;
    mapa.innerHTML = `<iframe src="${mapa.dataset.src}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa de Casa Buda, Traslasierra"></iframe>`;
    mIO.disconnect();
  }, { rootMargin: "600px 0px" });
  mIO.observe(mapa);
}

// ---------- ventana de inscripción ----------
const modal = document.getElementById("modal");
let lastFocus = null;
function openModal(plan) {
  if (plan) { const r = document.querySelector(`input[name=opcion][data-plan=${plan}]`); if (r) r.checked = true; }
  lastFocus = document.activeElement;
  modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  setTimeout(() => modal.querySelector("input[name=nombre]")?.focus({ preventScroll: true }), 450);
}
function closeModal() {
  modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
  lastFocus?.focus?.({ preventScroll: true });
}
document.querySelectorAll('a[href="#inscripcion"], [data-open]').forEach(a => a.addEventListener("click", ev => {
  ev.preventDefault();
  menu.classList.remove("open");
  openModal(a.dataset.plan);
}));
modal.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeModal));
document.addEventListener("keydown", ev => { if (ev.key === "Escape" && modal.classList.contains("open")) closeModal(); });
if (location.hash === "#inscripcion") openModal();

// ---------- Instagram ----------
if (INSTAGRAM_POSTS.length) {
  const grid = document.getElementById("igGrid");
  INSTAGRAM_POSTS.forEach(url => {
    const bq = document.createElement("blockquote");
    bq.className = "instagram-media";
    bq.setAttribute("data-instgrm-permalink", url);
    bq.setAttribute("data-instgrm-version", "14");
    grid.appendChild(bq);
  });
  document.getElementById("igEmpty").style.display = "none";
  const s = document.createElement("script");
  s.async = true; s.src = "https://www.instagram.com/embed.js";
  document.body.appendChild(s);
}

// ---------- inscripción ----------
const form = document.getElementById("form");
form.addEventListener("submit", async ev => {
  ev.preventDefault();
  const err = document.getElementById("err");
  if (!form.checkValidity()) {
    err.style.display = "block";
    const bad = form.querySelector(":invalid");
    if (bad) bad.closest(".fld, .opts, .opt")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  err.style.display = "none";
  const btn = document.getElementById("sendBtn");
  btn.disabled = true; btn.textContent = "Enviando…";

  const fd = new FormData(form);
  const body = new URLSearchParams();
  for (const [k, entry] of Object.entries(FIELDS)) {
    if (k === "acepto") { if (fd.get("acepto")) body.append(entry, "acepto/ agree"); continue; }
    const v = (fd.get(k) || "").toString().trim();
    if (v) body.append(entry, v);
  }

  try {
    await fetch(FORM_URL, { method: "POST", mode: "no-cors", body });
    form.style.display = "none";
    document.getElementById("formOk").classList.add("show");
    modal.querySelector(".modal-panel").scrollTo({ top: 0, behavior: "smooth" });
  } catch (e) {
    btn.disabled = false; btn.textContent = "Enviar inscripción";
    err.textContent = "No pudimos enviar la inscripción. Probá de nuevo o escribinos por WhatsApp.";
    err.style.display = "block";
  }
});

// ---------- menú: marca la sección en la que estás ----------
const navLinks = [...document.querySelectorAll('.menu a[href^="#"]:not(.btn)')];
const secIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
navLinks.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) secIO.observe(s); });
const topIO = new IntersectionObserver(es => { if (es[0].isIntersecting) navLinks.forEach(a => a.classList.remove("active")); }, { rootMargin: "-45% 0px -50% 0px" });
topIO.observe(document.getElementById("top"));
