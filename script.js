// Replace each project's youtube value with an unlisted YouTube URL when you're ready.

const projects = [
  { title: 'Shabang HighRise', client: 'Sample Project', category: '', image: 'photo-1441974231531-c6227db76b6e', youtube: 'https://youtu.be/ka4ZClQd04k' },
  { title: 'Classy Girls', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/96fqt3d1bW8?feature=share' },
  { title: 'Pop dat thing', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/ySiHSCM7N9Y?feature=share' },
  { title: 'Outside Today', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/omC6cmrX89k?feature=share' },
  { title: 'Kakalika', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/-8ylZEZ0hew?feature=share' },
  { title: 'Personal Brand 1', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/c6PBUYPMOP0?feature=share' },
  { title: 'Personal Brand 2', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/vEb7D38J7q4?feature=share' },
  { title: 'Live Interviews', client: 'Sample Project', category: '', image: '', youtube: 'https://youtu.be/4rX4nM7UQI8' }
];

const grid = document.querySelector('#project-grid');
function renderProjects(filter = 'All Work') {
  const visible = projects.filter(project => filter === 'All Work' || project.category === filter);
  grid.innerHTML = visible.map(project => {
    const videoId = getYouTubeId(project.youtube);
    const thumbnail = videoId
      ? `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/maxresdefault.jpg`
      : `https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1200&q=82`;
    const thumbnailFallback = videoId ? `data-fallback="https://img.youtube.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg"` : '';
    const responsiveSources = videoId ? '' : `srcset="https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=640&q=78 640w, https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=960&q=80 960w, https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1200&q=82 1200w"`;
    return `
      <article class="project-card">
        <div class="project-media" data-youtube="${escapeAttribute(project.youtube)}" role="button" tabindex="0" aria-label="Play ${escapeAttribute(project.title)}">
          <img src="${thumbnail}" ${thumbnailFallback} ${responsiveSources} sizes="(max-width: 650px) calc(100vw - 44px), (max-width: 900px) 46vw, 48vw" alt="${escapeAttribute(project.title)} project still" loading="lazy" decoding="async">
          <span class="play-button" aria-hidden="true">▷</span>
        </div>
        <div class="project-meta"><div><h3>${escapeAttribute(project.title)}</h3><p>${escapeAttribute(project.client)}</p></div>${project.category ? `<span class="tag">${escapeAttribute(project.category)}</span>` : ''}</div>
      </article>`;
  }).join('');
  grid.querySelectorAll('img[data-fallback]').forEach(image => image.addEventListener('error', () => {
    image.src = image.dataset.fallback;
    image.removeAttribute('srcset');
    image.removeAttribute('data-fallback');
  }, { once: true }));
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
