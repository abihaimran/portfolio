const world = document.getElementById("world");
const panels = Array.from(document.querySelectorAll(".panel"));
const logo = document.getElementById("logoBtn");
const frameGrassEls = Array.from(document.querySelectorAll(".frame-grass"));

/* Global top progress */
const topProgressFill = document.getElementById("topProgressFill");

/* Menu */
const siteMenu = document.getElementById("siteMenu");
const siteMenuClose = document.getElementById("siteMenuClose");
const siteMenuItems = Array.from(document.querySelectorAll(".site-menu-item"));

/* Intro subtitle */
const introSubPrefix = document.getElementById("introSubPrefix");
const introSubWrong = document.getElementById("introSubWrong");
const introSubMedium = document.getElementById("introSubMedium");
const introSubSuffix = document.getElementById("introSubSuffix");

/* Say Hi */
const sayHiHitbox = document.getElementById("sayHiHitbox");
const sayHiRec = document.getElementById("sayHiRec");
const sayHiDefaultText = document.getElementById("sayHiDefaultText");
const sayHiHoverText = document.getElementById("sayHiHoverText");
const sayHiImg = document.getElementById("sayHiImg");
const sayHiInstagramBtn = document.getElementById("sayHiInstagramBtn");
const sayHiEmailBtn = document.getElementById("sayHiEmailBtn");

/* Past Forward */
const pfDesignFrame = document.getElementById("pfDesignFrame");
const pfTeaser = document.getElementById("pfTeaser");
const pfViewBtn = document.getElementById("pfViewBtn");
const pfProject = document.getElementById("pfProject");
const pfExitBtn = document.getElementById("pfExitBtn");
const pfVpContent = document.getElementById("pfVpContent");
const pfTextScroll = document.getElementById("pfTextScroll");
const pfViewport = document.getElementById("pfViewport");
const pfReadBtn = document.getElementById("pfReadBtn");

/* PF book */
const pfBookReader = document.getElementById("pfBookReader");
const pfBookPageImg = document.getElementById("pfBookPageImg");
const pfBookCloseBtn = document.getElementById("pfBookCloseBtn");
const pfBookPrevBtn = document.getElementById("pfBookPrevBtn");
const pfBookNextBtn = document.getElementById("pfBookNextBtn");

/* Tuborg */
const tbDesignFrame = document.getElementById("tbDesignFrame");
const tbTeaser = document.getElementById("tbTeaser");
const tbViewBtn = document.getElementById("tbViewBtn");
const tbProject = document.getElementById("tbProject");
const tbExitBtn = document.getElementById("tbExitBtn");
const tbVpContent = document.getElementById("tbVpContent");
const tbEnterBtn = document.getElementById("tbEnterBtn");

/* Jewellery */
const jwDesignFrame = document.getElementById("jwDesignFrame");
const jwTeaser = document.getElementById("jwTeaser");

let currentPanel = 0;
let isAnimating = false;

/* Wheel gesture control */
let wheelAccum = 0;
let wheelTimer = null;
let wheelLockedUntil = 0;

/* PF gesture control */
let pfWheelAccum = 0;
let pfWheelTimer = null;
let pfWheelLockedUntil = 0;

/* TB gesture control */
let tbWheelAccum = 0;
let tbWheelTimer = null;
let tbWheelLockedUntil = 0;

/* PF state */
const pfState = { active:false, slide:0 };
const PF_SLIDE_MAX = 5;

/* PF book state */
const pfBook = { active:false, page:1, total:11 };

/* TB state */
const tbState = { active:false, slide:0 };
const TB_SLIDE_MAX = 6;

/* Say hi state */
let sayHiCopiedTimer = null;

/* Faster type speeds */
const TYPE_SPEED_MONO = 60;
const TYPE_SPEED_JACQUARD = 85;
const TYPE_SPEED_ONE_LINE = 65;
const TYPE_SPEED_SUB = 62;
const TYPE_ERASE_SPEED = 88;

