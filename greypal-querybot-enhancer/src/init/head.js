modulejs.define('head', ['utils'], (utils) => {
  const { ITEM_THUMBNAIL_SIZE, MAP_THUMBNAIL_SIZE, MAP_PREVIEW_SIZE } = utils;

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
      .item-thumbnail {
        width: ${ITEM_THUMBNAIL_SIZE}px;
        height: ${ITEM_THUMBNAIL_SIZE}px;
        min-width: ${ITEM_THUMBNAIL_SIZE}px;
        min-height: ${ITEM_THUMBNAIL_SIZE}px;
      }

      .map-thumbnail {
        width: ${MAP_THUMBNAIL_SIZE}px;
        height: ${MAP_THUMBNAIL_SIZE}px;
        min-width: ${MAP_THUMBNAIL_SIZE}px;
        min-height: ${MAP_THUMBNAIL_SIZE}px;
      }

      .map-preview {
        width: ${MAP_PREVIEW_SIZE}px;
        height: ${MAP_PREVIEW_SIZE}px;
        min-width: ${MAP_PREVIEW_SIZE}px;
        min-height: ${MAP_PREVIEW_SIZE}px;
      }

      .item-thumbnail:hover,
      .map-thumbnail:hover,
      .map-preview:hover {
        filter: brightness(1.25);
      }

      .map-preview-link-disabled {
        pointer-events: none;
      }

      .map-marker {
        position: absolute;
        width: 1px;
        height: 1px;
        border-radius: 100%;
        background: rgb(255, 255, 0);
        box-shadow: 0px 0px 1px 1px rgba(255, 255, 0, 0.2);
        animation: pulse 0.5s infinite alternate;
      }

      @keyframes pulse {
        100% {
          transform: scale(15);
        }
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
