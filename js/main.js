// ── Card renderers ────────────────────────────────────────────
// Note: renderProjectCard is overridden by router.js to wire up SPA navigation.
// This version is the fallback used if router.js is not loaded.

function renderProjectCard(project) {
  const tags = project.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
  const fallbackIcon = project.icon || 'mdi:code-braces';
  const imageHTML = project.image
    ? `<img src="${project.image}" alt="${project.imageAlt}" loading="lazy" onerror="this.outerHTML='<iconify-icon icon=\\'${fallbackIcon}\\' width=\\'48\\' height=\\'48\\' style=\\'color:var(--accent)\\'></iconify-icon>'">`
    : `<iconify-icon icon="${fallbackIcon}" width="48" height="48" style="color:var(--accent)"></iconify-icon>`;
  const imgClass = project.fullscreen ? 'project-image project-image--full' : 'project-image';

  const inner = `
    <div class="${imgClass}">${imageHTML}</div>
    <h3 class="project-title">${project.title}</h3>
    <p class="project-description">${project.description}</p>
    <div class="project-tags">${tags}</div>
  `;

  if (project.link) {
    const card = document.createElement('a');
    card.href = project.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'bento-card project-card';
    card.innerHTML = inner;
    return card;
  }

  const card = document.createElement('div');
  card.className = 'bento-card project-card';
  card.innerHTML = inner;
  return card;
}

function renderToolCard(tool) {
  const tags = tool.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
  const iconHTML = `<iconify-icon icon="${tool.icon}" width="36" height="36" style="color: white;"></iconify-icon>`;

  const inner = `
    <div class="project-image">${iconHTML}</div>
    <h3 class="project-title">${tool.title}</h3>
    <p class="project-description">${tool.description}</p>
    <div class="project-tags">${tags}</div>
  `;

  if (tool.link) {
    const card = document.createElement('a');
    card.href = tool.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'bento-card project-card';
    card.innerHTML = inner;
    return card;
  }

  const card = document.createElement('div');
  card.className = 'bento-card project-card';
  card.innerHTML = inner;
  return card;
}

function renderAll() {
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid && typeof PROJECTS !== 'undefined') {
    projectsGrid.innerHTML = '';
    PROJECTS.forEach(p => projectsGrid.appendChild(renderProjectCard(p)));
  }

  const toolsGrid = document.getElementById('tools-grid');
  if (toolsGrid && typeof TOOLS !== 'undefined') {
    toolsGrid.innerHTML = '';
    TOOLS.forEach(t => toolsGrid.appendChild(renderToolCard(t)));
  }

  const hobbiesGrid = document.getElementById('hobbies-grid');
  if (hobbiesGrid && typeof HOBBIES !== 'undefined') {
    hobbiesGrid.innerHTML = '';
    HOBBIES.forEach(t => hobbiesGrid.appendChild(renderToolCard(t)));
  }

  const designsGrid = document.getElementById('designs-grid');
  if (designsGrid && typeof DESIGN_PROJECTS !== 'undefined') {
    designsGrid.innerHTML = '';
    DESIGN_PROJECTS.forEach(p => designsGrid.appendChild(renderProjectCard(p)));
  }
}

// ── Image fade-in on load ─────────────────────────────────────

function revealImg(img) {
  img.style.opacity = '1';
  const wrap = img.closest('.project-image, .project-detail-logo');
  if (wrap) wrap.classList.add('img-loaded');
}

// Capture-phase listener catches load on any img anywhere in the doc
document.addEventListener('load', (e) => {
  if (e.target.tagName === 'IMG') revealImg(e.target);
}, true);

// Called after each page swap to reveal already-cached images
function revealLoadedImages() {
  document.querySelectorAll('.project-image img, .project-detail-logo img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) revealImg(img);
  });
}

// ── Mobile menu ───────────────────────────────────────────────

function toggleMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('active');
  document.querySelector('.menu-toggle')?.classList.toggle('active');
}

// ── Smooth scroll (for same-page anchor links) ────────────────

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const target = document.querySelector(a.getAttribute('href'));
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ── Showcase animations (3 scenes each) ───────────────────────

let _showcaseTimers = [];
let _showcaseActive = false;
let _qsmScene = 0, _iyaiScene = 0, _chessScene = 0;

function stopShowcaseAnimations() {
  _showcaseActive = false;
  _showcaseTimers.forEach(clearTimeout);
  _showcaseTimers = [];
}

