// ============================================================
//  Router — fetch-based SPA navigation
//  Routes:
//    /           → pages/home.html
//    /projects   → pages/projects.html
//    /project/:slug → pages/project.html  (detail, data from PROJECTS)
// ============================================================

const app = document.getElementById('app');

// Map URL pathnames to page fragment files
const ROUTES = {
  '/':         '/pages/home.html',
  '/projects': '/pages/projects.html',
  '/project':  '/pages/project.html',
  '/iyai':     '/pages/iyai.html',
  '/designer': '/pages/designer.html',
};

// Cache fetched fragments so we don't re-fetch on back/forward
const cache = {};

async function fetchPage(url) {
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  const html = await res.text();
  cache[url] = html;
  return html;
}

// Run any inline <script> tags injected via innerHTML (innerHTML doesn't execute them)
function runInlineScripts(container) {
  container.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.replaceWith(newScript);
  });
}

// Re-initialise interactive features after every page swap
function initPage() {
  // Spotlight effect
  document.querySelectorAll('.spotlight').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    });
  });

  // Bind all [data-route] links inside the new content
  bindLinks(app);

  // Show footer once content is ready
  document.body.classList.remove('page-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('page-ready')));

  // Reveal any already-cached images (load event won't fire for them)
  if (typeof revealLoadedImages === 'function') revealLoadedImages();

  if (typeof startShowcaseAnimations === 'function') startShowcaseAnimations();

  // Scroll to top on page swap
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Transition: fade out → swap → fade in
async function swapContent(html) {
  if (typeof stopShowcaseAnimations === 'function') stopShowcaseAnimations();
  if (typeof window.__ibCleanup === 'function') window.__ibCleanup();
  if (typeof window.__bmCleanup === 'function') window.__bmCleanup();
  document.body.classList.remove('ib-page');
  app.classList.add('page-exit');
  await new Promise(r => setTimeout(r, 180));
  app.innerHTML = html;
  runInlineScripts(app);
  app.classList.remove('page-exit');
  app.classList.add('page-enter');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => app.classList.remove('page-enter'));
  });
  initPage();
}

// Render project detail page from PROJECTS or DESIGN_PROJECTS data
function renderProjectDetail(slug) {
  const allProjects = [
    ...(typeof PROJECTS !== 'undefined' ? PROJECTS : []),
    ...(typeof DESIGN_PROJECTS !== 'undefined' ? DESIGN_PROJECTS : []),
  ];
  const project = allProjects.find(p => p.slug === slug);

  if (!project) {
    return `
      <section class="page-hero">
        <div class="container">
          <a href="/projects" class="btn btn-secondary back-btn" data-route>
            <iconify-icon icon="mdi:arrow-left" width="16" height="16"></iconify-icon>
            Back to Projects
          </a>
          <p style="margin-top:48px;color:var(--foreground-muted);">Project not found.</p>
        </div>
      </section>`;
  }

  const { details } = project;
  const highlights = details.highlights
    .map(h => `<li>${h}</li>`)
    .join('');
  const tech = details.tech
    .map(t => `<span class="tag-badge">${t}</span>`)
    .join('');

  return `
    <section class="page-hero project-detail-page">
      <div class="container">

        <a href="/projects" class="btn btn-secondary back-btn" data-route>
          <iconify-icon icon="mdi:arrow-left" width="16" height="16"></iconify-icon>
          Back to Projects
        </a>

        <div class="project-detail-header">
          <div class="project-detail-logo${project.fullscreen ? ' project-detail-logo--full' : ''}">
            ${project.image
              ? `<img src="${project.image}" alt="${project.imageAlt}" onerror="this.outerHTML='<iconify-icon icon=\\'${project.icon || 'mdi:code-braces'}\\' width=\\'72\\' height=\\'72\\' style=\\'color:var(--accent)\\'></iconify-icon>'">`
              : `<iconify-icon icon="${project.icon || 'mdi:code-braces'}" width="72" height="72" style="color:var(--accent)"></iconify-icon>`}
          </div>
          <div class="project-detail-meta">
            <div class="project-detail-badges">
              <span class="timeline-badge">${details.year}</span>
              <span class="status-badge status-${details.status.toLowerCase()}">${details.status}</span>
            </div>
            <h1 class="gradient-text">${project.title}</h1>
            <p class="project-detail-summary">${details.summary}</p>
            ${project.link ? `
            <div class="btn-group" style="margin-top:24px;">
              <a href="${project.link}" target="_blank" rel="noopener" class="btn btn-primary">
                ${project.link.includes('github.com') ? 'View on GitHub' : 'View Project'}
                <iconify-icon icon="${project.link.includes('github.com') ? 'mdi:github' : 'mdi:open-in-new'}" width="16" height="16"></iconify-icon>
              </a>
              ${project.webLink ? `
              <a href="${project.webLink}" data-route class="btn btn-secondary">
                Open Web UI
                <iconify-icon icon="mdi:open-in-new" width="16" height="16"></iconify-icon>
              </a>` : ''}
            </div>` : ''}
          </div>
        </div>

        <div class="project-detail-body">
          <div class="glass-card project-detail-section">
            <h3>Highlights</h3>
            <ul class="timeline-list project-highlights">
              ${highlights}
            </ul>
          </div>
          <div class="glass-card project-detail-section">
            <h3>Tech Stack</h3>
            <div class="project-tags" style="margin-top:16px;">
              ${tech}
            </div>
          </div>
        </div>

        ${project.designSrc ? `
        <div class="design-embed-wrap">
          <div class="design-embed-spinner">
            <iconify-icon icon="mdi:loading" width="36" height="36" style="color:var(--accent);animation:spin 1s linear infinite;"></iconify-icon>
          </div>
          <iframe src="${project.designSrc}" class="design-embed-iframe" onload="this.previousElementSibling.style.display='none'"></iframe>
        </div>` : ''}

      </div>
    </section>`;
}

