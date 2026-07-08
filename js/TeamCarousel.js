export class TeamCarousel {
  constructor(selector) {
    this.el = document.querySelector(selector);
    if (!this.el) return;
    this.speed = 1;
    this.paused = false;
    this.timer = null;
    this.int = null;
    this.start();
  }

  start() {
    this.el.addEventListener('wheel', () => this.stop(), { passive: true });
    this.el.addEventListener('touchstart', () => this.stop(), { passive: true });
    this.int = setInterval(() => {
      if (this.paused) return;
      const max = this.el.scrollWidth - this.el.clientWidth;
      if (this.el.scrollLeft >= max - 60) {
        this.el.scrollLeft = 0;
      }
      this.el.scrollLeft += this.speed;
    }, 16);
  }

  stop() {
    this.paused = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.paused = false; }, 3000);
  }
}
