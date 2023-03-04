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
