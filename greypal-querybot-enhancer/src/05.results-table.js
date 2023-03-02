function ResultsTable({
  results: { entries, hasSlotsAndEmu },
  action,
  showHosters,
  showOwners,
}) {
  if (entries.length <= 0) {
    return html`
      <div class="alert alert-danger" role="alert">No items found.</div>
    `;
  }

  return html`
    <table class="table table-bordered table-hover mt-2">
      <thead>
        <tr>
          ${showHosters && html`<th>Hoster</th>`}
          ${showOwners && html`<th>Owner</th>`}
          <th>
            ${(() => {
              switch (action) {
                case 'Buy':
                  return 'Bot (seller)';
                case 'Sell':
                  return 'Bot (buyer)';
                default:
                  return 'Bot';
              }
            })()}
          </th>
          ${hasSlotsAndEmu && html`<th>Slots</th>`}
          ${hasSlotsAndEmu && html`<th>EMU</th>`}
          <th>Location</th>
          ${action === 'Both' && html`<th>Action</th>`}
          <th>Quantity</th>
          <th>Price (gc)</th>
          <th>Item</th>
        </tr>
      </thead>
      <tbody>
        ${entries.map(
          (entry) => html`
            <tr>
              ${showHosters &&
              html`<td class="align-middle text-muted">${entry.hoster}</td>`}
              ${showOwners && html`<td class="text-muted">${entry.owner}</td>`}
              <td class="align-middle">
                ${entry.botUrl
                  ? html`
                      <a href=${entry.botUrl} target="_blank">
                        ${entry.botName}
                      </a>
                    `
                  : entry.botName}
              </td>
              ${hasSlotsAndEmu &&
              html`<td class="align-middle text-end">
                <code>${entry.slots}</code>
              </td>`}
              ${hasSlotsAndEmu &&
              html`<td class="align-middle text-end">
                <code>${entry.emu}</code>
              </td>`}
              <td class="align-middle font-monospace small">
                ${entry.location}
              </td>
              ${action === 'Both' &&
              html`<td class="align-middle fst-italic">${entry.action}</td>`}
              <td class="align-middle text-end">
                <code>${entry.quantity}</code>
              </td>
              <td class="align-middle text-end">
                <code>${entry.price.toFixed(2)}</code>
              </td>
              <td class="d-flex align-items-center">
                <a
                  href=${getItemWikiUrl(entry.itemName)}
                  class="me-2"
                  target="_blank"
                >
                  <img
                    src=${getItemImageUrl(entry.itemName)}
                    class="item-image rounded-circle border border-2 border-primary"
                    title="View item info on EL Wiki"
                  />
                </a>
                <a href=${getItemUrl(entry.itemName)}>${entry.itemName}</a>
              </td>
            </tr>
          `
        )}
      </tbody>
    </table>
  `;
}
