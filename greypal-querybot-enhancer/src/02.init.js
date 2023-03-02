const { html, render, useState, useRef, useEffect } = htmPreact;

initHead();
initBody();

function initHead() {
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
    .item-image {
      width: 36px;
    }

    .item-image:hover {
      filter: brightness(1.25);
    }

    .countdown {
      position: absolute;
      top: 0;
      right: 0;
    }
  `;
  document.head.appendChild(style);
}

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
      const parsePrice = (text) =>
        Number(text.trim().match(/^(\d+\.\d+)+gc$/)[1]);

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