/* Grass positions */
const GRASS_HOME_TOP = -642.02;
const GRASS_PROJECT_TOP = -432.02;

/* Global clouds slightly faster */
gsap.to(".clouds", {
  backgroundPositionX: "-2691px",
  duration: 150,
  ease: "none",
  repeat: -1
});

/* ============================= */
/* CAMERA TILT + GRASS SLIDE     */
/* ============================= */
const HOME_BG = { y: -720, x: 0 };
const PROJ_BG = { y: -610, x: -200 };
const GRASS_ENTER_EXTRA = 210;
const GRASS_EXIT_EXTRA = 0;

function setGrassHomeStateImmediate(){
  frameGrassEls.forEach((el) => {
    gsap.set(el, {
      top: GRASS_HOME_TOP,
      opacity: 1
    });
  });
}

function tiltToProject(){
  const sky = document.querySelector(".sky");
  const clouds = document.querySelector(".clouds");

  gsap.to(sky, {
    backgroundPositionX: `${PROJ_BG.x}px`,
    backgroundPositionY: `${PROJ_BG.y}px`,
    duration: 1.05,
    ease: "power3.inOut",
    overwrite: true
  });

  gsap.to(clouds, {
    backgroundPositionY: `${PROJ_BG.y}px`,
    duration: 1.05,
    ease: "power3.inOut",
    overwrite: false
  });

  frameGrassEls.forEach((el) => {
    gsap.to(el, {
      top: GRASS_PROJECT_TOP,
      opacity: 0,
      duration: 1.00,
      ease: "power3.inOut",
      overwrite: true
    });
  });
}

function tiltToHome(){
  const sky = document.querySelector(".sky");
  const clouds = document.querySelector(".clouds");

  gsap.to(sky, {
    backgroundPositionX: `${HOME_BG.x}px`,
    backgroundPositionY: `${HOME_BG.y}px`,
    duration: 1.05,
    ease: "power3.inOut",
    overwrite: true
  });

  gsap.to(clouds, {
    backgroundPositionY: `${HOME_BG.y}px`,
    duration: 1.05,
    ease: "power3.inOut",
    overwrite: false
  });

  frameGrassEls.forEach((el) => {
    gsap.to(el, {
      top: GRASS_HOME_TOP,
      opacity: 1,
      duration: 1.00,
      ease: "power3.inOut",
      overwrite: true
    });
  });
}

/* ============================= */
/* TOP PROGRESS                  */
/* ============================= */
let lastTopProgress = 0;

function setTopProgress(frac){
  if (!topProgressFill) return;
  const f = Math.max(0, Math.min(1, frac));
  const pct = f * 100;
  const dur = (f > lastTopProgress) ? 0.45 : 0.30;

  gsap.to(topProgressFill, {
    width: `${pct}%`,
    duration: dur,
    ease: "power2.out"
  });

  lastTopProgress = f;
}

function updateGlobalProgress(){
  if (tbState.active){
    setTopProgress(tbState.slide / TB_SLIDE_MAX);
    return;
  }

  if (pfState.active && pfBook.active){
    setTopProgress((pfBook.page - 1) / (pfBook.total - 1));
    return;
  }

  if (pfState.active && !pfBook.active){
    const base = pfState.slide / PF_SLIDE_MAX;
    let p = base;
    if (pfState.slide === 1){
      const frac = getParagraphScrollFrac();
      p = base + (frac * (1 / PF_SLIDE_MAX));
    }
    setTopProgress(p);
    return;
  }

  const denom = Math.max(1, panels.length - 1);
  setTopProgress(currentPanel / denom);
}

