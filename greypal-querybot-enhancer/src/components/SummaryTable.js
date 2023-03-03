modulejs.define(
  'summary-table',
  ['preact', 'utils'],
  ({ html }, { getItemUrl, getItemImageUrl, getItemWikiUrl }) => {
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

    function summariseItemPrices(entries, action) {
      const pricesPerItem = entries
        .filter((entry) => entry.action === action)
        .reduce((map, entry) => {
          const itemPrices = map.get(entry.itemName) || [];
          return map.set(entry.itemName, [...itemPrices, entry.price]);
        }, new Map());
      const summaryPerItem = [...pricesPerItem].reduce(
        (map, [itemName, itemPrices]) => {
          const minPrice = Math.min(...itemPrices);
          const maxPrice = Math.max(...itemPrices);
          const avgPrice =
            itemPrices.reduce((sum, price) => sum + price) / itemPrices.length;
          return map.set(itemName, { minPrice, maxPrice, avgPrice });
        },
        new Map()
      );
      return [...summaryPerItem];
    }

    return SummaryTable;
  }
);
