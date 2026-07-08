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
});
