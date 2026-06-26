/* ────────────────────────────────────────────────────────────────
   Decrypt text — vanilla port of ReactBits "DecryptedText"
   (reactbits.dev · TextAnimations/DecryptedText). Scrambles each
   target with random glyphs, then reveals the real characters
   left → right ("sequential", revealDirection: start) while the
   not-yet-revealed characters keep churning.

   Usage (progressive enhancement — real text shows if JS is off):
     <span class="accent-text" data-decrypt>Modder.</span>
   Optional per-element overrides:
     data-decrypt-speed="48"     reveal tick in ms (default 48)
     data-decrypt-stagger="160"  per-sibling start offset in ms (default 160)

   Spaces are preserved. The original text is cached on the element so
   re-running (e.g. after an SPA route swap back to the page) replays
   cleanly. Give the parent an aria-label so screen readers announce the
   real text rather than the scrambling glyphs.
   ──────────────────────────────────────────────────────────────── */
(function () {
  // Same character set ReactBits uses for the scramble.
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";
  const rand = () => CHARS[(Math.random() * CHARS.length) | 0];

  // Only letters/digits scramble; spaces and punctuation (. , ! etc.) stay put
  // so the text keeps its shape and reads cleanly mid-animation.
  const scrambleable = (c) => /[A-Za-z0-9]/.test(c);

  const scramble = (glyphs, lockedSet) =>
    glyphs
      .map((c, i) => (lockedSet.has(i) || !scrambleable(c) ? c : rand()))
      .join("");

  function run(el, speed) {
    const real = el.dataset.decryptReal;
    const glyphs = Array.from(real);
    // Reveal order: every scrambleable (letter/digit) index, left → right.
    const order = [];
    glyphs.forEach((c, i) => {
      if (scrambleable(c)) order.push(i);
    });

    let revealed = 0;
    const locked = new Set();
    const id = setInterval(() => {
      if (revealed < order.length) locked.add(order[revealed]);
      revealed++;
      if (revealed >= order.length) {
        el.textContent = real; // settle on the exact original
        clearInterval(id);
        el._decryptTimer = null;
        return;
      }
      el.textContent = scramble(glyphs, locked);
    }, speed);
    el._decryptTimer = id;
  }

  window.initDecryptText = function () {
    const seen = new Map(); // parent → running sibling count (for stagger)
    document.querySelectorAll("[data-decrypt]").forEach((el) => {
      // Cache the true text once; survives re-runs where textContent is mid-scramble.
      if (el.dataset.decryptReal == null) el.dataset.decryptReal = el.textContent;

      const idx = seen.get(el.parentElement) || 0;
      seen.set(el.parentElement, idx + 1);

      const speed = parseInt(el.dataset.decryptSpeed, 10) || 48;
      const stepRaw = parseInt(el.dataset.decryptStagger, 10);
      const startDelay = (isNaN(stepRaw) ? 160 : stepRaw) * idx;

      // Cancel any in-flight run, then scramble immediately so the real
      // text never flashes before the reveal begins.
      if (el._decryptTimer) {
        clearInterval(el._decryptTimer);
        el._decryptTimer = null;
      }
      el.textContent = scramble(Array.from(el.dataset.decryptReal), new Set());
      setTimeout(() => run(el, speed), startDelay);
    });
  };

  document.addEventListener("DOMContentLoaded", window.initDecryptText);
})();
