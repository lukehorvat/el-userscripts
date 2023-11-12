// ==UserScript==
// @name        EL Greypal Querybot enhancer
// @version     2.2.1
// @author      Luke Horvat
// @description Enhances Greypal's Querybot page.
// @match       https://greypal.el-fd.org/cgi-bin/querybot*
// @require     https://unpkg.com/modulejs@2.9.0/dist/modulejs.js
// @require     https://unpkg.com/htm@3.1.1/preact/standalone.umd.js
// @require     https://github.com/lukehorvat/el-userscripts/raw/item-images/dist/item-image-ids.js
// @require     https://github.com/lukehorvat/el-userscripts/raw/map-images/dist/map-sizes.js
// ==/UserScript==

modulejs.define(
  'app',
  ['form', 'results-table', 'summary-table', 'countdown', 'footer'],
  (Form, ResultsTable, SummaryTable, Countdown, Footer) => {
    const { html } = htmPreact;

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

modulejs.define('countdown', () => {
  const { html } = htmPreact;

  function Countdown() {
    return html`
      <div class="countdown text-muted small px-4 py-2">
        Next update in <span id="second">60</span> seconds
      </div>
    `;
  }

  return Countdown;
});

modulejs.define('footer', () => {
  const { html } = htmPreact;

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

modulejs.define('form', () => {
  const { html, useState, useRef, useEffect } = htmPreact;

  function Form({ params }) {
    const [item, setItem] = useState(params.item);
    const [action, setAction] = useState(params.action);
    const [sets, setSets] = useState(params.sets);
    const [showEmpty, setShowEmpty] = useState(params.showEmpty);
    const [hideNPCs, setHideNPCs] = useState(params.hideNPCs);
    const [showHosters, setShowHosters] = useState(params.showHosters);
    const [showOwners, setShowOwners] = useState(params.showOwners);
    const itemInput = useRef();

    useEffect(() => {
      itemInput.current.focus(); // autofocus it
    }, [sets]);

    return html`
      <form
        name="querybot"
        action=${window.location.pathname}
        class="card mt-2 p-2 small"
      >
        <div class="row g-2">
          <div class="col-6">
            <label class="form-label">Item to look for (regexp allowed):</label>
            <input
              class="form-control form-control-sm"
              type="text"
              name="item"
              value=${item}
              onChange=${(event) => setItem(event.target.value)}
              ref=${itemInput}
            />
          </div>
          <div class="col">
            <label class="form-label">Sets:</label>
            <select
              class="form-select form-select-sm"
              name="sets"
              value=${sets}
              onChange=${(event) => {
                const { value } = event.target;
                setSets(value);
                setItem(value);
              }}
            >
              <option value=""></option>
              <option value="@aire ings">aire ings</option>
              <option value="@all removals">all removals</option>
              <option value="@all rings">all rings</option>
              <option value="@animaltoken">animaltoken</option>
              <option value="@attrib removals">attrib removals</option>
              <option value="@aug set">aug set</option>
              <option value="@bd set">bd set</option>
              <option value="@bronze set">bronze set</option>
              <option value="@c1 rings">c1 rings</option>
              <option value="@c2 rings">c2 rings</option>
              <option value="@crafting">crafting</option>
              <option value="@deathe ings">deathe ings</option>
              <option value="@earthe ings">earthe ings</option>
              <option value="@energye ings">energye ings</option>
              <option value="@firee ings">firee ings</option>
              <option value="@flowers">flowers</option>
              <option value="@full bd set">full bd set</option>
              <option value="@full bronze set">full bronze set</option>
              <option value="@full id set">full id set</option>
              <option value="@full iron set">full iron set</option>
              <option value="@full rd set">full rd set</option>
              <option value="@full steel set">full steel set</option>
              <option value="@full tit set">full tit set</option>
              <option value="@healthe ings">healthe ings</option>
              <option value="@id set">id set</option>
              <option value="@iron set">iron set</option>
              <option value="@leather set">leather set</option>
              <option value="@lifee ings">lifee ings</option>
              <option value="@magice ings">magice ings</option>
              <option value="@mattere ings">mattere ings</option>
              <option value="@minerals">minerals</option>
              <option value="@nexus removals">nexus removals</option>
              <option value="@ore">ore</option>
              <option value="@perk removals">perk removals</option>
              <option value="@potions">potions</option>
              <option value="@rd set">rd set</option>
              <option value="@spirite ings">spirite ings</option>
              <option value="@steel set">steel set</option>
              <option value="@tit set">tit set</option>
              <option value="@watere ings">watere ings</option>
            </select>
          </div>
          <div class="col">
            <label class="form-label">What do you want:</label>
            <select
              class="form-select form-select-sm"
              name="action"
              value=${action}
              onChange=${(event) => setAction(event.target.value)}
            >
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>
        <div class="row g-2 mt-2">
          <div class="col">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="showzero"
                value="1"
                checked=${showEmpty}
                onChange=${(event) => setShowEmpty(event.target.checked)}
              />
              <label>Show empty slots</label>
            </div>
          </div>
          <div class="col">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="antisocial"
                value="1"
                checked=${hideNPCs}
                onChange=${(event) => setHideNPCs(event.target.checked)}
              />
              <label>Hide NPCs (antisocial)</label>
            </div>
          </div>
          <div class="col">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="showhosters"
                value="1"
                checked=${showHosters}
                onChange=${(event) => setShowHosters(event.target.checked)}
              />
              <label>Show hosters</label>
            </div>
          </div>
          <div class="col">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="showowners"
                value="1"
                checked=${showOwners}
                onChange=${(event) => setShowOwners(event.target.checked)}
              />
              <label>Show owners</label>
            </div>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-12">
            <input
              type="submit"
              value="Search"
              class="btn btn-primary btn-sm px-4"
            />
          </div>
        </div>
      </form>
    `;
  }

  return Form;
});

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

modulejs.define('summary-table', ['utils'], (utils) => {
  const { html } = htmPreact;
  const { getItemUrl, getItemWikiUrl, getItemImageUrl } = utils;

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
                    <${ItemCell} itemName=${itemName} />
                    <${PriceCell} price=${summary.minPrice} />
                    <${PriceCell} price=${summary.avgPrice} />
                    <${PriceCell} price=${summary.maxPrice} />
                  </tr>
                `
            )}
        </tbody>
      </table>
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

  function PriceCell({ price }) {
    return html`
      <td class="align-middle text-end">
        <code>${price.toFixed(2)}</code>
      </td>
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
});

modulejs.define('body', ['app'], (App) => {
  const { html, render } = htmPreact;

  function initialize() {
    // Extract data from the page.
    const props = {
      params: extractSearchParams(),
      results: extractSearchResults(),
    };

    // Nuke the <body> and render our own app in its place.
    document.body.innerHTML = '';
    render(html`<${App} ...${props} />`, document.body);
  }

  function extractSearchParams() {
    const url = new window.URL(window.location.href);
    return {
      item: url.searchParams.get('item'),
      sets: url.searchParams.get('sets'),
      action: url.searchParams.get('action') || 'Buy',
      showEmpty: !!url.searchParams.get('showzero'),
      hideNPCs: !!url.searchParams.get('antisocial'),
      showHosters: !!url.searchParams.get('showhosters'),
      showOwners: !!url.searchParams.get('showowners'),
    };
  }

  function extractSearchResults() {
    const table = document.body.querySelector('table');
    if (!table) {
      return { entries: [] };
    }

    const [headerRow, ...rows] = [...table.querySelectorAll('tr')];
    const hasSlotsAndEmu = headerRow.querySelectorAll('th').length > 8;
    const entries = rows
      .map((row) => {
        const cells = [...row.querySelectorAll('td')];
        return {
          hoster: cells.shift(),
          bot: cells.shift(),
          slots: hasSlotsAndEmu ? cells.shift() : null,
          emu: hasSlotsAndEmu ? cells.shift() : null,
          owner: cells.shift(),
          location: cells.shift(),
          action: cells.shift(),
          quantity: cells.shift(),
          price: cells.shift(),
          item: cells.shift(),
        };
      })
      .map((cells) => {
        const parsePrice = (text) => {
          const match = text.trim().match(/^(\d+\.\d+)+gc$/);
          return match ? Number(match[1]) : null;
        };

        const parseLocation = (location) => {
          const match = location.trim().match(/^(.+?) (\d+),(\d+)$/);
          return match
            ? {
                mapName: match[1],
                mapCoords: { x: Number(match[2]), y: Number(match[3]) },
              }
            : { mapName: null, mapCoords: null };
        };

        return {
          hoster: cells.hoster.textContent.trim(),
          botName: cells.bot.textContent.trim(),
          botUrl: cells.bot.querySelector('a')?.href,
          slots: cells.slots?.textContent.trim(),
          emu: cells.emu?.textContent.trim(),
          owner: cells.owner.textContent.trim(),
          action: cells.action.textContent.trim(),
          quantity: cells.quantity.textContent.trim(),
          price: parsePrice(cells.price.textContent.trim()),
          itemName: cells.item.textContent.trim(),
          ...parseLocation(cells.location.textContent.trim()),
        };
      });

    return { entries, hasSlotsAndEmu };
  }

  return { initialize };
});

modulejs.define('head', ['utils'], (utils) => {
  const { ITEM_THUMBNAIL_SIZE, MAP_THUMBNAIL_SIZE, MAP_PREVIEW_SIZE } = utils;

  function initialize() {
    // Add bootstrap stylesheet.
    const bootstrap = document.createElement('link');
    bootstrap.href =
      'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
    bootstrap.rel = 'stylesheet';
    bootstrap.crossorigin = 'anonymous';
    document.head.appendChild(bootstrap);

    // Add custom styles.
    const style = document.createElement('style');
    style.innerHTML = `
      .item-thumbnail {
        width: ${ITEM_THUMBNAIL_SIZE}px;
        height: ${ITEM_THUMBNAIL_SIZE}px;
        min-width: ${ITEM_THUMBNAIL_SIZE}px;
        min-height: ${ITEM_THUMBNAIL_SIZE}px;
      }

      .map-thumbnail {
        width: ${MAP_THUMBNAIL_SIZE}px;
        height: ${MAP_THUMBNAIL_SIZE}px;
        min-width: ${MAP_THUMBNAIL_SIZE}px;
        min-height: ${MAP_THUMBNAIL_SIZE}px;
      }

      .map-preview {
        width: ${MAP_PREVIEW_SIZE}px;
        height: ${MAP_PREVIEW_SIZE}px;
        min-width: ${MAP_PREVIEW_SIZE}px;
        min-height: ${MAP_PREVIEW_SIZE}px;
      }

      .item-thumbnail:hover,
      .map-thumbnail:hover,
      .map-preview:hover {
        filter: brightness(1.25);
      }

      .map-preview-link-disabled {
        pointer-events: none;
      }

      .map-marker {
        position: absolute;
        width: 1px;
        height: 1px;
        border-radius: 100%;
        background: rgb(255, 255, 0);
        box-shadow: 0px 0px 1px 1px rgba(255, 255, 0, 0.2);
        animation: pulse 0.5s infinite alternate;
      }

      @keyframes pulse {
        100% {
          transform: scale(15);
        }
      }

      .countdown {
        position: absolute;
        top: 0;
        right: 0;
      }
  `;
    document.head.appendChild(style);
  }

  return { initialize };
});

modulejs.define('utils', () => {
  const ITEM_THUMBNAIL_SIZE = 36;
  const MAP_THUMBNAIL_SIZE = 36;
  const MAP_PREVIEW_SIZE = 250;

  function getItemUrl(itemName) {
    const url = new window.URL(window.location.href);
    url.searchParams.set('item', `^${itemName}$`);
    return url.toString();
  }

  function getItemWikiUrl(itemName) {
    return `https://el-wiki.holy-eternalland.de/index.php?search=${encodeURIComponent(
      itemName
    )}`;
  }

  function getItemImageUrl(itemName) {
    const imageId = itemImageIds[itemName];
    return `https://github.com/lukehorvat/el-userscripts/raw/item-images/dist/item-image-${
      imageId ?? 'placeholder'
    }.jpg`;
  }

  function getMapImageUrl(mapFile) {
    return `https://github.com/lukehorvat/el-userscripts/raw/map-images/dist/map-image-${
      mapFile ?? 'placeholder'
    }.jpg`;
  }

  function getMapImageCoords(mapFile, mapCoords) {
    const mapSize = mapSizes[mapFile];
    const left = (mapCoords.x / mapSize.width) * MAP_PREVIEW_SIZE;
    const bottom = (mapCoords.y / mapSize.height) * MAP_PREVIEW_SIZE;
    return { left, bottom };
  }

  function getMapFileFromName(mapName) {
    switch (mapName) {
      case 'IP':
      case 'IP(C1)':
      case 'Isla Prima':
        return 'startmap';
      case 'WS':
      case 'WS(C1)':
      case 'White Stone':
        return 'map2';
      case 'DP':
      case 'DP(C1)':
      case 'Desert Pines':
        return 'map3';
      case 'RoT':
      case 'RoT(C1)':
      case 'Ruins of Tirnym':
        return 'map4f';
      case 'VotD':
      case 'VotD(C1)':
      case 'Valley of the Dwarves':
        return 'map5nf';
      case 'PL':
      case 'PL(C1)':
      case 'Portland':
        return 'map6nf';
      case 'MM':
      case 'MM(C1)':
      case 'Morcraven Marsh':
        return 'map7';
      case 'Nara':
      case 'Nara(C1)':
      case 'Naralik':
        return 'map8';
      case 'GP':
      case 'GP(C1)':
      case 'Grubani Peninsula':
        return 'map9f';
      case 'TG':
      case 'TG(C1)':
      case 'Tarsengaard':
        return 'map11';
      case 'NC':
      case 'NC(C1)':
      case 'Nordcarn':
        return 'map12';
      case 'SKF':
      case 'SKF(C1)':
      case 'Southern Kilaran':
        return 'map13';
      case 'KF':
      case 'KF(C1)':
      case 'Kilaran Field':
        return 'map14f';
      case 'TD':
      case 'TD(C1)':
      case 'Tahraji Desert':
        return 'map15f';
      case 'CC':
      case 'CC(C1)':
      case 'Crystal Caverns':
        return 'cave1';
      case 'PA':
      case 'PA(C2)':
      case 'Port Anitora':
        return 'anitora';
      case 'Ida':
      case 'Ida(C2)':
      case 'Idaloran - City':
      case 'Idaloran':
        return 'cont2map1';
      case 'Bethel(C2)':
      case 'Bethel':
        return 'cont2map2';
      case 'Sedi':
      case 'Sedi(C2)':
      case 'Sedicolis':
        return 'cont2map3';
      case 'Melinis(C2)':
      case 'Melinis':
        return 'cont2map4';
      case 'PV':
      case 'PV(C2)':
      case 'Palon Vertas':
        return 'cont2map5';
      case 'Thelinor(C2)':
      case 'Thelinor':
        return 'cont2map6';
      case 'Irsis(C2)':
      case 'Irsis':
        return 'cont2map7';
      case 'EVTR':
      case 'EVTR(C2)':
      case 'Emerald Valley Trade Route':
        return 'cont2map8';
      case 'KJ':
      case 'KJ(C2)':
      case 'Kusamura Jungle':
        return 'cont2map9';
      case 'Zirak':
      case 'Zirak(C2)':
      case 'Zirakinbar':
        return 'cont2map10';
      case 'WF':
      case 'WVF':
      case 'WF(C2)':
      case 'WVF(C2)':
      case 'Willowvine Forest':
        return 'cont2map11';
      case 'AA':
      case 'AA(C2)':
      case 'Aeth Aelfan':
        return 'cont2map12';
      case 'EP':
      case 'EP(C2)':
      case 'Egratia Point':
        return 'cont2map13';
      case 'Arius(C2)':
      case 'Arius':
        return 'cont2map14';
      case 'NRM':
      case 'NRM(C2)':
      case 'North Redmoon':
        return 'cont2map15';
      case 'SRM':
      case 'SRM(C2)':
      case 'South Redmoon':
        return 'cont2map16';
      case 'SRM Mine':
      case 'SRM Mine(C2)':
      case 'South Redmoon - Mine':
        return 'cont2map16_insides';
      case 'Hurquin(C2)':
      case 'Hurquin':
        return 'cont2map17';
      case 'Trassian(C2)':
      case 'Trassian':
        return 'cont2map18';
      case 'Hulda':
        return 'cont2map19';
      case 'IotF':
      case 'IotF(C2)':
      case 'Isle of the Forgotten':
        return 'cont2map20';
      case 'II':
      case 'II(C2)':
      case 'Imbroglio Islands':
        return 'cont2map21';
      case 'Irin':
      case 'Irin(C2)':
      case 'Irinveron':
        return 'cont2map22';
      case 'Glac':
      case 'Glac(C2)':
      case 'Glacmor':
        return 'cont2map23';
      case 'Isca':
      case 'Isca(C2)':
      case 'Iscalrith':
        return 'cont2map24';
      default:
        return null;
    }
  }

  return {
    ITEM_THUMBNAIL_SIZE,
    MAP_THUMBNAIL_SIZE,
    MAP_PREVIEW_SIZE,
    getItemUrl,
    getItemWikiUrl,
    getItemImageUrl,
    getMapImageUrl,
    getMapImageCoords,
    getMapFileFromName,
  };
});

modulejs.define('main', ['head', 'body'], (head, body) => {
  head.initialize();
  body.initialize();
});

modulejs.require('main');
