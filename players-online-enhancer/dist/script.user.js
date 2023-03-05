// ==UserScript==
// @name        EL Players Online enhancer
// @version     1.1.0
// @author      Luke Horvat
// @description Enhances the EL Players Online page.
// @match       http://game.eternal-lands.com/online_players.htm
// @require     https://unpkg.com/modulejs@2.9.0/dist/modulejs.js
// @require     https://unpkg.com/htm@3.1.1/preact/standalone.umd.js
// ==/UserScript==

modulejs.define('app', () => {
  const { html, useState, useRef, useEffect } = htmPreact;

  function App({ players }) {
    const queryInput = useRef();
    const [query, setQuery] = useState('');
    const [type, setType] = useState('human');
    const filteredPlayers = players
      .filter((player) => !!player.name.match(new RegExp(query, 'i')))
      .filter((player) => !type || player.type === type);

    useEffect(() => {
      queryInput.current.focus(); // autofocus it
    }, [type]);

    return html`
      <div>
        <input
          type="text"
          onInput=${onQueryChange}
          value=${query}
          placeholder="Search players (regex)"
          ref=${queryInput}
        />
        <select onChange=${onTypeChange} value=${type}>
          <option value="human">Humans</option>
          <option value="bot">Bots</option>
          <option value="">All</option>
        </select>
        <h2>${filteredPlayers.length} online</h2>
        <ul class="playerList">
          ${filteredPlayers.map(
            (player) => html`
              <li class="player ${player.type}">
                <a href=${player.url} target="_blank">${player.name}</a>
              </li>
            `
          )}
        </ul>
      </div>
    `;

    function onQueryChange(event) {
      setQuery(event.target.value);
    }

    function onTypeChange(event) {
      setType(event.target.value);
    }
  }

  return App;
});

modulejs.define('body', ['app'], (App) => {
  const { html, render } = htmPreact;

  function initialize() {
    // Extract data from the page.
    const humanCount = Number(
      document.querySelector('b').textContent.match(/(\d+)/)[1]
    );
    const players = Array.from(document.querySelectorAll('a'))
      .map((link, index) => ({
        type: index < humanCount ? 'human' : 'bot',
        name: link.textContent,
        url: link.href,
      }))
      .sort((player1, player2) => player1.name.localeCompare(player2.name));

    // Nuke the <body> so that we can render our own app.
    document.body.innerHTML = '';

    render(html`<${App} players=${players} />`, document.body);
  }

  return { initialize };
});

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

      ul {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
        margin: 0;
        padding: 0;
        list-style-type: none;
      }

      @media (min-width: 400px) {
        ul {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (min-width: 600px) {
        ul {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (min-width: 800px) {
        ul {
          grid-template-columns: repeat(5, 1fr);
        }
      }

      @media (min-width: 1000px) {
        ul {
          grid-template-columns: repeat(6, 1fr);
        }
      }

      @media (min-width: 1200px) {
        ul {
          grid-template-columns: repeat(7, 1fr);
        }
      }

      ul li a {
        padding: 3px 5px;
        background: #555;
        font-size: 13px;
        font-family: monospace;
        text-decoration: none;
        border-radius: 4px;
      }

      ul li a:hover {
        filter: brightness(1.25);
      }

      ul li.human a {
        color: #fff;
      }

      ul li.bot a {
        color: #efa1ff;
      }
  `;
    document.head.appendChild(style);
  }

  return { initialize };
});

modulejs.define('main', ['head', 'body'], (head, body) => {
  head.initialize();
  body.initialize();
});

modulejs.require('main');
