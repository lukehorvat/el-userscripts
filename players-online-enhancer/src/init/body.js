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
