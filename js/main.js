/* ═══════════════════════════════════════════════════════════
   JOHAN OSPINA — PORTAFOLIO
   main.js
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   CONFIGURACIÓN DE SECCIONES
   ⚠️ Ajusta videoTime según la duración
      real de tu video de Blender.
      Abre el video, toma nota del segundo
      exacto en que se ve cada objeto y
      pon ese número aquí.
══════════════════════════════════════════ */
const SECTIONS = [
  {
    videoTime: 0,     // ── Vista general del escritorio (inicio del video)
    scrim:     0.22,
    panel:     'p-s0',
    eye:       '01 — Escritorio',
    name:      'Vista General',
  },
  {
    videoTime: 3.39,     // ── Diseño gráfico — mismo frame inicial, panel diferente
    scrim:     0.28,
    panel:     'p-s1',
    eye:       '02 — Diseño Gráfico',
    name:      'Ilustraciones',
  },
  {
    videoTime: 5.04,     // ── Segundo 4 → Modelado 3D
    scrim:     0.30,
    panel:     'p-s2',
    eye:       '03 — 3D Visual',
    name:      'Modelado 3D',
  },
  {
    videoTime: 6.58,     // ── Segundo 4 → Cámara / Audiovisual
    scrim:     0.35,
    panel:     'p-s3',
    eye:       '04 — Audiovisual',
    name:      'Creador de Contenido',
  },
  {
    videoTime: 8.43,     // ── Segundo 8 → Celular / Social Media
    scrim:     0.30,
    panel:     'p-s4',
    eye:       '05 — Social Media',
    name:      'Edición de Video',
  },
  {
    videoTime: 10,    // ── Segundo 10 → Sobre Mí
    scrim:     0.42,
    panel:     'p-s5',
    eye:       '06 — Sobre Mí',
    name:      'Johan Ospina',
  },
  {
    videoTime: 10,    // ── Segundo 10 → Contacto (mismo frame, más oscuro)
    scrim:     0.75,
    panel:     'p-s6',
    eye:       '07 — Contacto',
    name:      'Hablemos',
  },
];

const N = SECTIONS.length; // 7

/* ══════════════════════════════════════════
   ELEMENTOS DEL DOM
══════════════════════════════════════════ */
const cur         = document.getElementById('cur');
const curR        = document.getElementById('cur-r');
const flash       = document.getElementById('flash');
const intro       = document.getElementById('intro');
const main        = document.getElementById('main');
const btnStart    = document.getElementById('btn-start');
const btnTop      = document.getElementById('btn-top');
const prog        = document.getElementById('prog');
const scrim       = document.getElementById('stage-scrim');
const bgVideo     = document.getElementById('bg-video');
const introVideo  = document.getElementById('intro-video');
const navDots     = document.getElementById('nav-dots');
const sectionInd  = document.getElementById('section-ind');
const siEye       = document.getElementById('si-eye');
const siName      = document.getElementById('si-name');
const scrollTrack = document.getElementById('scroll-track');
const allPanels   = document.querySelectorAll('.panel');
const dots        = document.querySelectorAll('.ndot');

/* ══════════════════════════════════════════
   CURSOR PERSONALIZADO
══════════════════════════════════════════ */
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Dot: sigue al cursor inmediatamente
  cur.style.left = mouseX + 'px';
  cur.style.top  = mouseY + 'px';

  // Ring: sigue con lag (lerp)
  ringX += (mouseX - ringX) * 0.10;
  ringY += (mouseY - ringY) * 0.10;
  curR.style.left = ringX + 'px';
  curR.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover state en elementos interactivos
