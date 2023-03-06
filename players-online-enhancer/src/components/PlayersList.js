modulejs.define('players-list', () => {
  const { html } = htmPreact;

  function PlayersList({ players }) {
    return html`
      <h2>${players.length} online</h2>
      <ol>
        ${players.map(
          (player) => html`
            <li class="player ${player.type}">
              <a href=${player.url} target="_blank">${player.name}</a>
            </li>
          `
        )}
      </ol>
    `;
  }

  return PlayersList;
});
