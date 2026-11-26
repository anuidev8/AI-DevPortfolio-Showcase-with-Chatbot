// Behaviour for the DY//STRT proposal, ported from design/dystrt/preview.html.
// Motions: film-dissolve, static-hum, signal-tune, belonging-pulse, slash-cut, focus-in, red-wipe, flow-signal.
// Interactions: film-start, film-sound, skip-film, film-play, skip-intro, option-select, cost-toggle, timeline-scrub, progress-rail, cta-approve.
// Returns a cleanup function (React strict mode / client navigation safe).

type Option = "a" | "b";

const COSTS: Record<Option, { price: string; day: string; samples: boolean; label: string; subject: string }> = {
  a: { price: "$650 USD", day: "$714–$769", samples: true, label: "Start the signal · Option A", subject: "Approve Option A ($650)" },
  b: { price: "$400 USD", day: "$439–$459", samples: false, label: "Start the signal · Option B", subject: "Approve Option B ($400)" },
};

export function initProposal(root: HTMLElement): () => void {
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));

  const timers: number[] = [];
  const cleanups: Array<() => void> = [];
  const on = (t: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) root.classList.add("reduce");
  const reduced = () => root.classList.contains("reduce");

  const htmlEl = document.documentElement;
  const prevScrollBehavior = htmlEl.style.scrollBehavior;
  const prevOverflow = document.body.style.overflow;
  htmlEl.style.scrollBehavior = "smooth";
  const lock = (v: boolean) => { document.body.style.overflow = v ? "hidden" : prevOverflow; };

  /* ---------------- INTRO ---------------- */
  const intro = $("#intro")!;
  const canvas = root.querySelector<HTMLCanvasElement>("#static")!;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(canvas.width, canvas.height);
  const freq = $("#freq")!;
  const status = $("#hud-status")!;
  let raf = 0;
  let running = false;
  let tuned = false;

  const noise = () => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    if (!tuned) freq.textContent = (88 + Math.random() * 20).toFixed(1);
    raf = requestAnimationFrame(noise);
  };

  const close = () => {
    intro.classList.add("gone");
    intro.getAnimations().forEach((a) => a.cancel());
    cancelAnimationFrame(raf);
    lock(false);
    revealAll();
  };

  const finish = () => {
    if (!running) return;
    running = false;
    timers.forEach(clearTimeout);
    if (reduced()) {
      intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" }).onfinish = close;
      return;
    }
    intro.classList.add("wipe-in");
    at(820, () => { intro.classList.add("wipe-out"); cancelAnimationFrame(raf); });
    at(1600, close);
  };

  const startIntro = () => {
    intro.className = "";
    tuned = false;
    running = true;
    status.textContent = "CH 00 — No signal";
    lock(true);
    window.scrollTo(0, 0);
    if (reduced()) {
      ctx.fillStyle = getComputedStyle(root).getPropertyValue("--color-surface");
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      intro.classList.add("tuned", "circle", "slash", "motto-on");
      status.textContent = "CH 07 — Signal found";
      at(2200, finish);
      return;
    }
    noise();
    at(1100, () => { intro.classList.add("tuned", "tuning"); status.textContent = "Searching…"; });
    at(2400, () => { intro.classList.add("circle"); status.textContent = "CH 07 — Signal found"; tuned = true; freq.textContent = "107.0"; });
    at(3300, () => intro.classList.add("slash"));
    at(3800, () => intro.classList.add("motto-on"));
    at(6200, finish);
  };

  /* ---------------- FILM (trailer plays first, then dissolves into the intro) ---------------- */
  const film = $("#film")!;
  const fv = root.querySelector<HTMLVideoElement>("#film-video")!;
  const fBar = $("#film-progress")!;
  const fSound = $("#film-sound")!;
  const fSoundLabel = $("#film-sound-label")!;
  let filmOn = false;
  let filmGoneTimer = 0;

  const setSound = (soundOn: boolean) => {
    fv.muted = !soundOn;
    fSound.setAttribute("aria-pressed", String(soundOn));
    fSoundLabel.textContent = soundOn ? "Sound off" : "Sound on";
  };
  const startFilm = () => {
    filmOn = true;
    film.className = "";
    lock(true);
    window.scrollTo(0, 0);
    // Wait on the first frame with a centered play button: one tap starts the trailer with sound.
    fv.pause();
    fv.currentTime = 0;
    setSound(true);
    film.classList.add("waiting");
    filmGoneTimer = window.setTimeout(() => $("#film-play")?.focus({ preventScroll: true }), 50);
  };
  const endFilm = () => {
    if (!filmOn) return;
    filmOn = false;
    film.classList.add("fade");
    startIntro();
    filmGoneTimer = window.setTimeout(() => { fv.pause(); film.classList.add("gone"); }, reduced() ? 320 : 1450);
  };
  // Hand off to the intro when the trailer finishes. Some browsers (Safari) don't always fire
  // "ended", so also hand off in the last 0.3 s, on a pause at the very end, or if the video fails.
  const nearEnd = () => fv.duration > 0 && fv.currentTime >= fv.duration - 0.3;
  on(fv, "timeupdate", () => {
    fBar.style.setProperty("--p", String(fv.duration ? fv.currentTime / fv.duration : 0));
    if (nearEnd()) endFilm();
  });
  on(fv, "ended", endFilm);
  on(fv, "pause", () => { if (nearEnd()) endFilm(); });
  on(fv, "error", () => { if (!film.classList.contains("waiting")) endFilm(); });
  on(fv, "click", () => setSound(fv.muted));
  on(fSound, "click", () => setSound(fv.muted));
  on($("#film-skip")!, "click", endFilm);
  on($("#film-play")!, "click", () => {
    film.classList.remove("waiting");
    setSound(true);
    fv.play().catch(() => { setSound(false); void fv.play(); });
  });
  on($("#film-skip-wait")!, "click", endFilm);
  cleanups.push(() => { clearTimeout(filmGoneTimer); fv.pause(); });

  on($("#skip")!, "click", (e) => { e.stopPropagation(); finish(); });
  on(intro, "click", finish);
  on(window, "keydown", ((e: KeyboardEvent) => {
    const onButton = (e.target as HTMLElement | null)?.closest?.("button");
    if (!(e.key === "Escape" || e.key === "ArrowDown" || ((e.key === " " || e.key === "Enter") && !onButton))) return;
    if (filmOn) { e.preventDefault(); endFilm(); }
    else if (running) { e.preventDefault(); finish(); }
  }) as EventListener);
  const skipAhead = () => { if (filmOn && !film.classList.contains("waiting")) endFilm(); else if (running) finish(); };
  on(window, "wheel", skipAhead, { passive: true });
  on(window, "touchmove", skipAhead, { passive: true });

  /* ---------------- REVEAL (focus-in) ---------------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  cleanups.push(() => io.disconnect());
  const revealAll = () => {
    $$("[data-reveal]:not(.in)").forEach((el, i) => {
      el.style.transitionDelay = (el.closest(".hero") ? i * 90 : 0) + "ms";
      io.observe(el);
    });
  };

  /* ---------------- OPTION SELECT + COST TOGGLE ---------------- */
  const choose = (opt: Option) => {
    $$("[data-opt]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.opt === opt)));
    $$("tr[data-only]").forEach((tr) => tr.classList.toggle("off", tr.dataset.only !== opt));
    const c = COSTS[opt];
    const price = $("#c-price")!;
    const day = $("#dayone")!;
    [price, day].forEach((el) =>
      el.animate([{ opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0)" }], {
        duration: reduced() ? 1 : 500,
        easing: "cubic-bezier(.22,1,.36,1)",
      }),
    );
    price.textContent = c.price;
    day.textContent = c.day;
    $("#dayone-s")!.style.display = c.samples ? "" : "none";
    $("#approve-label")!.textContent = c.label;
    $<HTMLAnchorElement>("#approve")!.href = "mailto:?subject=" + encodeURIComponent("DY//STRT — " + c.subject);
  };
  $$("[data-opt]").forEach((b) => on(b, "click", () => choose(b.dataset.opt as Option)));

  /* ---------------- FILMS GALLERY (one video plays at a time) ---------------- */
  const cards = $$(".film-card");
  const videoOf = (c: HTMLElement) => c.querySelector("video")!;
  cards.forEach((card) => {
    const v = videoOf(card);
    on(card.querySelector(".film-cover")!, "click", () => {
      card.classList.add("playing");
      void v.play();
    });
    on(v, "play", () => cards.forEach((c) => { if (c !== card) videoOf(c).pause(); }));
  });
  cleanups.push(() => cards.forEach((c) => videoOf(c).pause()));

  /* ---------------- FLOW SIGNAL ---------------- */
  const steps = $("#steps")!;
  const stepIO = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    stepIO.disconnect();
    const lis = Array.from(steps.querySelectorAll("li"));
    if (reduced()) { lis.forEach((li) => li.classList.add("lit")); return; }
    steps.classList.add("run");
    lis.forEach((li, i) => at(200 + i * 950, () => li.classList.add("lit")));
  }, { threshold: 0.45 });
  stepIO.observe(steps);
  cleanups.push(() => stepIO.disconnect());

  /* ---------------- TIMELINE SCRUB + PROGRESS RAIL ---------------- */
  const tl = $("#tl-scroll")!;
  const tbar = $("#tbar")!;
  const phases = $$(".phase");
  const rail = $(".rail")!;
  const railLinks = $$<HTMLAnchorElement>(".rail a");
  const secs = railLinks.map((a) => root.querySelector<HTMLElement>(a.getAttribute("href")!));
  const onScroll = () => {
    const r = tl.getBoundingClientRect();
    const span = r.height - innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (innerHeight * 0.35 - r.top) / Math.max(span, 1)));
    tbar.style.setProperty("--p", String(p));
    phases.forEach((ph, i) => ph.classList.toggle("on", p >= i / phases.length - 0.001 || tl.offsetHeight < innerHeight));
    let cur = -1;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.45) cur = i; });
    railLinks.forEach((a, i) => a.classList.toggle("on", i === cur));
    rail.classList.toggle("show", cur >= 0);
  };
  on(window, "scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- START ---------------- */
  const params = new URLSearchParams(location.search);
  if (params.has("nointro")) { film.classList.add("gone"); close(); }
  else if (params.has("nofilm")) { film.classList.add("gone"); startIntro(); }
  else startFilm();

  return () => {
    running = false;
    timers.forEach(clearTimeout);
    cancelAnimationFrame(raf);
    cleanups.forEach((fn) => fn());
    lock(false);
    htmlEl.style.scrollBehavior = prevScrollBehavior;
  };
}
