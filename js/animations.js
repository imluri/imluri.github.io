(function () {
  // ── IntersectionObserver for .section-enter ──────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  function applyStagger() {
    const parents = new Set(
      [...document.querySelectorAll('.section-enter')].map(el => el.parentElement)
    );
    parents.forEach(parent => {
      [...parent.querySelectorAll(':scope > .section-enter')]
        .forEach((el, i) => {
          if (!el.dataset.stagger) {
            el.style.animationDelay = `${i * 70}ms`;
            el.dataset.stagger = '1';
          }
        });
    });
  }

  function observeSectionEnter() {
    // rAF ensures the browser has laid out the injected HTML before we measure
    requestAnimationFrame(() => {
      document.querySelectorAll('.section-enter:not(.is-visible)').forEach(el => io.observe(el));
    });
  }

  // ── Scroll progress bar ──────────────────────────────────────
  let _progressCleanup = null;

  function initScrollProgress() {
    if (_progressCleanup) { _progressCleanup(); _progressCleanup = null; }

    const existing = document.getElementById('scroll-progress');
    if (existing) existing.remove();

    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.style.cssText = [
      'position:fixed',
      'top:57px',
      'left:0',
      'right:0',
      'height:2px',
      'background:var(--accent)',
      'transform-origin:left center',
      'transform:scaleX(0)',
      'z-index:99',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(bar);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) { bar.style.transform = 'scaleX(0)'; return; }
      bar.style.transform = `scaleX(${Math.min(window.scrollY / max, 1)})`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    _progressCleanup = () => {
      window.removeEventListener('scroll', onScroll);
      bar.remove();
    };
  }

  // ── Public init — called after every page swap ───────────────
  window.initScrollAnimations = function () {
    applyStagger();
    observeSectionEnter();
    // Scroll progress bar removed — keep cleanup so any stale bar from
    // a previous route is also taken down.
    if (_progressCleanup) { _progressCleanup(); _progressCleanup = null; }
    const stale = document.getElementById('scroll-progress');
    if (stale) stale.remove();
  };

  document.addEventListener('DOMContentLoaded', window.initScrollAnimations);
}());