/* ============================= */
/* TYPE HELPERS                  */
/* ============================= */
function typeInto(el, text, speed) {
  return new Promise((resolve) => {
    el.textContent = "";
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

function appendType(el, text, speed) {
  return new Promise((resolve) => {
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

function eraseSpan(el, speed) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      el.textContent = el.textContent.slice(0, -1);
      if (el.textContent.length === 0) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

/* no more restart-jump logic */
function ensureBobClass(elements){
  elements.forEach(el => {
    if (el && !el.classList.contains("bob-sync")) {
      el.classList.add("bob-sync");
    }
  });
}

async function runIntroSubtitleSequence(){
  if (!introSubPrefix || !introSubWrong || !introSubMedium || !introSubSuffix) return;

  introSubPrefix.textContent = "";
  introSubWrong.textContent = "";
  introSubMedium.textContent = "";
  introSubSuffix.textContent = "";

  await sleep(2000);
  await appendType(introSubPrefix, "Take a ", TYPE_SPEED_SUB);
  await appendType(introSubWrong, "stroll", TYPE_SPEED_SUB);
  await sleep(1500);
  await eraseSpan(introSubWrong, TYPE_ERASE_SPEED);
  await sleep(140);
  await appendType(introSubMedium, "scroll", TYPE_SPEED_SUB);
  await appendType(introSubSuffix, " with me.", TYPE_SPEED_SUB);
}

async function runTyping(panelIndex) {
  const panel = panels[panelIndex];
  if (!panel) return;

  if (panelIndex === 7) {
    if (panel.dataset.typed === "true") return;
    if (sayHiDefaultText) {
      await typeInto(sayHiDefaultText, sayHiDefaultText.dataset.text || "", TYPE_SPEED_MONO);
    }
    panel.dataset.typed = "true";
    return;
  }

  const textBlock = panel.querySelector(".textblock");
  if (!textBlock) return;

  if (panel.dataset.typed === "true") return;

  const mode = textBlock.getAttribute("data-type");

  if (mode === "two-line-fixed") {
    const line1 = textBlock.querySelector(".slot-1");
    const line2 = textBlock.querySelector(".slot-2");

    const chunks = line1.querySelectorAll(".chunk");
    if (chunks.length === 2) {
      const tA = chunks[0].getAttribute("data-text") || "";
      const tB = chunks[1].getAttribute("data-text") || "";

      chunks[0].textContent = "";
      chunks[1].textContent = "";

      await typeInto(chunks[0], tA, TYPE_SPEED_MONO);
      await sleep(320);
      await typeInto(chunks[1], tB, TYPE_SPEED_MONO);
    } else {
      const t1 = line1.getAttribute("data-text") || "";
      await typeInto(line1, t1, TYPE_SPEED_MONO);
    }

    await sleep(240);

    const t2 = line2.getAttribute("data-text") || "";
    await typeInto(line2, t2, TYPE_SPEED_JACQUARD);

    if (panelIndex === 0) {
      await runIntroSubtitleSequence();
    }

    panel.dataset.typed = "true";
    ensureBobClass([textBlock]);
    return;
  }

  if (mode === "one-line") {
    const normal = textBlock.querySelector(".t-normal");
    const italic = textBlock.querySelector(".t-italic");

    const tNormal = normal?.getAttribute("data-text") || "";
    const tItalic = italic?.getAttribute("data-text") || "";

    if (normal) await typeInto(normal, tNormal, TYPE_SPEED_ONE_LINE);
    await sleep(180);
    if (italic) await typeInto(italic, tItalic, TYPE_SPEED_ONE_LINE);

    panel.dataset.typed = "true";
    ensureBobClass([textBlock]);
  }
}

/* ============================= */
/* PANEL NAV                     */
/* ============================= */
function goToPanel(nextIndex) {
  if (isAnimating) return;
  if (nextIndex < 0 || nextIndex >= panels.length) return;
  if (nextIndex === currentPanel) return;

  isAnimating = true;
  currentPanel = nextIndex;

  const targetX = -window.innerWidth * currentPanel;

  gsap.to(world, {
    x: targetX,
    duration: 0.95,
    ease: "power3.inOut",
    onComplete: () => {
      isAnimating = false;
      wheelLockedUntil = Date.now() + 420;
      runTyping(currentPanel);
      updateGlobalProgress();
    }
  });
}

/* ============================= */
/* SCALE FRAMES                  */
/* ============================= */
function updateHomeScale(){
  const fw = 1440;
  const fh = 900;
  const s = Math.min(window.innerWidth / fw, window.innerHeight / fh);
  document.documentElement.style.setProperty("--home-scale", String(s));
}

function updatePfScale(){
  if (!pfDesignFrame) return;
  const s = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
  pfDesignFrame.style.setProperty("--pf-scale", String(s));
}

function updateTbScale(){
  if (!tbDesignFrame) return;
  const s = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
  tbDesignFrame.style.setProperty("--tb-scale", String(s));
}

function updateJwScale(){
  if (!jwDesignFrame) return;
  const s = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
  jwDesignFrame.style.setProperty("--jw-scale", String(s));
}

window.addEventListener("resize", () => {
  updateHomeScale();
  updatePfScale();
  updateTbScale();
  updateJwScale();
  gsap.set(world, { x: -window.innerWidth * currentPanel });
});

updateHomeScale();
updatePfScale();
updateTbScale();
updateJwScale();

/* ============================= */
/* HOVER FALLBACKS               */
/* ============================= */
function hoverFallback(el, activeCheck){
  function onMove(e){
    if (!el) return;
    if (activeCheck()){
      el.classList.remove("is-hover");
      return;
    }
    const r = el.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right &&
      e.clientY >= r.top && e.clientY <= r.bottom;

    if (inside) el.classList.add("is-hover");
    else el.classList.remove("is-hover");
  }

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseleave", () => {
    if (el) el.classList.remove("is-hover");
  });
}

hoverFallback(pfTeaser, () => pfState.active);
hoverFallback(tbTeaser, () => tbState.active);
hoverFallback(jwTeaser, () => false);

/* ============================= */
/* SLIDE ANIMATION               */
/* ============================= */
const slideLocks = new WeakMap();

function normalizeSlides(container, keyAttr){
  if (!container) return;
  const slides = Array.from(container.querySelectorAll(`[${keyAttr}]`));
  slides.forEach(s => {
    if (s.classList.contains("is-active")){
      gsap.set(s, { yPercent: 0, autoAlpha: 1, zIndex: 2, force3D: true });
    } else {
      gsap.set(s, { yPercent: 0, autoAlpha: 0, zIndex: 1, force3D: true });
    }
  });
}

function animateSlideChange(container, fromIdx, toIdx, keyAttr){
  if (!container) return;
  const slides = Array.from(container.querySelectorAll(`[${keyAttr}]`));
  const fromEl = slides.find(s => s.getAttribute(keyAttr) === String(fromIdx));
  const toEl = slides.find(s => s.getAttribute(keyAttr) === String(toIdx));
  if (!toEl) return;

  if (slideLocks.get(container)) return;
  slideLocks.set(container, true);

  slides.forEach(s => {
    if (s !== fromEl && s !== toEl){
      s.classList.remove("is-active");
      gsap.set(s, { autoAlpha: 0, yPercent: 0, zIndex: 1, force3D: true });
    }
  });

  if (!fromEl || fromIdx === toIdx){
    slides.forEach(s => s.classList.remove("is-active"));
    toEl.classList.add("is-active");
    gsap.set(toEl, { autoAlpha: 1, yPercent: 0, zIndex: 2, force3D: true });
    slideLocks.set(container, false);
    return;
  }

  fromEl.classList.add("is-active");
  toEl.classList.add("is-active");

  gsap.set(fromEl, { autoAlpha: 1, yPercent: 0, zIndex: 3, force3D: true });
  gsap.set(toEl, { autoAlpha: 1, yPercent: 100, zIndex: 2, force3D: true });

  const tl = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    onComplete: () => {
      slides.forEach(s => {
        if (s !== toEl){
          s.classList.remove("is-active");
          gsap.set(s, { autoAlpha: 0, yPercent: 0, zIndex: 1, force3D: true });
        }
      });
      gsap.set(toEl, { autoAlpha: 1, yPercent: 0, zIndex: 2, force3D: true });
      slideLocks.set(container, false);
    }
  });

  tl.to(fromEl, { yPercent: -100, duration: 0.62 }, 0)
    .to(toEl,   { yPercent: 0,    duration: 0.62 }, 0);
}

/* ============================= */
/* PF SLIDES                     */
/* ============================= */
function forceParagraphTop(){
  if (!pfTextScroll) return;
  pfTextScroll.scrollTop = 0;
  requestAnimationFrame(() => { pfTextScroll.scrollTop = 0; });
  setTimeout(() => { pfTextScroll.scrollTop = 0; }, 0);
}

function setPfSlide(idx){
  const prev = pfState.slide;
  pfState.slide = idx;
  animateSlideChange(pfVpContent, prev, idx, "data-pf-slide");
  if (idx === 1) forceParagraphTop();
  updateGlobalProgress();
}

function getParagraphScrollFrac(){
  if (!pfTextScroll) return 0;
  const max = pfTextScroll.scrollHeight - pfTextScroll.clientHeight;
  if (max <= 0) return 1;
  return Math.max(0, Math.min(1, pfTextScroll.scrollTop / max));
}

function enterPfProject(){
  pfState.active = true;
  pfBook.active = false;
  pfTeaser?.classList.remove("is-hover");

  pfProject.classList.add("is-active");
  pfProject.classList.remove("is-book");
  pfProject.setAttribute("aria-hidden", "false");
  document.body.classList.add("pf-mode");

  tiltToProject();
  setPfSlide(0);

  wheelLockedUntil = Date.now() + 420;
  pfWheelLockedUntil = Date.now() + 420;
  updateGlobalProgress();
}

function exitPfProject(){
  if (pfBook.active){
    exitBookMode();
    return;
  }

  pfState.active = false;
  pfProject.classList.remove("is-active");
  pfProject.classList.remove("is-book");
  pfProject.setAttribute("aria-hidden", "true");
  document.body.classList.remove("pf-mode");

  tiltToHome();
  setPfSlide(0);

  wheelLockedUntil = Date.now() + 420;
  pfWheelLockedUntil = Date.now() + 420;
  updateGlobalProgress();
}

pfProject.classList.remove("is-active");
pfProject.classList.remove("is-book");
pfProject.setAttribute("aria-hidden", "true");

pfViewBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  enterPfProject();
});

pfExitBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  exitPfProject();
});

/* PF book */
function hardHide(el){
  if (!el) return;
  el.classList.add("is-hidden");
  el.style.display = "none";
  el.setAttribute("aria-hidden", "true");
}

function hardShow(el){
  if (!el) return;
  el.classList.remove("is-hidden");
  el.style.display = "";
  el.setAttribute("aria-hidden", "false");
}

function setBookNavVisibility(){
  if (pfBook.page <= 1) hardHide(pfBookPrevBtn);
  else hardShow(pfBookPrevBtn);

  if (pfBook.page >= pfBook.total) hardHide(pfBookNextBtn);
  else hardShow(pfBookNextBtn);
}

function setBookPage(page){
  const p = Math.max(1, Math.min(pfBook.total, page));
  pfBook.page = p;

  if (pfBookPageImg){
    pfBookPageImg.src = `assets/past-forward/pf_page_${p}.png`;
  }

  setBookNavVisibility();
  updateGlobalProgress();
}

function enterBookMode(){
  pfBook.active = true;
  pfProject.classList.add("is-book");
  pfViewport?.classList.add("is-book");
  pfBookReader?.classList.add("is-active");
  pfBookReader?.setAttribute("aria-hidden","false");
  setBookPage(1);
  pfWheelLockedUntil = Date.now() + 420;
  updateGlobalProgress();
}

