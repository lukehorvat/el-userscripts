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
