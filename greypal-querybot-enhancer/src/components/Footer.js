modulejs.define('footer', ['preact'], ({ html }) => {
  function Footer() {
    const isProduction = !window.location.pathname.endsWith('-dev');
    return html`
      <footer class="card text-muted text-center small p-2">
        <a href=${isProduction ? '/cgi-bin/querybot-dev' : '/cgi-bin/querybot'}>
          Switch to ${isProduction ? 'development' : 'production'} version
        </a>
        <a href="/csv-doc.html">Info for bot owners</a>
      </footer>
    `;
  }

  return Footer;
});