function exitBookMode(){
  pfBook.active = false;
  pfProject.classList.remove("is-book");
  pfViewport?.classList.remove("is-book");
  pfBookReader?.classList.remove("is-active");
  pfBookReader?.setAttribute("aria-hidden","true");
  setPfSlide(5);
  pfWheelLockedUntil = Date.now() + 420;
  updateGlobalProgress();
}

pfReadBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!pfState.active) return;
  enterBookMode();
});

pfBookCloseBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (pfBook.active) exitBookMode();
});

pfBookPrevBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!pfBook.active) return;
  setBookPage(pfBook.page - 1);
  pfWheelLockedUntil = Date.now() + 240;
});

pfBookNextBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!pfBook.active) return;
  setBookPage(pfBook.page + 1);
  pfWheelLockedUntil = Date.now() + 240;
});

function pfStep(dir){
  if (!pfState.active) return;

  if (pfBook.active){
    if (dir > 0) setBookPage(pfBook.page + 1);
    if (dir < 0) setBookPage(pfBook.page - 1);
    pfWheelLockedUntil = Date.now() + 320;
    return;
  }

  if (pfState.slide === 0 && dir > 0){
    setPfSlide(1);
    pfWheelLockedUntil = Date.now() + 420;
    return;
  }

  if (pfState.slide === 1 && pfTextScroll){
    const atTop = pfTextScroll.scrollTop <= 0;
    const atBottom = Math.ceil(pfTextScroll.scrollTop + pfTextScroll.clientHeight) >= pfTextScroll.scrollHeight;

    if (dir > 0 && atBottom){
      setPfSlide(2);
      pfWheelLockedUntil = Date.now() + 420;
      return;
    }
    if (dir < 0 && atTop){
      setPfSlide(0);
      pfWheelLockedUntil = Date.now() + 420;
      return;
    }
    return;
  }

  if (dir > 0){
    const next = Math.min(PF_SLIDE_MAX, pfState.slide + 1);
    if (next !== pfState.slide){
      setPfSlide(next);
      pfWheelLockedUntil = Date.now() + 420;
    }
    return;
  }

  if (dir < 0){
    const prev = Math.max(0, pfState.slide - 1);
    if (prev !== pfState.slide){
      setPfSlide(prev);
      pfWheelLockedUntil = Date.now() + 420;
    }
  }
}

