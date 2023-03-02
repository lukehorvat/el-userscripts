function App({ params, results }) {
  return html`
    <div class="container-fluid p-4">
      <${Form} params=${params} />
      ${!!params.item &&
      html`<${ResultsTable}
          results=${results}
          action=${params.action}
          showHosters=${params.showHosters}
          showOwners=${params.showOwners}
        />
        <${SummaryTable} results=${results} action="Buying" />
        <${SummaryTable} results=${results} action="Selling" />`}
      <${Countdown} />
      <${Footer} />
    </div>
  `;
}
