// ==UserScript==
// @name        EL Greypal Querybot enhancer
// @version     1.0.1
// @author      Luke Horvat
// @description Enhances Greypal's Querybot page.
// @match       http://greypal.el-fd.org/cgi-bin/querybot*
// ==/UserScript==

addBootstrap();
moveStuffAround();
styleForm();
styleResultsTable();
styleSummaryTable();

function addBootstrap() {
  const bootstrap = document.createElement('link');
  bootstrap.href =
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
  bootstrap.rel = 'stylesheet';
  bootstrap.crossorigin = 'anonymous';
  document.head.appendChild(bootstrap);

  document.body.className = 'container-fluid p-4';
}

function moveStuffAround() {
  const bodyChildren = [...document.body.childNodes];
  const countdownElements = bodyChildren.slice(0, 5);
  const miscElements = bodyChildren
    .slice(8, 10)
    .concat(bodyChildren.slice(5, 7));

  const countdownContainer = document.createElement('div');
  countdownContainer.className = 'text-muted small p-2';
  countdownContainer.style = 'position: absolute; top: 0; right: 0;';
  for (const countdownElement of countdownElements) {
    countdownContainer.appendChild(countdownElement);
  }
  document.body.appendChild(countdownContainer);

  const footer = document.createElement('footer');
  footer.className = 'card text-muted text-center small mt-4 p-2';
  for (const misc of miscElements) {
    footer.appendChild(misc);
  }
  document.body.appendChild(footer);
}

function styleForm() {
  const form = document.body.querySelector('form');
  form.className = 'small';
  const actionSelect = form.querySelector('select[name=action]');
  actionSelect.className = 'form-select form-select-sm d-inline w-auto';
  actionSelect.style = 'margin-left: 4px';
  const emptySlotsCheckbox = form.querySelector('input[name=showzero]');
  emptySlotsCheckbox.className = 'form-check-input';
  emptySlotsCheckbox.style = 'margin-right: 4px';
  const antisocialCheckbox = form.querySelector('input[name=antisocial]');
  antisocialCheckbox.className = 'form-check-input';
  antisocialCheckbox.style = 'margin-right: 4px';
  const itemInput = form.querySelector('input[name=item]');
  itemInput.className = 'form-control form-control-sm d-inline w-25';
  itemInput.style = 'margin-left: 4px';
  itemInput.focus(); // autofocus it
  const setsSelect = form.querySelector('select[name=sets]');
  setsSelect.className = 'form-select form-select-sm d-inline w-auto';
  setsSelect.style = 'margin-left: 4px';
  const submitButton = form.querySelector('input[type=submit]');
  submitButton.className = 'btn btn-primary btn-sm mt-2';
}

function styleResultsTable() {
  const table = document.body.querySelectorAll('table')[0];

  if (!table) {
    // When there are no results for a given query, do nothing.
    return;
  }

  table.className = 'table table-bordered table-hover mt-2';

  // Insert a  <thead> for Bootstrap.
  const tableBody = table.querySelector('tbody');
  const tableHead = document.createElement('thead');
  table.insertBefore(tableHead, tableBody);

  const rows = tableBody.querySelectorAll('tr');
  for (const row of rows) {
    const isHeaderRow = row.rowIndex === 0;
    const cells = row.querySelectorAll('td, th');
    const hasSlotsAndEmuCells = cells.length > 8;
    const hostCell = cells[0];
    const botCell = cells[1];
    const slotsCell = hasSlotsAndEmuCells ? cells[2] : null;
    const emuCell = hasSlotsAndEmuCells ? cells[3] : null;
    const ownerCell = cells[hasSlotsAndEmuCells ? 4 : 2];
    const locationCell = cells[hasSlotsAndEmuCells ? 5 : 3];
    const actionCell = cells[hasSlotsAndEmuCells ? 6 : 4];
    const quantityCell = cells[hasSlotsAndEmuCells ? 7 : 5];
    const priceCell = cells[hasSlotsAndEmuCells ? 8 : 6];
    const itemCell = cells[hasSlotsAndEmuCells ? 9 : 7];

    // Swap the order.
    row.insertBefore(ownerCell, botCell);

    // Move header row to <thead>.
    if (isHeaderRow) {
      tableHead.appendChild(row);
      continue;
    }

    hostCell.className = 'text-muted';
    ownerCell.className = 'text-muted';

    if (slotsCell) {
      const slotsContainer = document.createElement('code');
      slotsContainer.textContent = slotsCell.textContent.trim();
      slotsCell.textContent = '';
      slotsCell.appendChild(slotsContainer);
    }

    if (emuCell) {
      const emuContainer = document.createElement('code');
      emuContainer.textContent = emuCell.textContent.trim();
      emuCell.textContent = '';
      emuCell.appendChild(emuContainer);
    }

    locationCell.className = 'font-monospace small';
    actionCell.className = 'fst-italic';

    const quantityContainer = document.createElement('code');
    quantityContainer.textContent = quantityCell.textContent.trim();
    quantityCell.textContent = '';
    quantityCell.appendChild(quantityContainer);

    const priceContainer = document.createElement('code');
    priceContainer.textContent = parsePrice(priceCell.textContent);
    priceCell.textContent = '';
    priceCell.appendChild(priceContainer);
  }
}

function styleSummaryTable() {
  const table = document.body.querySelectorAll('table')[1];

  if (!table) {
    // When there are no results for a given query, do nothing.
    return;
  }

  table.className = 'table table-bordered table-hover mt-2';

  const rows = table.querySelectorAll('tr');
  for (const row of rows) {
    const isHeaderRow = row.querySelectorAll('th').length > 0;

    if (isHeaderRow) {
      continue;
    }

    const cells = row.querySelectorAll('td');
    const minPriceCell = cells[1];
    const averagePriceCell = cells[2];
    const maxPriceCell = cells[3];

    const minPriceContainer = document.createElement('code');
    minPriceContainer.textContent = parsePrice(minPriceCell.textContent);
    minPriceCell.textContent = '';
    minPriceCell.appendChild(minPriceContainer);

    const averagePriceContainer = document.createElement('code');
    averagePriceContainer.textContent = parsePrice(
      averagePriceCell.textContent
    );
    averagePriceCell.textContent = '';
    averagePriceCell.appendChild(averagePriceContainer);

    const maxPriceContainer = document.createElement('code');
    maxPriceContainer.textContent = parsePrice(maxPriceCell.textContent);
    maxPriceCell.textContent = '';
    maxPriceCell.appendChild(maxPriceContainer);
  }
}

function parsePrice(str) {
  return str.trim().match(/^(\d+\.\d+)+gc$/)[1];
}
