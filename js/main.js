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

  fetchTotalDownloads('Shuash11/MathCalcu').then(() => initCounters());
  fetchLatestVersion('Shuash11/MathCalcu');
});

function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.countTo, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach((el) => observer.observe(el));
}

function animateCounter(el, target, suffix) {
  const duration = 1500;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, duration / steps);
}

async function fetchTotalDownloads(repo) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`);
    if (!res.ok) throw new Error(String(res.status));
    const releases = await res.json();
    const total = releases.reduce((sum, r) => {
      return sum + r.assets.reduce((s, a) => s + a.download_count, 0);
    }, 0);
    const statEl = document.getElementById('stat-downloads');
    if (statEl) statEl.dataset.countTo = total;
  } catch {
    // silently fail — counter will show 0
  }
}

async function fetchLatestVersion(repo) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    document.querySelectorAll('.latest-version').forEach(el => {
      el.textContent = `\u{1F4E6} Latest: ${data.tag_name}`;
    });
  } catch {
    document.querySelectorAll('.latest-version').forEach(el => el.remove());
  }
}
