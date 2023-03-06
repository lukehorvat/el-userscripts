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
