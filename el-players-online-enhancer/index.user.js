// ==UserScript==
// @name        EL Players Online enhancer
// @version     1.0.0
// @author      Luke Horvat
// @description Enhances the EL Players Online page.
// @match       http://game.eternal-lands.com/online_players.htm
// @require     https://unpkg.com/htm@3.1.1/preact/standalone.umd.js
// ==/UserScript==

const { html, render, useState, useRef, useEffect } = htmPreact;

initHead();
initBody();

function initHead() {
  document.head.innerHTML = '';

  const title = document.createElement('title');
  title.textContent = 'EL Players Online';
  document.head.appendChild(title);

  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/x-icon';
  favicon.href = 'http://www.eternal-lands.com/favicon.ico';
  document.head.appendChild(favicon);

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

    select {
      margin-left: 10px;
    }

    ul {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 10px;
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    ul li a {
      padding: 3px 5px;
      background: #555;
      font-size: 12px;
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

function initBody() {
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

  document.body.innerHTML = '';

  render(html`<${App} players=${players} />`, document.body);
}

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
              <a href="${player.url}" target="_blank"> ${player.name} </a>
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