const interactiveEls = document.querySelectorAll('button, a, .ndot, .project-item, .chip');
interactiveEls.forEach((el) => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ══════════════════════════════════════════
   ESTADO DE LA EXPERIENCIA
══════════════════════════════════════════ */
let started    = false;
let curSection = -1;
let videoReady = false;

/* ══════════════════════════════════════════
   VIDEO — setup y control
══════════════════════════════════════════ */
function setupVideo() {
  if (!bgVideo) return;

  // Cuando el video tiene suficientes datos
  bgVideo.addEventListener('canplay', () => {
    videoReady = true;
    // Ocultar fallback
    const fallback = document.getElementById('stage-fallback');
    if (fallback) fallback.style.opacity = '0';
  });

  bgVideo.addEventListener('error', () => {
    console.warn('Video no encontrado — mostrando gradiente de fondo.');
  });

  // Pausar el video: el scroll lo controla
  bgVideo.pause();
  bgVideo.currentTime = 0;
}

/**
 * Mueve el video al segundo indicado suavemente.
 * Usa una pequeña interpolación para que no salte de golpe.
 */
let targetTime   = 0;
let currentTime  = 0;
let seeking      = false;

function seekVideo(t) {
  if (!bgVideo || !videoReady) return;
  targetTime = t;

  if (!seeking) {
    seeking = true;
    smoothSeek();
  }
}

function smoothSeek() {
  const diff = targetTime - currentTime;

  if (Math.abs(diff) < 0.015) {
    currentTime = targetTime;
    bgVideo.currentTime = currentTime;
    seeking = false;
    return;
  }

  currentTime += diff * 0.18; // lerp suave
  bgVideo.currentTime = currentTime;
  requestAnimationFrame(smoothSeek);
}

/* ══════════════════════════════════════════
   APLICAR SECCIÓN
══════════════════════════════════════════ */
function applySection(s, force = false) {
  if (s === curSection && !force) return;
  curSection = s;

  const cfg = SECTIONS[s];

  // ── Video: saltar al momento de esta sección
  seekVideo(cfg.videoTime);

  // ── Oscurecer la escena
  scrim.style.background = `rgba(0, 0, 0, ${cfg.scrim})`;

  // ── Ocultar todos los panels, mostrar el activo
  allPanels.forEach((p) => p.classList.remove('on'));
  if (cfg.panel) {
    document.getElementById(cfg.panel).classList.add('on');
  }

  // ── Indicador de sección (top-left)
  siEye.textContent  = cfg.eye;
  siName.textContent = cfg.name;

  // ── Puntos de navegación
  dots.forEach((d, i) => d.classList.toggle('on', i === s));

  // ── Barra de progreso
  prog.style.width = ((s / (N - 1)) * 100) + '%';
}

/* ══════════════════════════════════════════
   SCROLL → SECCIÓN
══════════════════════════════════════════ */
let ticking = false;

window.addEventListener('scroll', () => {
  if (!started) return;

  if (!ticking) {
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const total    = scrollTrack.scrollHeight - window.innerHeight;
      const pct      = Math.max(0, Math.min(scrolled / total, 1));
      const s        = Math.min(Math.floor(pct * N), N - 1);

      applySection(s);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ══════════════════════════════════════════
   PUNTOS DE NAVEGACIÓN → SCROLL
══════════════════════════════════════════ */
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    if (!started) return;
    const total = scrollTrack.scrollHeight - window.innerHeight;
    const target = (i / (N - 1)) * total;
    window.scrollTo({ top: target, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════
   BOTÓN INICIAR → ENTRAR A LA EXPERIENCIA
══════════════════════════════════════════ */
btnStart.addEventListener('click', startExperience);

function startExperience() {
  // 1. Flash negro
  flash.classList.add('on');

  setTimeout(() => {
    // 2. Ocultar intro
    intro.classList.add('exit');

    // 3. Activar main
    main.classList.add('active');
    prog.style.display   = 'block';
    navDots.classList.add('show');
    sectionInd.classList.add('show');
    started = true;

    // 4. Ir al tope sin animación
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 5. Pausar intro video (ahorra memoria)
    if (introVideo) introVideo.pause();

    // 6. Inicializar video principal
    setupVideo();
    bgVideo.load();

    // 7. Quitar flash
    setTimeout(() => flash.classList.remove('on'), 180);

    // 8. Mostrar sección 0
    applySection(0, true);

  }, 480);
}

/* ══════════════════════════════════════════
   BOTÓN VOLVER AL INICIO
══════════════════════════════════════════ */
btnTop.addEventListener('click', goToTop);

function goToTop() {
  // Scroll al tope primero
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Después de llegar al tope → transición de regreso al intro
  setTimeout(() => {
    flash.classList.add('on');

    setTimeout(() => {
      // Resetear estado
      started = false;
      curSection = -1;

      // Mostrar intro
      intro.classList.remove('exit');

      // Ocultar main
      main.classList.remove('active');
      prog.style.display = 'none';
      navDots.classList.remove('show');
      sectionInd.classList.remove('show');

      // Limpiar panels
      allPanels.forEach((p) => p.classList.remove('on'));

      // Reiniciar intro video
      if (introVideo) {
        introVideo.currentTime = 0;
        introVideo.play().catch(() => {});
      }

      // Quitar flash
      setTimeout(() => flash.classList.remove('on'), 200);

    }, 460);
  }, 1100); // tiempo para que llegue al tope con scroll suave
}

/* ══════════════════════════════════════════
   KEYBOARD — accesibilidad básica
══════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (!started) return;

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    const next = Math.min(curSection + 1, N - 1);
    const total = scrollTrack.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (next / (N - 1)) * total, behavior: 'smooth' });
  }

  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    const prev = Math.max(curSection - 1, 0);
    const total = scrollTrack.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (prev / (N - 1)) * total, behavior: 'smooth' });
  }

  if (e.key === 'Escape') {
    goToTop();
  }
});