function _safter(fn, ms) {
  const id = setTimeout(fn, ms);
  _showcaseTimers.push(id);
}

// ── QSM ──────────────────────────────────────────────────────
const QSM_SCENES = [
  {
    filename: 'bell.qsm',
    source:   '-- Bell state\nqreg q[3]\n\nH q[0]\nCNOT q[0], q[1]\nZ q[2]\nT q[2]\nmeasure q -> c',
    compiled: '✓ 3 qubits · 6 ops',
    qubits: [
      { label: 'q₀', els: ['w','H','w','ctrl','w','M'] },
      { label: 'q₁', els: ['wl','X','w','M'] },
      { label: 'q₂', els: ['Z','w','T','w','M'] },
    ],
  },
  {
    filename: 'grover.qsm',
    source:   '-- Grover oracle\nqreg q[2]\n\nH q[0]\nH q[1]\nCCZ q[0], q[1]\nH q[0]\nmeasure q -> c',
    compiled: '✓ 2 qubits · 5 ops',
    qubits: [
      { label: 'q₀', els: ['H','w','ctrl','w','H','w','M'] },
      { label: 'q₁', els: ['H','w','ctrl','w','w','w','M'] },
    ],
  },
  {
    filename: 'teleport.qsm',
    source:   '-- Quantum teleport\nqreg q[3]\n\nH q[1]\nCNOT q[1], q[2]\nCNOT q[0], q[1]\nH q[0]\nmeasure q[0] -> c[0]\nmeasure q[1] -> c[1]',
    compiled: '✓ 3 qubits · 6 ops',
    qubits: [
      { label: 'q₀', els: ['w','w','ctrl','w','H','M'] },
      { label: 'q₁', els: ['H','ctrl','w','X','w','M'] },
      { label: 'q₂', els: ['w','X','w','w','w','M'] },
    ],
  },
];

function _buildCircuit(qubits) {
  const gc = { H:'qsm-h', X:'qsm-x', Z:'qsm-z', T:'qsm-t', CCZ:'qsm-z' };
  return '<div class="qsm-circuit">' + qubits.map(({label, els}) => {
    const inner = els.map(e => {
      if (e==='w')    return '<span class="qc-wire qsm-line"></span>';
      if (e==='wl')   return '<span class="qc-wire qsm-line qsm-long"></span>';
      if (e==='ctrl') return '<span class="qc-ctrl qsm-ctrl"></span>';
      if (e==='M')    return '<span class="qc-meas qsm-measure">M</span>';
      return `<span class="qc-gate qsm-gate ${gc[e]||'qsm-h'}">${e}</span>`;
    }).join('');
    return `<div class="qsm-row"><span class="qsm-qubit">${label}</span><div class="qsm-wire">${inner}</div></div>`;
  }).join('') + '</div>';
}

function _runQsm() {
  const card = document.querySelector('.qsm-anim');
  if (!card || !_showcaseActive) return;

  const sc          = QSM_SCENES[_qsmScene];
  const phaseCode   = card.querySelector('.qsm-phase-code');
  const phaseCirc   = card.querySelector('.qsm-phase-circuit');
  const typingEl    = card.querySelector('.qsm-typing');
  const statusEl    = card.querySelector('.qsm-status');
  const filenameEl  = card.querySelector('.code-filename');

  function fadeOut(el, cb) { el.style.opacity = '0'; _safter(cb, 380); }
  function fadeIn(el)      { el.style.display = 'block'; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '1'; })); }

  function runCode() {
    if (!_showcaseActive) return;
    phaseCirc.style.display = 'none'; phaseCirc.style.opacity = '0';
    phaseCode.style.display = 'flex'; phaseCode.style.opacity = '1';
    if (filenameEl) filenameEl.textContent = sc.filename;
    typingEl.textContent = ''; typingEl.classList.remove('qsm-done');
    statusEl.textContent = ''; statusEl.className = 'qsm-status';
    let t = 0;
    for (let i = 0; i < sc.source.length; i++) {
      const idx = i + 1;
      _safter(() => { typingEl.textContent = sc.source.slice(0, idx); }, t);
      t += sc.source[i] === '\n' ? 90 : 28;
    }
    _safter(() => { typingEl.classList.add('qsm-done'); statusEl.textContent = '→ compiling...'; statusEl.className = 'qsm-status qsm-compiling'; }, t + 200);
    _safter(() => { statusEl.textContent = sc.compiled; statusEl.className = 'qsm-status qsm-compiled'; }, t + 900);
    _safter(() => fadeOut(phaseCode, runCircuit), t + 1700);
  }

  function runCircuit() {
    if (!_showcaseActive) return;
    phaseCode.style.display = 'none';
    phaseCirc.innerHTML = _buildCircuit(sc.qubits);
    fadeIn(phaseCirc);
    const wires = phaseCirc.querySelectorAll('.qc-wire');
    const gates = phaseCirc.querySelectorAll('.qc-gate, .qc-ctrl, .qc-meas');
    let t = 120;
    wires.forEach(el => { _safter(() => el.classList.add('qc-drawn'), t); t += 120; });
    gates.forEach(el => { _safter(() => el.classList.add('qc-drawn'), t); t += 90; });
    _safter(() => fadeOut(phaseCirc, () => {
      if (!_showcaseActive) return;
      _qsmScene = (_qsmScene + 1) % QSM_SCENES.length;
      _runQsm();
    }), t + 1800);
  }

  runCode();
}

