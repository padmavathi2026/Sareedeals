/**
 * Padmavathi Cloth Stores – Google Apps Script backend
 * ─────────────────────────────────────────────────────
 * DEPLOY STEPS (one-time setup, ~3 minutes)
 * 1. Open your Google Sheet.
 * 2. Click Extensions → Apps Script.
 * 3. Delete existing code and paste this entire file.
 * 4. Click Save (Ctrl+S).
 * 5. Click Deploy → New deployment.
 *    - Type:           Web app
 *    - Execute as:     Me
 *    - Who has access: Anyone
 * 6. Click Deploy → Authorise → Allow.
 * 7. Copy the Web app URL (looks like https://script.google.com/macros/s/ABC.../exec).
 * 8. Paste that URL into your .env file as VITE_APPS_SCRIPT_URL=<url>
 *    (or set it as an environment variable on Netlify).
 * 9. Restart npm run dev — the site will now read live data from your sheet.
 *
 * SHEET TAB NAME must match SHEET_NAME below (default: Sheet1).
 */

const SHEET_NAME = 'Sheet1';

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function getHeaders(sheet) {
  return sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((h) => String(h).toLowerCase().trim().replace(/\s+/g, '_'));
}

// ── GET: returns all rows as JSON (used by the website to load deals) ──
function doGet(e) {
  try {
    const sheet   = getSheet();
    const headers = getHeaders(sheet);
    const values  = sheet.getDataRange().getValues();

    const rows = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      // Skip completely empty rows
      if (row.every((cell) => cell === '' || cell === null)) continue;
      const obj = {};
      headers.forEach((key, j) => {
        obj[key] = row[j] !== undefined ? row[j] : '';
      });
      rows.push(obj);
    }

    return respond({ success: true, data: rows });
  } catch (err) {
    return respond({ success: false, error: err.message, data: [] });
  }
}

// ── POST: handles admin status/price updates ────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet   = getSheet();
    const headers = getHeaders(sheet);
    const values  = sheet.getDataRange().getValues();

    const idCol     = headers.indexOf('id');
    const statusCol = headers.indexOf('status');
    const priceCol  = headers.indexOf('offer_price');

    if (idCol === -1) return respond({ success: false, error: "'id' column not found" });

    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][idCol]) === String(payload.id)) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) return respond({ success: false, error: `id ${payload.id} not found` });

    if (payload.action === 'updateStatus' && statusCol !== -1) {
      sheet.getRange(rowIndex, statusCol + 1).setValue(payload.status);
      return respond({ success: true, updated: 'status' });
    }

    if (payload.action === 'updatePrice' && priceCol !== -1) {
      sheet.getRange(rowIndex, priceCol + 1).setValue(Number(payload.offerPrice));
      return respond({ success: true, updated: 'offer_price' });
    }

    return respond({ success: false, error: 'Unknown action or missing column' });
  } catch (err) {
    return respond({ success: false, error: err.message });
  }
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
