/**
 * DownloadManager.js
 * Class that handles download button logic per platform (Windows, Android).
 * Communicates via custom events if needed.
 */
export class DownloadManager {
  /**
   * @param {string} buttonSelector - CSS selector for download buttons (e.g. '[data-download]')
   */
  constructor(buttonSelector) {
    this.buttons = document.querySelectorAll(buttonSelector);
    if (!this.buttons.length) {
      console.warn('DownloadManager: No buttons found for selector:', buttonSelector);
      return;
    }

    this.init();
  }

  /**
   * Bind each button to its URL and platform
   */
  init() {
    this.buttons.forEach((button) => {
      const platform = button.dataset.download;
      const url = button.dataset.url;

      if (!url) {
        console.warn('DownloadManager: Button missing data-url attribute', button);
        return;
      }

      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleDownload(platform, url, button);
      });
    });
  }

  /**
   * Trigger download and show feedback state
   * @param {string} platform - 'windows' | 'android' | string
   * @param {string} url - download URL
   * @param {HTMLElement} button - the button element
   */
  handleDownload(platform, url, button) {
    // Dispatch custom event for other components to react
    const event = new CustomEvent('download-start', {
      detail: { platform, url, button },
      bubbles: true,
    });
    button.dispatchEvent(event);

    // Show feedback
    this.showFeedback(button);

    // Trigger the download after a brief delay for UX
    setTimeout(() => {
      window.location.href = url;

      // Dispatch complete event
      const completeEvent = new CustomEvent('download-complete', {
        detail: { platform, url, button },
        bubbles: true,
      });
      button.dispatchEvent(completeEvent);
    }, 400);
  }

  /**
   * Change button label to "Downloading..." for 2s, then reset
   * @param {HTMLElement} button
   */
  showFeedback(button) {
    const originalContent = button.innerHTML;
    const originalText = button.textContent.trim();

    // Store original content for restore
    button.dataset.originalContent = originalContent;

    // Get the icon element if it exists, preserve it
    const iconEl = button.querySelector('.icon');
    if (iconEl) {
      button.innerHTML = `${iconEl.outerHTML} Downloading...`;
    } else {
      button.textContent = 'Downloading...';
    }

    button.disabled = true;

    // Reset after 2 seconds
    setTimeout(() => {
      button.innerHTML = button.dataset.originalContent || originalContent;
      delete button.dataset.originalContent;
      button.disabled = false;
    }, 2000);
  }
}