// ── IYAI ─────────────────────────────────────────────────────
const IYAI_SCENES = [
  [
    { user: true,  text: 'what\'s my walkspeed?' },
    { user: false, tool: 'Local Player · 10 lines of output', text: 'Your WalkSpeed is 16.' },
    { user: true,  text: 'set it to 500' },
    { user: false, tool: 'Local Player · 3 lines of output', text: 'Done. WalkSpeed is now 500.' },
  ],
  [
    { user: true,  text: 'what\'s in the workspace?' },
    { user: false, tool: 'Tree · 87 lines of output', text: 'Workspace contains: Camera, Baseplate, Terrain, and 4 player models with humanoids and body parts.' },
    { user: true,  text: 'find all BaseParts' },
    { user: false, tool: 'Find · 42 lines of output', text: 'Found 42 BaseParts across Workspace.' },
  ],
  [
    { user: true,  text: 'enable fly mode' },
    { user: false, text: 'Fly enabled via Infinite Yield. Use iy speed <n> to adjust movement speed.' },
    { user: true,  text: 'speed 300 and noclip' },
    { user: false, text: 'Speed set to 300 and noclip enabled.' },
  ],
];

function _runIyai() {
  const chat = document.querySelector('.iyai-anim');
  if (!chat || !_showcaseActive) return;

  const sc = IYAI_SCENES[_iyaiScene];
  chat.innerHTML = '';

  const msgEls = sc.map(m => {
    const el = document.createElement('div');
    el.className = 'iyai-msg ' + (m.user ? 'iyai-user' : 'iyai-ai');
    if (m.user) {
      el.innerHTML = `<span>${m.text}</span>`;
    } else {
      const toolHTML = m.tool
        ? `<div class="iyai-tool"><span class="iyai-tool-dot"></span>${m.tool}</div>`
        : '';
      el.innerHTML = `<div class="iyai-tag"><iconify-icon icon="mdi:robot-outline" width="12" height="12"></iconify-icon> IYAI</div>${toolHTML}<p class="iyai-response">${m.text}</p>`;
    }
    el.style.cssText = 'opacity:0;transform:translateY(10px);transition:opacity 0.35s ease,transform 0.35s ease;';
    chat.appendChild(el);
    return el;
  });

  const show = el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; };
  const addTyping = (before) => {
    const dot = document.createElement('div');
    dot.className = 'iyai-typing-indicator';
    dot.innerHTML = '<span></span><span></span><span></span>';
    chat.insertBefore(dot, before);
  };
  const removeTyping = () => { const d = chat.querySelector('.iyai-typing-indicator'); if (d) d.remove(); };

  let t = 200;
  // msg 0: user
  _safter(() => show(msgEls[0]), t); t += 700;
  // typing → msg 1: AI
  _safter(() => addTyping(msgEls[1]), t); t += 1100;
  _safter(() => { removeTyping(); show(msgEls[1]); }, t); t += 1000;
  // msg 2: user
  _safter(() => show(msgEls[2]), t); t += 700;
  // typing → msg 3: AI
  _safter(() => addTyping(msgEls[3]), t); t += 1100;
  _safter(() => { removeTyping(); show(msgEls[3]); }, t); t += 2000;
  _safter(() => {
    _iyaiScene = (_iyaiScene + 1) % IYAI_SCENES.length;
    _safter(_runIyai, 300);
  }, t);
}

