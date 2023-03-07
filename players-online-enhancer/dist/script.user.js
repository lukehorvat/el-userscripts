// ==UserScript==
// @name        EL Players Online enhancer
// @version     1.1.0
// @author      Luke Horvat
// @description Enhances the EL Players Online page.
// @match       http://game.eternal-lands.com/online_players.htm
// @require     https://unpkg.com/modulejs@2.9.0/dist/modulejs.js
// @require     https://unpkg.com/htm@3.1.1/preact/standalone.umd.js
// ==/UserScript==

modulejs.define('app', ['form', 'players-list'], (Form, PlayersList) => {
  const { html, useState } = htmPreact;

  function App({ players }) {
    const [filteredPlayers, setFilteredPlayers] = useState();

    return html`
      <${Form} players=${players} onFilterChange=${setFilteredPlayers} />
      ${filteredPlayers && html`<${PlayersList} players=${filteredPlayers} />`}
    `;
  }

  return App;
});

modulejs.define('form', () => {
  const { html, useState, useRef, useEffect } = htmPreact;

  function Form({ players, onFilterChange }) {
    const queryInput = useRef();
    const [query, setQuery] = useState('');
    const [type, setType] = useState('human');

    useEffect(() => {
      onFilterChange(
        players
          .filter((player) => !!player.name.match(new RegExp(query, 'i')))
          .filter((player) => !type || player.type === type)
      );
    }, [query, type]);

    useEffect(() => {
      queryInput.current.focus(); // autofocus it
    }, [type]);

    return html`
      <input
        type="text"
        value=${query}
        onInput=${(event) => setQuery(event.target.value)}
        ref=${queryInput}
        placeholder="Search players (regex)"
      />
      <select value=${type} onChange=${(event) => setType(event.target.value)}>
        <option value="human">Humans</option>
        <option value="bot">Bots</option>
        <option value="">All</option>
      </select>
    `;
  }

  return Form;
});

modulejs.define('players-list', () => {
  const { html, useState, useEffect } = htmPreact;

  function PlayersList({ players }) {
    const [pins, setPins] = useState(() => readPinsFromStorage());

    useEffect(() => {
      writePinsToStorage(pins);
    }, [pins]);

    return html`
      <h2>${players.length} online</h2>
      <ol>
        ${players
          .map((player) => ({
            ...player,
            isPinned: pins.includes(player.name.toLowerCase()),
            togglePin() {
              const pinsSet = new Set(pins);
              if (this.isPinned) {
                pinsSet.delete(player.name.toLowerCase());
              } else {
                pinsSet.add(player.name.toLowerCase());
              }
              setPins([...pinsSet]);
            },
          }))
          .sort((player1, player2) => {
            if (player1.isPinned && !player2.isPinned) {
              return -1;
            } else if (!player1.isPinned && player2.isPinned) {
              return 1;
            } else {
              return player1.name.localeCompare(player2.name);
            }
          })
          .map((player) => {
            return html`
              <li
                class="player ${player.type} ${player.isPinned ? 'pinned' : ''}"
              >
                <a href=${player.url} target="_blank">${player.name}</a>
                <button
                  onClick=${() => player.togglePin()}
                  title=${player.isPinned
                    ? 'Unpin player from top of list'
                    : 'Pin player to top of list'}
                >
                  📌
                </button>
              </li>
            `;
          })}
      </ol>
    `;
  }

  function writePinsToStorage(pins) {
    return localStorage.setItem('pins', JSON.stringify(pins));
  }

  function readPinsFromStorage() {
    return JSON.parse(localStorage.getItem('pins')) || [];
  }

  return PlayersList;
});

modulejs.define('body', ['app'], (App) => {
  const { html, render } = htmPreact;

  function initialize() {
    // Extract data from the page.
    const players = extractPlayers();

    // Nuke the <body> and render our own app in its place.
    document.body.innerHTML = '';
    render(html`<${App} players=${players} />`, document.body);
  }

  function extractPlayers() {
    const humanCount = Number(
      document.querySelector('b').textContent.match(/(\d+)/)[1]
    );
    const players = [...document.querySelectorAll('a')].map((link, index) => ({
      type: index < humanCount ? 'human' : 'bot',
      name: link.textContent,
      url: link.href,
    }));

    return players;
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

      ol {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
        margin: 0;
        padding: 0;
        list-style-type: none;
      }

      @media (min-width: 400px) {
        ol {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (min-width: 600px) {
        ol {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (min-width: 800px) {
        ol {
          grid-template-columns: repeat(5, 1fr);
        }
      }

      @media (min-width: 1000px) {
        ol {
          grid-template-columns: repeat(6, 1fr);
        }
      }

      @media (min-width: 1200px) {
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

      ol li button {
        all: unset; /* TODO: Is this the correct way to clear button styles? */
        margin-left: 5px;
        cursor: pointer;
      }

      ol li:not(.pinned):not(:hover) button {
        visibility: hidden;
      }

      ol li.pinned button:hover,
      ol li:not(.pinned):hover button:not(:hover) {
        filter: grayscale(1);
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
