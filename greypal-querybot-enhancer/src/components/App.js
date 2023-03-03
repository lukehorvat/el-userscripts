modulejs.define(
  'app',
  ['preact', 'form', 'results-table', 'summary-table', 'countdown', 'footer'],
  ({ html }, Form, ResultsTable, SummaryTable, Countdown, Footer) => {
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

    return App;
  }
);
