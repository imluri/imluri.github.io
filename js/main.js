// ── Card renderers ────────────────────────────────────────────
// Note: renderProjectCard is overridden by router.js to wire up SPA navigation.
// This version is the fallback used if router.js is not loaded.

function renderProjectCard(project) {
  const tags = project.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
  const imageHTML = `<img src="${project.image}" alt="${project.imageAlt}" loading="lazy">`;

  const inner = `
    <div class="project-image">${imageHTML}</div>
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
}

// ── Mobile menu ───────────────────────────────────────────────

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const toggle = document.querySelector('.menu-toggle');
  menu.classList.toggle('active');
  toggle.classList.toggle('active');
}

// ── Smooth scroll (for same-page anchor links) ────────────────

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const target = document.querySelector(a.getAttribute('href'));
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

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
