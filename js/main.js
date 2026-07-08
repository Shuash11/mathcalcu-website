/**
 * main.js — Entry point
 * Instantiates all classes: NavController, ScrollObserver, DownloadManager.
 * Also fetches live GitHub contributor data if available.
 */
import { ScrollObserver } from './ScrollObserver.js';
import { NavController } from './NavController.js';
import { DownloadManager } from './DownloadManager.js';
import { TeamCarousel } from './TeamCarousel.js';

document.addEventListener('DOMContentLoaded', () => {
  new NavController('#main-nav', '.nav-links', '#hamburger');

  const scrollObserver = new ScrollObserver('.reveal', {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });
  scrollObserver.observe();

  new DownloadManager('[data-download]');

  new TeamCarousel('.team-scroll');

  fetchTotalDownloads('Shuash11/MathCalcu');
});

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

async function fetchTotalDownloads(repo) {
  const el = document.getElementById('download-count');
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`);
    if (!res.ok) throw new Error(String(res.status));
    const releases = await res.json();
    const total = releases.reduce((sum, r) => {
      return sum + r.assets.reduce((s, a) => s + a.download_count, 0);
    }, 0);
    el.textContent = formatNumber(total);
    const statEl = document.getElementById('stat-downloads');
    if (statEl) statEl.textContent = formatNumber(total);
  } catch {
    el.textContent = '—';
  }
}
