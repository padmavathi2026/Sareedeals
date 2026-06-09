import { CONFIG } from '../config';

/**
 * Normalise a raw sheet row (using your actual column names) into the
 * internal shape the components expect.
 *
 * Sheet columns:  ID | Fabric | Name | Original Price | Offer Price | Status | Date | Photo_Url
 * Internal shape: id | fabric | name | original_price | offer_price | status | deal_date | image_url
 *
 * Status values from sheet: "Available" | "Sold Out"
 */
function normalise(row) {
  return {
    id:             row.id            ?? row.ID,
    fabric:         row.fabric        ?? row.Fabric        ?? '',
    name:           row.name          ?? row.Name          ?? '',
    original_price: row.original_price ?? row['original price'] ?? row['Original Price'] ?? 0,
    offer_price:    row.offer_price    ?? row['offer price']    ?? row['Offer Price']    ?? 0,
    // sheet uses "Available" / "Sold Out" — normalise to "active" / "sold"
    status:         statusNorm(row.status ?? row.Status ?? ''),
    deal_date:      row.deal_date ?? row.date ?? row.Date ?? '',
    image_url:      row.image_url ?? row.photo_url ?? row.Photo_Url ?? row['photo_url'] ?? '',
    whatsapp_message: row.whatsapp_message ?? '',
  };
}

function statusNorm(raw) {
  const s = String(raw).toLowerCase().trim();
  if (s === 'sold out' || s === 'sold') return 'sold';
  return 'active'; // "Available", "active", empty, or anything else → active
}

/**
 * Fetch deals from a published public Google Sheet via the gviz/tq endpoint.
 * Sheet must be: File → Share → Publish to web → your tab → CSV → Publish
 */
export async function fetchDealsFromSheet() {
  if (!CONFIG.SHEET_ID) {
    throw new Error('VITE_SHEET_ID not set.');
  }

  const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(CONFIG.SHEET_NAME)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);

  const raw = await res.text();

  // Strip JSONP wrapper: google.visualization.Query.setResponse({...});
  const jsonStr = raw.replace(/^[^(]+\(/, '').replace(/\);?\s*$/, '');
  const data = JSON.parse(jsonStr);

  const headers = data.table.cols.map((c) =>
    c.label.toLowerCase().trim().replace(/\s+/g, '_')
  );

  const rows = data.table.rows
    .filter((r) => r !== null)
    .map((r) => {
      const obj = {};
      headers.forEach((key, i) => {
        const cell = r.c[i];
        obj[key] = cell != null ? cell.v : '';
      });
      return obj;
    })
    .filter((d) => d.id != null && d.id !== '');

  return rows.map(normalise);
}

/** Push a status update to Google Apps Script. */
export async function updateStatusViaScript(id, status) {
  if (!CONFIG.APPS_SCRIPT_URL) return false;
  await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'updateStatus', id, status }),
  });
  return true;
}

/** Push a price update to Google Apps Script. */
export async function updatePriceViaScript(id, offerPrice) {
  if (!CONFIG.APPS_SCRIPT_URL) return false;
  await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'updatePrice', id, offerPrice }),
  });
  return true;
}
