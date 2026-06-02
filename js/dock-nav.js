// Scroll-docked nav: toggles `.is-docked` on every <nav> once the page has
// scrolled past a small sentinel near the top. Uses IntersectionObserver so
// it works regardless of other scroll listeners or custom smooth-scroll code.
(function () {
  function init() {
    const navs = document.querySelectorAll('nav');
    if (!navs.length) return;

    // Plant an invisible 1px sentinel just below the very top of the page.
    // When it leaves the viewport, we know we've scrolled past it.
    let sentinel = document.getElementById('__dock_sentinel');
    if (!sentinel) {
      sentinel = document.createElement('div');
      sentinel.id = '__dock_sentinel';
      sentinel.style.cssText = 'position:absolute;top:8px;left:0;width:1px;height:1px;pointer-events:none;opacity:0;';
      document.body.prepend(sentinel);
    }

    const setDocked = (docked) => {
      document.querySelectorAll('nav').forEach(n => n.classList.toggle('is-docked', docked));
      document.documentElement.classList.toggle('nav-docked', docked);
    };

    // While a scroll-snap is animating, `window.scrollTo` fires real scroll
    // events with scrollY still at its old value — those would fight the
    // pre-fired dock state. snapLock holds the predicted state until the
    // snap finishes, then we reconcile against the true position.
    let snapLock = false;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => { if (!snapLock) entries.forEach(e => setDocked(!e.isIntersecting)); },
        { threshold: 0 }
      );
      io.observe(sentinel);
    }

    // Belt-and-braces: also a scroll listener for browsers that throttle IO weirdly
    const onScroll = () => { if (!snapLock) setDocked(window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('routechange', onScroll);

    // Snap prediction: dock/undock the instant the snap begins, using its
    // known destination, so the nav glides in sync with the scroll.
    document.addEventListener('navsnap', (e) => {
      snapLock = true;
      const dest = (e.detail && typeof e.detail.y === 'number') ? e.detail.y : window.scrollY;
      setDocked(dest > 8);
    });
    document.addEventListener('navsnapend', () => {
      snapLock = false;
      onScroll(); // reconcile with the real resting position
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
