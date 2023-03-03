modulejs.define('countdown', ['preact'], ({ html }) => {
  function Countdown() {
    return html`
      <div class="countdown text-muted small px-4 py-2">
        Next update in <span id="second">60</span> seconds
      </div>
    `;
  }

  return Countdown;
});
