modulejs.define('head', () => {
  function initialize() {
    // Nuke the <head> so that we can rebuild it from scratch.
    document.head.innerHTML = '';

    const title = document.createElement('title');
    title.textContent = 'EL Players Online';
    document.head.appendChild(title);

    // The page normally doesn't have a favicon, so let's add one. :)
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = 'http://www.eternal-lands.com/favicon.ico';
    document.head.appendChild(favicon);

    // Add a viewport meta tag so that media queries work nicely.
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width,initial-scale=1';
    document.head.appendChild(viewport);

    const style = document.createElement('style');
    style.innerHTML = `
      body {
        background: #222;
        color: #fff;
        font-family: sans-serif;
      }

      h2 {
        font-size: 18px;
      }

      input + select {
        margin-left: 10px;
      }

      ol {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 15px;
        margin: 0;
        padding: 0;
        list-style-type: none;
      }

      @media (min-width: 300px) {
        ol {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 500px) {
        ol {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (min-width: 700px) {
        ol {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (min-width: 900px) {
        ol {
          grid-template-columns: repeat(5, 1fr);
        }
      }

      @media (min-width: 1100px) {
        ol {
          grid-template-columns: repeat(6, 1fr);
        }
      }

      @media (min-width: 1300px) {
        ol {
          grid-template-columns: repeat(7, 1fr);
        }
      }

      ol li {
        display: flex;
        align-items: center;
      }

      ol li a {
        padding: 3px 5px;
        background: #555;
        font-size: 13px;
        font-family: monospace;
        text-decoration: none;
        border-radius: 4px;
      }

      ol li a:hover {
        filter: brightness(1.25);
      }

      ol li.human a {
        color: #fff;
      }

      ol li.bot a {
        color: #efa1ff;
      }

      ol li .pin-button {
        display: flex;
        width: 13px;
        height: 100%;
        padding: 0px 5px;
        cursor: pointer;
        fill: #ffd700;
        visibility: hidden;
      }

      ol li.pinned .pin-button:hover,
      ol li:not(.pinned):hover .pin-button:not(:hover) {
        fill: #999;
      }

      ol li.pinned .pin-button,
      ol li:not(.pinned) .pin-button:hover,
      ol li:not(.pinned) a:hover + .pin-button {
        visibility: visible;
      }

      ol li .pin-button:active {
        transform: scale(0.8);
      }
  `;
    document.head.appendChild(style);
  }

  return { initialize };
});
