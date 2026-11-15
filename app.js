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
const heroImg = document.querySelector(".hero .pic img");
const lugarImg = document.querySelector(".lugar .pic img");
let ticking = false;
function onMove() {
  const y = window.scrollY, H = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${H > 0 ? y / H : 0})`;
  if (!calm) {
    if (heroImg && y < innerHeight * 1.2) heroImg.style.translate = `0 ${y * 0.18}px`;
    if (lugarImg) {
      const r = lugarImg.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) lugarImg.style.translate = `0 ${(r.top - innerHeight / 2) * -0.08}px`;
    }
  }
  ticking = false;
}
window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onMove); } }, { passive: true });
if (lugarImg) lugarImg.style.scale = "1.12";
onMove();

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
