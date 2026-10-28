// Replace each video's youtube value with an unlisted YouTube URL when you're ready.
// Add the unlisted YouTube URL for the home page background video here.
const HERO_YOUTUBE_URL = '';

const projects = [
  { title: 'Into the quiet', client: 'Terra Films · Sample project', category: 'Documentary', image: 'photo-1441974231531-c6227db76b6e', youtube: '' },
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
        <img src="https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1200&q=82" alt="${escapeAttribute(project.title)} project still" loading="lazy">
        <span class="play-button" aria-hidden="true">▷</span>
      </div>
      <div class="project-meta"><div><h3>${project.title}</h3><p>${project.client}</p></div><span class="tag">${project.category}</span></div>
    </article>`).join('');
}
function escapeAttribute(value) { return String(value).replace(/[&"<>']/g, char => ({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;',"'":'&#39;'}[char])); }
renderProjects();

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

function setupHeroVideo() {
  const videoId = getYouTubeId(HERO_YOUTUBE_URL);
  if (!videoId) return;
  const layer = document.createElement('div');
  layer.className = 'hero-video';
  layer.setAttribute('aria-hidden', 'true');
  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(videoId)}&controls=0&modestbranding=1&playsinline=1&rel=0`;
  layer.innerHTML = `<iframe src="${embedUrl}" title="" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" tabindex="-1"></iframe>`;
  document.querySelector('.hero').prepend(layer);
}
setupHeroVideo();

grid.addEventListener('click', event => {
  const media = event.target.closest('.project-media');
  if (media) playProject(media);
});
grid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.project-media')) {
    event.preventDefault(); playProject(event.target);
  }
});

const menuButton = document.querySelector('.menu-toggle');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  document.querySelector('.main-nav').classList.toggle('open', !open);
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  document.querySelector('.main-nav').classList.remove('open');
}));

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Video editing inquiry — ${form.get('type')}`);
  const body = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\nProject type: ${form.get('type')}\n\n${form.get('message')}`);
  document.querySelector('.form-feedback').textContent = 'Opening your email app…';
  window.location.href = `mailto:sarkarbipul05286@gmail.com?subject=${subject}&body=${body}`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  });
}, { threshold: .12 });
document.querySelectorAll('.section').forEach(section => observer.observe(section));
