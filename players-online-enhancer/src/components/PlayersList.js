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
