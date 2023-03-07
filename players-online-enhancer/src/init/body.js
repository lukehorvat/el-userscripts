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
