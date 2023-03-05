modulejs.define('results-table', ['utils'], (utils) => {
  const { html, useState } = htmPreact;
  const {
    getItemUrl,
    getItemWikiUrl,
    getItemImageUrl,
    getMapImageUrl,
    getMapImageCoords,
    getMapFileFromName,
  } = utils;

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
                ${showHosters && html`<${HosterCell} hoster=${entry.hoster} />`}
                ${showOwners && html`<${OwnerCell} owner=${entry.owner} />`}
                <${BotCell} botName=${entry.botName} botUrl=${entry.botUrl} />
                ${hasSlotsAndEmu && html`<${SlotsCell} slots=${entry.slots} />`}
                ${hasSlotsAndEmu && html`<${EMUCell} emu=${entry.emu} />`}
                <${LocationCell}
                  mapName=${entry.mapName}
                  mapCoords=${entry.mapCoords}
                />
                ${action === 'Both' &&
                html`<${ActionCell} action=${entry.action} />`}
                <${QuantityCell} quantity=${entry.quantity} />
                <${PriceCell} price=${entry.price} />
                <${ItemCell} itemName=${entry.itemName} />
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  function HosterCell({ hoster }) {
    return html`<td class="align-middle text-muted">${hoster}</td>`;
  }

  function OwnerCell({ owner }) {
    return html`<td class="text-muted">${owner}</td>`;
  }

  function BotCell({ botName, botUrl }) {
    return html`
      <td class="align-middle">
        ${botUrl
          ? html`<a href=${botUrl} target="_blank">${botName}</a>`
          : botName}
      </td>
    `;
  }

  function SlotsCell({ slots }) {
    return html`
      <td class="align-middle text-end">
        <code>${slots}</code>
      </td>
    `;
  }

  function EMUCell({ emu }) {
    return html`
      <td class="align-middle text-end">
        <code>${emu}</code>
      </td>
    `;
  }

  function LocationCell({ mapName, mapCoords }) {
    const mapFile = getMapFileFromName(mapName);
    const [showPreview, setShowPreview] = useState(false);

    if (mapFile && showPreview) {
      return html`
        <td class="align-middle font-monospace small">
          <a
            href="#"
            onClick=${(event) => {
              event.preventDefault();
              setShowPreview(false);
            }}
            style="display: block; position: relative;"
          >
            <img
              src=${getMapImageUrl(mapFile)}
              class="map-preview border border-2 border-primary"
              title="Hide location preview"
            />
            <span
              class="map-marker"
              style=${getMapImageCoords(mapFile, mapCoords)}
            />
          </a>
        </td>
      `;
    }

    return html`
      <td class="align-middle font-monospace small">
        <div class="d-flex align-items-center">
          <a
            href="#"
            class="me-2 ${mapFile ? '' : 'map-preview-link-disabled'}"
            onClick=${(event) => {
              event.preventDefault();
              setShowPreview(!!mapFile);
            }}
          >
            <img
              src=${getMapImageUrl(mapFile)}
              class="map-thumbnail rounded-circle border border-2 border-primary"
              title=${mapFile
                ? 'Show location preview'
                : 'Location preview not available'}
            />
          </a>
          ${mapName} ${mapCoords.x},${mapCoords.y}
        </div>
      </td>
    `;
  }

  function ActionCell({ action }) {
    return html`<td class="align-middle fst-italic">${action}</td>`;
  }

  function QuantityCell({ quantity }) {
    return html`
      <td class="align-middle text-end">
        <code>${quantity}</code>
      </td>
    `;
  }

  function PriceCell({ price }) {
    return html`
      <td class="align-middle text-end">
        <code>${price.toFixed(2)}</code>
      </td>
    `;
  }

  function ItemCell({ itemName }) {
    return html`
      <td class="align-middle">
        <div class="d-flex align-items-center">
          <a href=${getItemWikiUrl(itemName)} class="me-2" target="_blank">
            <img
              src=${getItemImageUrl(itemName)}
              class="item-thumbnail rounded-circle border border-2 border-primary"
              title="View item info on EL Wiki"
            />
          </a>
          <a href=${getItemUrl(itemName)}>${itemName}</a>
        </div>
      </td>
    `;
  }

  return ResultsTable;
});