// ── Chessist ─────────────────────────────────────────────────
// Board: [row][col], row 0 = rank 8, col 0 = a-file. '' = empty square.
// Each scene: initial board + moves[]. Pieces animate in-place via flying element.

const _BLACK_PIECES = new Set(['♛','♜','♝','♞','♟','♚']);

function _buildBoard(board) {
  return board.map((row, r) =>
    '<div class="chess-row">' + row.map((piece, c) => {
      const isDark = (r + c) % 2 === 0;
      const cls = (isDark ? 'cs-dark' : 'cs-light') + (piece ? ' cp' : '');
      const col = piece && _BLACK_PIECES.has(piece) ? ' style="color:#818cf8;"' : '';
      return `<span class="${cls}" data-r="${r}" data-c="${c}"${col}>${piece}</span>`;
    }).join('') + '</div>'
  ).join('');
}

function _drawArrow(boardEl, from, to) {
  boardEl.querySelectorAll('.chess-arrow-svg').forEach(s => s.remove());
  const [r1,c1]=from, [r2,c2]=to;
  const x1=(c1+.5)*12.5, y1=(r1+.5)*12.5, x2=(c2+.5)*12.5, y2=(r2+.5)*12.5;
  const dx=x2-x1, dy=y2-y1, len=Math.sqrt(dx*dx+dy*dy);
  const ex=x2-dx/len*3, ey=y2-dy/len*3;
  boardEl.insertAdjacentHTML('beforeend',
    `<svg class="chess-arrow-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="arh${r1}${c1}" markerWidth="3" markerHeight="3" refX="1.5" refY="1.5" orient="auto">
        <path d="M0,0 L3,1.5 L0,3 Z" fill="rgba(134,239,172,0.9)"/></marker></defs>
      <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"
        stroke="rgba(134,239,172,0.75)" stroke-width="2.5" marker-end="url(#arh${r1}${c1})" stroke-linecap="round"/>
    </svg>`);
}

function _animateChessMove(boardEl, from, to, onDone) {
  const [r1,c1] = from, [r2,c2] = to;
  const src = boardEl.querySelector(`[data-r="${r1}"][data-c="${c1}"]`);
  const dst = boardEl.querySelector(`[data-r="${r2}"][data-c="${c2}"]`);
  if (!src || !dst) { onDone && onDone(); return; }

  const piece = src.textContent.trim();
  if (!piece) { onDone && onDone(); return; }

  const isBlack = _BLACK_PIECES.has(piece);
  const boardRect = boardEl.getBoundingClientRect();
  const srcRect   = src.getBoundingClientRect();
  const dstRect   = dst.getBoundingClientRect();

  src.style.background = 'rgba(119,132,255,0.35)';
  dst.classList.add('best-sq');
  src.textContent = '';
  dst.textContent = '';  // clear any captured piece

  const fly = document.createElement('span');
  fly.textContent = piece;
  fly.style.cssText = [
    'position:absolute',
    `left:${(srcRect.left - boardRect.left).toFixed(1)}px`,
    `top:${(srcRect.top  - boardRect.top ).toFixed(1)}px`,
    `width:${srcRect.width.toFixed(1)}px`,
    `height:${srcRect.height.toFixed(1)}px`,
    'display:flex','align-items:center','justify-content:center',
    'font-size:0.85rem','line-height:1',
    'pointer-events:none','z-index:10','will-change:transform',
    'transition:transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94)',
    isBlack ? 'color:#818cf8' : 'color:#f0ede0',
  ].join(';');
  boardEl.appendChild(fly);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    fly.style.transform = `translate(${(dstRect.left-srcRect.left).toFixed(1)}px,${(dstRect.top-srcRect.top).toFixed(1)}px)`;
  }));

  const id = setTimeout(() => {
    dst.textContent = piece;
    dst.style.color = isBlack ? '#818cf8' : '';
    src.style.background = '';
    dst.classList.remove('best-sq');
    fly.remove();
    onDone && onDone();
  }, 480);
  _showcaseTimers.push(id);
}

