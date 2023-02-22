// ==UserScript==
// @name        EL Greypal Querybot enhancer
// @version     2.0.0
// @author      Luke Horvat
// @description Enhances Greypal's Querybot page.
// @match       http://greypal.el-fd.org/cgi-bin/querybot*
// @require     https://unpkg.com/htm@3.1.1/preact/standalone.umd.js
// ==/UserScript==

const { html, render, useState, useRef, useEffect } = htmPreact;

initBody();
addBootstrap();

function initBody() {
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
      return {
        hoster: cells.hoster.textContent.trim(),
        botName: cells.bot.textContent.trim(),
        botUrl: cells.bot.querySelector('a')?.href,
        slots: cells.slots?.textContent.trim(),
        emu: cells.emu?.textContent.trim(),
        owner: cells.owner.textContent.trim(),
        location: cells.location.textContent.trim(),
        action: cells.action.textContent.trim(),
        quantity: cells.quantity.textContent.trim(),
        price: parsePrice(cells.price.textContent.trim()),
        itemName: cells.item.textContent.trim(),
      };
    });

  return { entries, hasSlotsAndEmu };
}

function addBootstrap() {
  const bootstrap = document.createElement('link');
  bootstrap.href =
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
  bootstrap.rel = 'stylesheet';
  bootstrap.crossorigin = 'anonymous';
  document.head.appendChild(bootstrap);
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

function parsePrice(str) {
  return Number(str.trim().match(/^(\d+\.\d+)+gc$/)[1]);
}

function getItemUrl(itemName) {
  const url = new window.URL(window.location.href);
  url.searchParams.set('item', `^${itemName}$`);
  return url.toString();
}

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
              html`<td class="text-muted">${entry.hoster}</td>`}
              ${showOwners && html`<td class="text-muted">${entry.owner}</td>`}
              <td>
                ${entry.botUrl
                  ? html`
                      <a href=${entry.botUrl} target="_blank">
                        ${entry.botName}
                      </a>
                    `
                  : entry.botName}
              </td>
              ${hasSlotsAndEmu &&
              html`<td align="right"><code>${entry.slots}</code></td>`}
              ${hasSlotsAndEmu &&
              html`<td align="right"><code>${entry.emu}</code></td>`}
              <td class="font-monospace small">${entry.location}</td>
              ${action === 'Both' &&
              html`<td class="fst-italic">${entry.action}</td>`}
              <td align="right"><code>${entry.quantity}</code></td>
              <td align="right"><code>${entry.price.toFixed(2)}</code></td>
              <td>
                <a href=${getItemUrl(entry.itemName)}>${entry.itemName}</a>
              </td>
            </tr>
          `
        )}
      </tbody>
    </table>
  `;
}

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
                  <td><a href=${getItemUrl(itemName)}>${itemName}</a></td>
                  <td align="right">
                    <code>${summary.minPrice.toFixed(2)}</code>
                  </td>
                  <td align="right">
                    <code>${summary.avgPrice.toFixed(2)}</code>
                  </td>
                  <td align="right">
                    <code>${summary.maxPrice.toFixed(2)}</code>
                  </td>
                </tr>
              `
          )}
      </tbody>
    </table>
  `;
}

function Countdown() {
  return html`
    <div
      class="text-muted small p-2"
      style="position: absolute; top: 0; right: 0;"
    >
      Next update in <span id="second">60</span> seconds
    </div>
  `;
}

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