// Main navigate function
async function navigate(pathname, pushState = true) {
  // Update nav active state
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === pathname);
  });

  let html;

  try {
    if (pathname.startsWith('/project/')) {
      const slug = pathname.replace('/project/', '');
      // Load the template fragment (for structure), then inject data
      await fetchPage('/pages/project.html');
      html = renderProjectDetail(slug);
    } else {
      const fragmentUrl = ROUTES[pathname] || ROUTES['/'];
      html = await fetchPage(fragmentUrl);
    }
  } catch (e) {
    html = `<section class="page-hero"><div class="container"><p style="color:var(--foreground-muted)">Page not found.</p></div></section>`;
  }

  await swapContent(html);

  if (pushState) {
    history.pushState({ pathname }, '', pathname);
  }

  // Update document title
  const titles = {
    '/':         'imluri',
    '/projects': 'Projects | imluri',
    '/iyai':     'IYAI Bridge | imluri',
    '/designer': 'Designer | imluri',
  };
  if (pathname.startsWith('/project/')) {
    const slug = pathname.replace('/project/', '');
    const allProjects = [
      ...(typeof PROJECTS !== 'undefined' ? PROJECTS : []),
      ...(typeof DESIGN_PROJECTS !== 'undefined' ? DESIGN_PROJECTS : []),
    ];
    const project = allProjects.find(p => p.slug === slug);
    document.title = project ? `${project.title} | imluri` : 'Project — imluri';
  } else {
    document.title = titles[pathname] || 'imluri';
  }
}

// Intercept clicks on [data-route] links anywhere in the document
function bindLinks(root) {
  root.querySelectorAll('a[data-route]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate(a.getAttribute('href'));
    });
  });
}

// Handle project card clicks (cards link to /project/:slug)
function bindProjectCards(root) {
  root.querySelectorAll('.project-card[data-slug]').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      navigate(`/project/${card.dataset.slug}`);
    });
  });
}

// Override renderProjectCard to attach data-slug and route via router
const _origRenderProjectCard = typeof renderProjectCard !== 'undefined' ? renderProjectCard : null;
function renderProjectCard(project) {
  const tags = project.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
  const fallbackIcon = project.icon || 'mdi:code-braces';

  let inner, extraClass;

  if (project.image) {
    extraClass = project.fullscreen ? 'project-card--cover' : 'project-card--cover project-card--contain';
    inner = `
      <div class="project-card-bg">
        <img src="${project.image}" alt="${project.imageAlt}" loading="lazy"
          onerror="this.closest('.project-card-bg').innerHTML='<iconify-icon icon=\\'${fallbackIcon}\\' width=\\'48\\' height=\\'48\\' style=\\'color:var(--accent)\\'></iconify-icon>'">
      </div>
      <div class="project-card-overlay">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">${tags}</div>
      </div>
    `;
  } else {
    extraClass = '';
    inner = `
      <div class="project-image">
        <iconify-icon icon="${fallbackIcon}" width="48" height="48" style="color:var(--accent)"></iconify-icon>
      </div>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <div class="project-tags">${tags}</div>
    `;
  }

  const card = document.createElement('div');
  card.className = `bento-card project-card ${extraClass}`.trim();
  card.dataset.slug = project.slug;
  card.style.cursor = 'pointer';
  card.innerHTML = inner;
  card.addEventListener('click', () => navigate(`/project/${project.slug}`));
  return card;
}

// Browser back/forward
window.addEventListener('popstate', (e) => {
  const pathname = e.state?.pathname || '/';
  navigate(pathname, false);
});

// Boot: intercept nav links in the shell
document.addEventListener('DOMContentLoaded', () => {
  // Bind nav links in the shell
  document.querySelectorAll('.nav-links a[data-route], .mobile-menu a[data-route]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      // Close mobile menu if open
      document.getElementById('mobileMenu')?.classList.remove('active');
      document.querySelector('.menu-toggle')?.classList.remove('active');
      navigate(a.getAttribute('href'));
    });
  });

  // Load the correct page based on current URL
  const initial = window.location.pathname || '/';
  navigate(initial, false);
});