const CHESS_SCENES = [
  {
    // Puzzle 1: Back-Rank Mate — 1.Qe8! Rxe8 2.Rxe8#
    eval: '#2', pct: 92,
    board: [
      ['','','','','','♜','♚',''],
      ['','','','','','♟','♟','♟'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','♕','♙','♙','♙'],
      ['','','','','♖','','♔',''],
    ],
    moves: [
      { from:[6,4], to:[0,4] },  // 1.Qe8!
      { from:[0,5], to:[0,4] },  // 1...Rxe8
      { from:[7,4], to:[0,4] },  // 2.Rxe8#
    ],
  },
  {
    // Puzzle 2: Smothered Mate — 1.Qg8+! Rxg8 2.Nf7#
    eval: '#2', pct: 95,
    board: [
      ['♜','','','','','','','♚'],
      ['','','','','','','♟','♟'],
      ['','','','','','','','♘'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['♕','','','','','','♙','♙'],
      ['','','','','','','♔',''],
    ],
    moves: [
      { from:[6,0], to:[0,6] },  // 1.Qg8+
      { from:[0,0], to:[0,6] },  // 1...Rxg8
      { from:[2,7], to:[1,5] },  // 2.Nf7#
    ],
  },
  {
    // Puzzle 3: Skewer — 1.Qh8+! Kd7 2.Qxa8
    eval: '+5.0', pct: 71,
    board: [
      ['♜','','','','♚','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['♕','','','','♔','','',''],
    ],
    moves: [
      { from:[7,0], to:[0,7] },  // 1.Qh8+
      { from:[0,4], to:[1,3] },  // 1...Kd7
      { from:[0,7], to:[0,0] },  // 2.Qxa8
    ],
  },
];

function _runChessist() {
  const ui = document.querySelector('.chess-anim');
  if (!ui || !_showcaseActive) return;

  const sc      = CHESS_SCENES[_chessScene];
  const boardEl = ui.querySelector('.chess-board-mini');
  const fillEl  = ui.querySelector('.chess-eval-fill');
  const scoreEl = ui.querySelector('.chess-eval-score');
  if (!boardEl || !fillEl || !scoreEl) return;

  scoreEl.style.opacity = '1';
  fillEl.style.transition = 'none';
  fillEl.style.height = '50%';
  scoreEl.textContent = '···';
  scoreEl.style.color = 'var(--foreground-muted)';
  boardEl.innerHTML = _buildBoard(sc.board);

  // Eval bar
  _safter(() => {
    if (!_showcaseActive) return;
    fillEl.style.transition = 'height 1.2s cubic-bezier(0.16,1,0.3,1)';
    fillEl.style.height = sc.pct + '%';
    const isMate = sc.eval.startsWith('#');
    if (isMate) {
      scoreEl.textContent = sc.eval;
      scoreEl.style.color = '#86efac';
    } else {
      const isPos = !sc.eval.startsWith('-');
      const target = parseFloat(sc.eval.replace('+','').replace('-',''));
      const dur = 1200, t0 = performance.now();
      (function count(now) {
        if (!_showcaseActive) return;
        const p = Math.min((now-t0)/dur, 1);
        const v = (target*(p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2)).toFixed(1);
        scoreEl.textContent = (isPos?'+':'-')+v;
        scoreEl.style.color = isPos ? '#86efac' : '#f87171';
        if (p<1) requestAnimationFrame(count);
      }(performance.now()));
    }
  }, 500);

  // Play through each move: show arrow → animate piece → next
  let moveIdx = 0;
  function playNext() {
    if (!_showcaseActive || moveIdx >= sc.moves.length) return;
    const mv = sc.moves[moveIdx];

    _drawArrow(boardEl, mv.from, mv.to);

    _safter(() => {
      if (!_showcaseActive) return;
      boardEl.querySelectorAll('.chess-arrow-svg').forEach(s => s.remove());
      _animateChessMove(boardEl, mv.from, mv.to, () => {
        moveIdx++;
        if (!_showcaseActive) return;
        if (moveIdx < sc.moves.length) {
          _safter(playNext, 500);
        } else {
          _safter(() => {
            if (!_showcaseActive) return;
            scoreEl.style.transition = 'opacity 0.4s ease';
            scoreEl.style.opacity = '0';
            fillEl.style.transition = 'height 0.6s ease';
            fillEl.style.height = '50%';
            _safter(() => {
              _chessScene = (_chessScene + 1) % CHESS_SCENES.length;
              _safter(_runChessist, 300);
            }, 500);
          }, 1800);
        }
      });
    }, 900);
  }

  _safter(playNext, 700);
}

function startShowcaseAnimations() {
  stopShowcaseAnimations();
  _showcaseActive = true;
  _qsmScene = _iyaiScene = _chessScene = 0;
  _runQsm();
  _runIyai();
  _runChessist();
}

// ── Snap + smooth scroll ──────────────────────────────────────

(function () {
  let locked = false;
  let smoothTarget  = window.scrollY;
  let smoothCurrent = window.scrollY;
  let smoothRaf     = null;
  let smoothLastT   = null;

  function cancelSmooth() {
    if (smoothRaf) { cancelAnimationFrame(smoothRaf); smoothRaf = null; }
    smoothLastT = null;
  }

  function syncSmooth() {
    smoothTarget = smoothCurrent = window.scrollY;
  }

  // Snap: ease-in-out cubic, cancels smooth first
  function snapTo(y) {
    cancelSmooth();
    locked = true;
    const from     = window.scrollY;
    const distance = y - from;
    const duration = 680;
    const t0       = performance.now();
    function easeInOut(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function step(now) {
      const p = Math.min((now - t0) / duration, 1);
      window.scrollTo(0, from + distance * easeInOut(p));
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, y);
        syncSmooth();
        locked = false;
      }
    }
    requestAnimationFrame(step);
  }

  // Smooth: exponential decay lerp — frame-rate independent (k≈8 ≈ 0.12 factor at 60fps)
  function smoothStep(now) {
    const dt = smoothLastT ? Math.min((now - smoothLastT) / 1000, 0.1) : 1 / 60;
    smoothLastT = now;
    const factor = 1 - Math.exp(-8 * dt);
    smoothCurrent += (smoothTarget - smoothCurrent) * factor;
    window.scrollTo(0, smoothCurrent);
    if (Math.abs(smoothTarget - smoothCurrent) > 0.5) {
      smoothRaf = requestAnimationFrame(smoothStep);
    } else {
      window.scrollTo(0, smoothTarget);
      smoothCurrent = smoothTarget;
      smoothRaf = null;
      smoothLastT = null;
    }
  }

  // Normalize wheel delta to pixels regardless of deltaMode
  function normalizeDelta(e) {
    if (e.deltaMode === 1) return e.deltaY * 24;   // line mode (~24px/line)
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // page mode
    return e.deltaY;                                // pixel mode (default)
  }

  window.addEventListener('wheel', (e) => {
    if (window.innerWidth <= 768) return;
    // Let native scroll handle wheel events inside IYAI panel containers
    if (e.target.closest('.ib-win-body, .ib-explorer, .ib-props, .ib-log-entries, .ib-history-list, .ib-tools-list')) return;
    e.preventDefault();

    if (locked) return;

    const showcase = document.getElementById('showcase');
    const about    = document.getElementById('about');
    const SNAP_1_OFFSET = -50;
    const SNAP_2_OFFSET = 0;
    const sy = window.scrollY;
    const s1 = showcase ? showcase.offsetTop + SNAP_1_OFFSET : null;
    const s2 = about    ? about.offsetTop    + SNAP_2_OFFSET : null;
    const vh = window.innerHeight;

    // Snap zones (home page only)
    if (showcase) {
      if      (e.deltaY > 0 && sy < s1)                               { snapTo(s1); return; }
      else if (e.deltaY > 0 && s2 && sy >= s1 && sy < s2)            { snapTo(s2); return; }
      else if (e.deltaY < 0 && s2 && sy > s2 - vh * 0.2 && sy <= s2) { snapTo(s1); return; }
      else if (e.deltaY < 0 && sy > 0 && sy < s1 + vh * 0.2)         { snapTo(0);  return; }
    }

    // Smooth scroll — sync both targets from real position if RAF was idle
    if (!smoothRaf) syncSmooth();
    const delta = normalizeDelta(e);
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    smoothTarget = Math.max(0, Math.min(maxY, smoothTarget + delta));
    if (!smoothRaf) smoothRaf = requestAnimationFrame(smoothStep);
  }, { passive: false });

  // Keep state in sync when scrollbar drag or page navigation moves scrollY
  // outside of our wheel handler (e.g. scrollbar, router scrollTo, touch)
  window.addEventListener('scroll', () => {
    if (!smoothRaf && !locked) syncSmooth();
  }, { passive: true });

  // Cancel + sync on back/forward navigation
  window.addEventListener('popstate', () => { cancelSmooth(); syncSmooth(); });
}());

// ── Init ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Close mobile menu when a mobile menu link is clicked
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.remove('active');
      document.querySelector('.menu-toggle').classList.remove('active');
    });
  });
  // renderAll() and initSpotlight() are called by router.js after each page swap
});
