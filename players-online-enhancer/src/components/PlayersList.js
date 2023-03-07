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
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <span
                  class="pin-button"
                  onClick=${() => player.togglePin()}
                  title=${player.isPinned
                    ? 'Unpin from top of list'
                    : 'Pin to top of list'}
                >
                  <${StarIcon} />
                </span>
              </li>
            `;
          })}
      </ol>
    `;
  }

  function StarIcon() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <polygon
          points="41.504,39.537 60.062,0 78.618,39.538 120.115,45.877 90.088,76.653 97.176,120.107 60.061,99.593 22.946,120.107 30.035,76.653 0.01,45.878"
        />
      </svg>
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
