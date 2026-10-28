// Replace each project's youtube value with an unlisted YouTube URL when you're ready.

const projects = [
  { title: 'Into the quiet', client: 'Terra Films · Sample project', category: 'Documentary', image: 'photo-1441974231531-c6227db76b6e', youtube: 'https://youtu.be/ka4ZClQd04k' },
  { title: 'After hours', client: 'Velocity · Sample campaign', category: 'Ads', image: 'photo-1519608487953-e999c86e7455', youtube: '' },
  { title: 'The last encore', client: 'Echo Records · Sample project', category: 'Music Video', image: 'photo-1506157786151-b8491531f063', youtube: '' },
  { title: 'City in motion', client: 'Studio 24 · Sample project', category: 'Reels / Shorts', image: 'photo-1519608487953-e999c86e7455', youtube: '' },
  { title: 'Somewhere, elsewhere', client: 'Wander Journal · Sample project', category: 'YouTube', image: 'photo-1464822759023-fed622ff2c3b', youtube: '' },
  { title: 'Built on a feeling', client: 'Frame Collective · Sample project', category: 'Corporate', image: 'photo-1501386761578-eac5c94b800a', youtube: '' }
];

const grid = document.querySelector('#project-grid');
function renderProjects(filter = 'All Work') {
  const visible = projects.filter(project => filter === 'All Work' || project.category === filter);
  grid.innerHTML = visible.map(project => `
    <article class="project-card">
      <div class="project-media" data-youtube="${escapeAttribute(project.youtube)}" role="button" tabindex="0" aria-label="Play ${escapeAttribute(project.title)}">
        <img src="https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1200&q=82" srcset="https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=640&q=78 640w, https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=960&q=80 960w, https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1200&q=82 1200w" sizes="(max-width: 650px) calc(100vw - 44px), (max-width: 900px) 46vw, 48vw" alt="${escapeAttribute(project.title)} project still" loading="lazy" decoding="async">
        <span class="play-button" aria-hidden="true">▷</span>
      </div>
      <div class="project-meta"><div><h3>${project.title}</h3><p>${project.client}</p></div><span class="tag">${project.category}</span></div>
    </article>`).join('');
}
function escapeAttribute(value) { return String(value).replace(/[&"<>']/g, char => ({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;',"'":'&#39;'}[char])); }
renderProjects();

// Mobile browsers can defer autoplay until the video is ready or the user
// returns to the tab. Keep the poster visible as a clean fallback meanwhile.
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;
  let retryArmed = false;
  const startHeroVideo = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.visibilityState === 'hidden' || !heroVideo.paused) return;
    const playAttempt = heroVideo.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(() => {
        if (retryArmed) return;
        retryArmed = true;
        const retry = () => {
          retryArmed = false;
          startHeroVideo();
        };
        document.addEventListener('touchstart', retry, { once: true, passive: true });
        document.addEventListener('click', retry, { once: true });
      });
    }
  };
  heroVideo.addEventListener('loadeddata', startHeroVideo);
  document.addEventListener('visibilitychange', startHeroVideo);
  startHeroVideo();
}

document.querySelector('.filters').addEventListener('click', event => {
  const button = event.target.closest('.filter');
  if (!button) return;
  document.querySelector('.filter.active').classList.remove('active');
  button.classList.add('active');
  renderProjects(button.dataset.filter);
});

function playProject(media) {
  const url = media.dataset.youtube.trim();
  if (!url) {
    media.classList.add('needs-video');
    window.setTimeout(() => media.classList.remove('needs-video'), 1800);
    return;
  }
  const videoId = getYouTubeId(url);
  if (!videoId) return;
  media.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0" title="Portfolio video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
}
function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith('youtu.be')) return parsed.pathname.slice(1).split('/')[0];
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
      const match = parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/);
      return match?.[1] || null;
    }
  } catch { return null; }
  return null;
}

grid.addEventListener('click', event => {
  const media = event.target.closest('.project-media');
  if (media) playProject(media);
});
grid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.project-media')) {
    event.preventDefault(); playProject(event.target);
  }
});

const themeToggle = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function setTheme(theme, persist = true) {
  const light = theme === 'light';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  themeToggle.setAttribute('aria-checked', String(light));
  themeToggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
  themeToggle.querySelector('.theme-label').textContent = light ? 'Light' : 'Dark';
  themeMeta.content = light ? '#f2f4f6' : '#090909';
  if (persist) {
    try { localStorage.setItem('bipul-theme', light ? 'light' : 'dark'); } catch {}
  }
}
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('bipul-theme') || 'dark'; } catch {}
setTheme(savedTheme, false);
themeToggle.addEventListener('click', () => {
  setTheme(themeToggle.getAttribute('aria-checked') === 'true' ? 'dark' : 'light');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  });
}, { threshold: .12 });
document.querySelectorAll('.section').forEach(section => observer.observe(section));

const dockLinks = [...document.querySelectorAll('.mobile-dock a')];
if (dockLinks.length) {
  const dockObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      dockLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
  dockLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) dockObserver.observe(section);
  });
}