/* ============================= */
/* Tuborg project                */
/* ============================= */
function setTbSlide(idx){
  const prev = tbState.slide;
  tbState.slide = idx;
  animateSlideChange(tbVpContent, prev, idx, "data-tb-slide");
  updateGlobalProgress();
}

function enterTbProject(){
  tbState.active = true;
  tbTeaser?.classList.remove("is-hover");

  tbProject.classList.add("is-active");
  tbProject.setAttribute("aria-hidden","false");
  document.body.classList.add("tb-mode");

  tiltToProject();
  setTbSlide(0);

  tbWheelLockedUntil = Date.now() + 420;
  updateGlobalProgress();
}

function exitTbProject(){
  tbState.active = false;
  tbProject.classList.remove("is-active");
  tbProject.setAttribute("aria-hidden","true");
  document.body.classList.remove("tb-mode");

  tiltToHome();
  setTbSlide(0);

  tbWheelLockedUntil = Date.now() + 420;
  updateGlobalProgress();
}

tbProject.classList.remove("is-active");
tbProject.setAttribute("aria-hidden","true");

tbViewBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  enterTbProject();
});

tbExitBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  exitTbProject();
});

tbEnterBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.open("https://abiha-imran.github.io/tuborg-bubbles/", "_blank", "noopener,noreferrer");
});

function tbStep(dir){
  if (!tbState.active) return;

  if (dir > 0){
    const next = Math.min(TB_SLIDE_MAX, tbState.slide + 1);
    if (next !== tbState.slide){
      setTbSlide(next);
      tbWheelLockedUntil = Date.now() + 420;
    }
    return;
  }

  if (dir < 0){
    const prev = Math.max(0, tbState.slide - 1);
    if (prev !== tbState.slide){
      setTbSlide(prev);
      tbWheelLockedUntil = Date.now() + 420;
    }
  }
}

/* ============================= */
/* Say Hi interactions           */
/* ============================= */
function resetSayHiEmailLabel(){
  if (!sayHiEmailBtn) return;
  sayHiEmailBtn.textContent = "email me!";
}

