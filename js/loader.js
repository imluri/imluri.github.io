(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Lock scroll while loader is active
  document.body.style.overflow = 'hidden';

  // Text fill takes ~1.25s (0.15s delay + 1.1s animation)
  // Hold briefly, then split the curtain
  setTimeout(function () {
    loader.classList.add('loader-exit');

    setTimeout(function () {
      loader.classList.add('loader-gone');
      document.body.style.overflow = '';
    }, 780); // slightly longer than the panel transition (0.75s)
  }, 1700);
}());
