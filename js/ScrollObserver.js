/**
 * ScrollObserver.js
 * Class that handles Intersection Observer scroll reveal animations.
 * Communicates via custom events if needed.
 */
export class ScrollObserver {
  /**
   * @param {string} selector - CSS selector for elements to observe (e.g. '.reveal')
   * @param {object} options - IntersectionObserver options
   * @param {number} options.threshold - Visibility threshold (default 0.15)
   * @param {string} options.rootMargin - Root margin (default '0px 0px -60px 0px')
   */
  constructor(selector, options = {}) {
    this.selector = selector;
    this.options = {
      threshold: options.threshold ?? 0.15,
      rootMargin: options.rootMargin ?? '0px 0px -60px 0px',
    };
    this.elements = document.querySelectorAll(this.selector);
    this.observer = null;
  }

  /**
   * Attach IntersectionObserver to all matching elements.
   * Adds .visible class when element enters viewport.
   */
  observe() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      this.elements.forEach((el) => el.classList.add('visible'));
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.unobserve(entry.target);
        }
      });
    }, this.options);

    this.elements.forEach((el) => this.observer.observe(el));
  }

  /**
   * Stop observing a specific element once revealed — performance.
   * @param {Element} el
   */
  unobserve(el) {
    if (this.observer) {
      this.observer.unobserve(el);
    }
  }

  /**
   * Cleanup: disconnect observer
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}