function showSayHiHover(){
  if (!sayHiImg || !sayHiRec || !sayHiDefaultText || !sayHiHoverText) return;

  sayHiImg.src = "assets/say_hi_2.png";
  sayHiImg.classList.add("is-hover");

  gsap.to(sayHiDefaultText, { autoAlpha: 0, duration: 0.18, ease: "power2.out" });
  gsap.to(sayHiRec, { autoAlpha: 0, duration: 0.01, ease: "none" });
  gsap.to(sayHiHoverText, { autoAlpha: 1, duration: 0.22, ease: "power2.out" });
}

function hideSayHiHover(){
  if (!sayHiImg || !sayHiRec || !sayHiDefaultText || !sayHiHoverText) return;

  sayHiImg.src = "assets/say_hi_1.png";
  sayHiImg.classList.remove("is-hover");
  resetSayHiEmailLabel();

  if (sayHiCopiedTimer) {
    clearTimeout(sayHiCopiedTimer);
    sayHiCopiedTimer = null;
  }

  gsap.to(sayHiDefaultText, { autoAlpha: 1, duration: 0.18, ease: "power2.out" });
  gsap.to(sayHiRec, { autoAlpha: 0, duration: 0.01, ease: "none" });
  gsap.to(sayHiHoverText, { autoAlpha: 0, duration: 0.18, ease: "power2.out" });
}

function fallbackCopyText(text){
  try{
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

async function copyEmailAddress(){
  const email = "abihaimran.bzns@gmail.com";

  try{
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
    } else {
      fallbackCopyText(email);
    }
  } catch {
    fallbackCopyText(email);
  }

  if (sayHiEmailBtn){
    sayHiEmailBtn.textContent = "copied email!";
    if (sayHiCopiedTimer) clearTimeout(sayHiCopiedTimer);
    sayHiCopiedTimer = setTimeout(() => {
      if (sayHiEmailBtn) sayHiEmailBtn.textContent = "email me!";
    }, 1500);
  }
}

sayHiHitbox?.addEventListener("mouseenter", showSayHiHover);
sayHiHitbox?.addEventListener("mouseleave", hideSayHiHover);

sayHiInstagramBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.open("https://www.instagram.com/abiha.imran/", "_blank", "noopener,noreferrer");
});

sayHiEmailBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  await copyEmailAddress();
});

/* ============================= */
/* Menu                         */
/* ============================= */
function openSiteMenu(){
  if (!siteMenu) return;
  siteMenu.classList.add("is-open");
  siteMenu.setAttribute("aria-hidden", "false");
}

function closeSiteMenu(){
  if (!siteMenu) return;
  siteMenu.classList.remove("is-open");
  siteMenu.setAttribute("aria-hidden", "true");
}

function resetProjectStatesForMenuNavigation(){
  if (pfBook.active){
    pfBook.active = false;
    pfBookReader?.classList.remove("is-active");
    pfBookReader?.setAttribute("aria-hidden", "true");
    pfProject?.classList.remove("is-book");
    pfViewport?.classList.remove("is-book");
  }

  if (pfState.active){
    pfState.active = false;
    pfProject?.classList.remove("is-active");
    pfProject?.classList.remove("is-book");
    pfProject?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pf-mode");
    setPfSlide(0);
  }

  if (tbState.active){
    tbState.active = false;
    tbProject?.classList.remove("is-active");
    tbProject?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("tb-mode");
    setTbSlide(0);
  }

  pfTeaser?.classList.remove("is-hover");
  tbTeaser?.classList.remove("is-hover");
  jwTeaser?.classList.remove("is-hover");

  tiltToHome();
}

logo?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (siteMenu?.classList.contains("is-open")) closeSiteMenu();
  else openSiteMenu();
});

siteMenuClose?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeSiteMenu();
});

siteMenuItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const target = Number(item.getAttribute("data-target"));
    closeSiteMenu();
    resetProjectStatesForMenuNavigation();
    setTimeout(() => {
      goToPanel(target);
    }, 20);
  });
});

