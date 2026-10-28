// Replace each project's youtube value with an unlisted YouTube URL when you're ready.

const projects = [
  { title: 'Shabang HighRise', client: 'Sample Project', category: '', image: 'photo-1441974231531-c6227db76b6e', youtube: 'https://youtu.be/ka4ZClQd04k' },
  { title: 'Classy Girls', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/96fqt3d1bW8?feature=share' },
  { title: 'Pop dat thing', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/ySiHSCM7N9Y?feature=share' },
  { title: 'Outside Today', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/omC6cmrX89k?feature=share' },
  { title: 'Kakalika', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/-8ylZEZ0hew?feature=share' },
  { title: 'Personal Brand 1', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/c6PBUYPMOP0?feature=share' },
  { title: 'Personal Brand 2', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/vEb7D38J7q4?feature=share' },
  { title: 'Live Interviews', client: 'Sample Project', category: '', image: '', youtube: 'https://youtu.be/4rX4nM7UQI8' },
  { title: 'Lyrics Video', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/CGyXDTb2BTs?feature=share' },
  { title: 'Lyrics Video 2', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/ZMES6v5NB2U?feature=share' },
  { title: 'Lyrics Video 3', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/gY3nIdRyjRw?feature=share' },
  { title: 'Talking AD', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/IWt2DWgPQic?feature=share' },
  { title: 'Talking AD 2', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/cdUVVcZSSw0?feature=share' },
  { title: 'Talking AD 3', client: 'Sample Project', category: '', image: '', youtube: 'https://youtube.com/shorts/-28fCxzRT4Y?feature=share' }
];

const grid = document.querySelector('#project-grid');
let projectVideoObserver = null;
let activeProjectMedia = null;
const projectVisibility = new Map();
function renderProjects(filter = 'All Work') {
  const visible = projects.filter(project => filter === 'All Work' || project.category === filter);
  grid.innerHTML = visible.map(project => {
    const videoId = getYouTubeId(project.youtube);
    const thumbnail = videoId
      ? `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/maxresdefault.jpg`
      : `https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1200&q=82`;
    const fallbackUrl = videoId ? `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg` : '';
    const thumbnailFallback = fallbackUrl ? `data-fallback="${fallbackUrl}"` : '';
    const responsiveSources = videoId ? '' : `srcset="https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=640&q=78 640w, https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=960&q=80 960w, https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1200&q=82 1200w"`;
    return `
      <article class="project-card">
        <div class="project-media" data-youtube="${escapeAttribute(project.youtube)}" data-thumbnail="${escapeAttribute(thumbnail)}" data-thumbnail-fallback="${escapeAttribute(fallbackUrl)}" data-project-title="${escapeAttribute(project.title)}" role="button" tabindex="0" aria-label="Play ${escapeAttribute(project.title)}">
          <img src="${thumbnail}" ${thumbnailFallback} ${responsiveSources} sizes="(max-width: 650px) calc(100vw - 44px), (max-width: 900px) 46vw, 48vw" alt="${escapeAttribute(project.title)} project still" loading="lazy" decoding="async">
          <span class="play-button" aria-hidden="true">▷</span>
        </div>
        <div class="project-meta"><div><h3>${escapeAttribute(project.title)}</h3><p>${escapeAttribute(project.client)}</p></div>${project.category ? `<span class="tag">${escapeAttribute(project.category)}</span>` : ''}</div>
      </article>`;
  }).join('');
  attachThumbnailFallbacks(grid);
  grid.querySelectorAll('.project-media').forEach(media => projectVideoObserver?.observe(media));
}
function escapeAttribute(value) { return String(value).replace(/[&"<>']/g, char => ({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;',"'":'&#39;'}[char])); }
renderProjects();

function attachThumbnailFallbacks(scope) {
  scope.querySelectorAll('img[data-fallback]').forEach(image => image.addEventListener('error', () => {
    image.src = image.dataset.fallback;
    image.removeAttribute('srcset');
    image.removeAttribute('data-fallback');
  }, { once: true }));
}

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

function sendPlayerCommand(media, command) {
  const iframe = media.querySelector('iframe');
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), '*');
}
function setProjectSound(media, enabled) {
  sendPlayerCommand(media, enabled ? 'unMute' : 'mute');
}
function restoreProjectPoster(media) {
  const title = media.dataset.projectTitle || 'Portfolio video';
  const fallback = media.dataset.thumbnailFallback
    ? `data-fallback="${escapeAttribute(media.dataset.thumbnailFallback)}"`
    : '';
  media.innerHTML = `<img src="${escapeAttribute(media.dataset.thumbnail)}" ${fallback} sizes="(max-width: 650px) calc(100vw - 44px), (max-width: 900px) 46vw, 48vw" alt="${escapeAttribute(title)} project still" loading="lazy" decoding="async"><span class="play-button" aria-hidden="true">▷</span>`;
  media.setAttribute('role', 'button');
  media.setAttribute('tabindex', '0');
  media.setAttribute('aria-label', `Play ${title}`);
  attachThumbnailFallbacks(media);
}
function stopProjectMedia(media) {
  if (media?.querySelector('iframe')) restoreProjectPoster(media);
}
function playProject(media, { userInitiated = false, trySound = false } = {}) {
  const url = media.dataset.youtube.trim();
  if (!url) {
    media.classList.add('needs-video');
    window.setTimeout(() => media.classList.remove('needs-video'), 1800);
    return;
  }
  const videoId = getYouTubeId(url);
  if (!videoId) return;
  if (media.querySelector('iframe')) {
    sendPlayerCommand(media, 'playVideo');
    if (userInitiated) setProjectSound(media, true);
    else if (trySound) setProjectSound(media, true);
    return;
  }
  const origin = location.origin.startsWith('http') ? `&origin=${encodeURIComponent(location.origin)}` : '';
  media.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&mute=${userInitiated ? 0 : 1}&controls=1&playsinline=1&enablejsapi=1&rel=0${origin}" title="${escapeAttribute(media.dataset.projectTitle)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  media.removeAttribute('role');
  media.removeAttribute('tabindex');
  media.removeAttribute('aria-label');
  if (trySound && !userInitiated) {
    media.querySelector('iframe').addEventListener('load', () => {
      if (activeProjectMedia === media && media.matches(':hover')) setProjectSound(media, true);
    }, { once: true });
  }
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
  if (media) {
    if (activeProjectMedia && activeProjectMedia !== media) stopProjectMedia(activeProjectMedia);
    activeProjectMedia = media;
    playProject(media, { userInitiated: true });
  }
});
grid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.project-media')) {
    event.preventDefault();
    if (activeProjectMedia && activeProjectMedia !== event.target) stopProjectMedia(activeProjectMedia);
    activeProjectMedia = event.target;
    playProject(event.target, { userInitiated: true });
  }
});

// Desktop playback follows the pointer. Touch devices play only the card that
// occupies the strongest part of the viewport. Leaving focus restores its poster.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
if ('IntersectionObserver' in window) {
  projectVideoObserver = new IntersectionObserver(entries => {
    if (finePointer.matches) return;
    entries.forEach(entry => projectVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
    const nextMedia = [...projectVisibility.entries()]
      .filter(([, ratio]) => ratio >= .58)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    if (nextMedia === activeProjectMedia) return;
    if (activeProjectMedia) stopProjectMedia(activeProjectMedia);
    activeProjectMedia = nextMedia;
    if (activeProjectMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) playProject(activeProjectMedia);
  }, { threshold: [.58, .8], rootMargin: '0px' });
  grid.querySelectorAll('.project-media').forEach(media => projectVideoObserver.observe(media));
}
grid.addEventListener('pointerover', event => {
  const media = event.target.closest('.project-media');
  if (!media || !finePointer.matches || event.pointerType !== 'mouse' || media.contains(event.relatedTarget)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (activeProjectMedia && activeProjectMedia !== media) stopProjectMedia(activeProjectMedia);
  activeProjectMedia = media;
  if (media.querySelector('iframe')) {
    sendPlayerCommand(media, 'playVideo');
    setProjectSound(media, true);
  } else playProject(media, { trySound: true });
});
grid.addEventListener('pointerout', event => {
  const media = event.target.closest('.project-media');
  if (!media || !finePointer.matches || media.contains(event.relatedTarget)) return;
  if (activeProjectMedia === media) {
    stopProjectMedia(media);
    activeProjectMedia = null;
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
    if (!link.hash) return;
    const section = document.querySelector(link.hash);
    if (section) dockObserver.observe(section);
  });
}
