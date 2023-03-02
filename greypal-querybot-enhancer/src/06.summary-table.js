function SummaryTable({ results: { entries }, action }) {
  const summarisedItemPrices = summariseItemPrices(entries, action);

  if (summarisedItemPrices.length <= 0) {
    return null;
  }

  return html`
    <table class="table table-bordered table-hover mt-2">
      <thead>
        <tr>
          <th>${action}</th>
          <th>Min (gc)</th>
          <th>Average (gc)</th>
          <th>Max (gc)</th>
        </tr>
      </thead>
      <tbody>
        ${summarisedItemPrices
          .sort(([itemName1], [itemName2]) =>
            itemName1.localeCompare(itemName2)
          )
          .map(
            ([itemName, summary]) =>
              html`
                <tr>
                  <td class="d-flex align-items-center">
                    <a
                      href=${getItemWikiUrl(itemName)}
                      class="me-2"
                      target="_blank"
                    >
                      <img
                        src=${getItemImageUrl(itemName)}
                        class="item-image rounded-circle border border-2 border-primary"
                        title="View item info on EL Wiki"
                      />
                    </a>
                    <a href=${getItemUrl(itemName)}>${itemName}</a>
                  </td>
                  <td class="align-middle text-end">
                    <code>${summary.minPrice.toFixed(2)}</code>
                  </td>
                  <td class="align-middle text-end">
                    <code>${summary.avgPrice.toFixed(2)}</code>
                  </td>
                  <td class="align-middle text-end">
                    <code>${summary.maxPrice.toFixed(2)}</code>
                  </td>
                </tr>
              `
          )}
      </tbody>
    </table>
  `;
}