/* ============================= */
/* Global wheel handler          */
/* ============================= */
window.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (isAnimating) return;

  if (tbState.active){
    if (Date.now() < tbWheelLockedUntil) return;

    tbWheelAccum += e.deltaY;
    clearTimeout(tbWheelTimer);
    tbWheelTimer = setTimeout(() => {
      if (!tbState.active) return;
      if (Date.now() < tbWheelLockedUntil) return;
      const d = Math.sign(tbWheelAccum);
      tbWheelAccum = 0;
      if (d !== 0) tbStep(d);
    }, 90);
    return;
  }

  if (pfState.active){
    if (Date.now() < pfWheelLockedUntil) return;

    const dir = Math.sign(e.deltaY);

    if (pfBook.active){
      pfWheelAccum += e.deltaY;
      clearTimeout(pfWheelTimer);
      pfWheelTimer = setTimeout(() => {
        if (!pfState.active || !pfBook.active) return;
        if (Date.now() < pfWheelLockedUntil) return;
        const d = Math.sign(pfWheelAccum);
        pfWheelAccum = 0;
        if (d !== 0) pfStep(d);
      }, 90);
      return;
    }

    if (pfState.slide === 1 && pfTextScroll){
      const atTop = pfTextScroll.scrollTop <= 0;
      const atBottom = Math.ceil(pfTextScroll.scrollTop + pfTextScroll.clientHeight) >= pfTextScroll.scrollHeight;

      if (!(dir < 0 && atTop) && !(dir > 0 && atBottom)){
        pfTextScroll.scrollTop += e.deltaY * 0.45;
        updateGlobalProgress();
        return;
      }
    }

    pfWheelAccum += e.deltaY;
    clearTimeout(pfWheelTimer);
    pfWheelTimer = setTimeout(() => {
      if (!pfState.active) return;
      if (Date.now() < pfWheelLockedUntil) return;
      const d = Math.sign(pfWheelAccum);
      pfWheelAccum = 0;
      if (d !== 0) pfStep(d);
    }, 90);

    return;
  }

  if (Date.now() < wheelLockedUntil) return;

  wheelAccum += e.deltaY;
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => {
    if (isAnimating) return;
    if (Date.now() < wheelLockedUntil) return;

    const dir = Math.sign(wheelAccum);
    wheelAccum = 0;

    if (dir > 0) goToPanel(currentPanel + 1);
    if (dir < 0) goToPanel(currentPanel - 1);
  }, 90);
}, { passive:false });

/* Keyboard */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    if (siteMenu?.classList.contains("is-open")){
      closeSiteMenu();
      return;
    }

    if (tbState.active){
      exitTbProject();
      return;
    }

    if (pfState.active){
      if (pfBook.active) exitBookMode();
      else exitPfProject();
      return;
    }
  }

  if (pfState.active || tbState.active) return;
  if (isAnimating) return;
  if (Date.now() < wheelLockedUntil) return;

  if (e.key === "ArrowRight" || e.key === "ArrowDown") goToPanel(currentPanel + 1);
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") goToPanel(currentPanel - 1);
});

/* Resize safety */
window.addEventListener("resize", () => {
  gsap.set(world, { x: -window.innerWidth * currentPanel });
});

/* Optional images missing => hide */
Array.from(document.querySelectorAll('img[data-optional="true"]')).forEach(img => {
  img.addEventListener("error", () => {
    img.style.display = "none";
  });
});

/* PF paragraph scroll updates progress */
pfTextScroll?.addEventListener("scroll", () => {
  if (pfState.active && !pfBook.active && pfState.slide === 1){
    updateGlobalProgress();
  }
});

/* Init slide stacks */
normalizeSlides(pfVpContent, "data-pf-slide");
normalizeSlides(tbVpContent, "data-tb-slide");

/* Init */
gsap.set(world, { x: 0 });
setGrassHomeStateImmediate();
runTyping(0);
wheelLockedUntil = Date.now() + 600;
tiltToHome();
updateGlobalProgress();
hideSayHiHover();
closeSiteMenu();
