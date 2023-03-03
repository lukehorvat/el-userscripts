modulejs.define('head', () => {
  function initialize() {
    // Add bootstrap stylesheet.
    const bootstrap = document.createElement('link');
    bootstrap.href =
      'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
    bootstrap.rel = 'stylesheet';
    bootstrap.crossorigin = 'anonymous';
    document.head.appendChild(bootstrap);

    // Add custom styles.
    const style = document.createElement('style');
    style.innerHTML = `
      .item-image {
        width: 36px;
      }

      .item-image:hover {
        filter: brightness(1.25);
      }

      .countdown {
        position: absolute;
        top: 0;
        right: 0;
      }
  `;
    document.head.appendChild(style);
  }

  return { initialize };
});
