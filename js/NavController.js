export class NavController {
  constructor(navSelector, linksSelector, hamburgerSelector) {
    this.nav = document.querySelector(navSelector);
    this.linksContainer = document.querySelector(linksSelector);
    this.hamburger = document.querySelector(hamburgerSelector);
    this.links = this.linksContainer ? this.linksContainer.querySelectorAll('a') : [];
    this.sectionMap = new Map();
    this.visibleSections = new Set();
    this.isMenuOpen = false;

    if (!this.nav || !this.linksContainer || !this.hamburger) {
      console.warn('NavController: One or more selectors returned null.');
      return;
    }

    this.init();
  }

  init() {
    this.links.forEach((link) => link.classList.remove('active'));

    this.hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    this.links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const section = document.querySelector(href);
      if (!section) return;

      const sectionId = href.slice(1);
      this.sectionMap.set(sectionId, { section, link });

      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.setActive(sectionId);
        this.closeMenu();
        const headerHeight = this.nav.offsetHeight;
        const targetPosition = section.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.nav.contains(e.target)) {
        this.closeMenu();
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            this.visibleSections.add(id);
          } else {
            this.visibleSections.delete(id);
          }
        });

        let bestId = null;
        let bestTop = Infinity;
        this.visibleSections.forEach((id) => {
          const section = document.getElementById(id);
          if (section) {
            const top = section.getBoundingClientRect().top;
            if (top < bestTop) {
              bestTop = top;
              bestId = id;
            }
          }
        });

        if (bestId) {
          this.setActive(bestId);
        }
      },
      {
        rootMargin: '-80px 0px -50% 0px',
        threshold: 0,
      }
    );

    this.sectionMap.forEach(({ section }, id) => {
      observer.observe(section);
    });

    this.observer = observer;
  }

  setActive(sectionId) {
    this.links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.hamburger.classList.toggle('active');
    this.linksContainer.classList.toggle('open');
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.hamburger.classList.remove('active');
    this.linksContainer.classList.remove('open');
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
