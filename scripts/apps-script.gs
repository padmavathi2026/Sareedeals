/**
 * Padmavathi Sarees – Google Apps Script backend
 * ─────────────────────────────────────────────────
 * HOW TO DEPLOY
 * 1. Open your Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Delete any existing code and paste this entire file.
 * 4. Click Save, then Deploy > New deployment.
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Authorise when prompted.
 * 6. Copy the deployment URL.
 * 7. Set VITE_APPS_SCRIPT_URL=<that URL> in your Netlify env vars (or .env file).
 *
 * SHEET STRUCTURE (tab name must match VITE_SHEET_NAME, default: "Deals")
 * Row 1 is the header row with these exact lowercase column names:
 *   id | name | description | image_url | original_price | offer_price | status | whatsapp_message | deal_date
 */

const SHEET_NAME = 'Deals'; // Change if your tab name is different

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function getHeaders(sheet) {
  return sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((h) => String(h).toLowerCase().trim().replace(/\s+/g, '_'));
}

// ── Handles POST requests from the admin panel ──────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet   = getSheet();
    const headers = getHeaders(sheet);
    const data    = sheet.getDataRange().getValues();

    const idCol     = headers.indexOf('id');
    const statusCol = headers.indexOf('status');
    const priceCol  = headers.indexOf('offer_price');

    if (idCol === -1) {
      return respond({ success: false, error: "'id' column not found" });
    }

    // Find the row matching payload.id (skip header row at index 0)
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][idCol]) === String(payload.id)) {
        rowIndex = i + 1; // Sheets rows are 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      return respond({ success: false, error: `id ${payload.id} not found` });
    }

    if (payload.action === 'updateStatus' && statusCol !== -1) {
      sheet.getRange(rowIndex, statusCol + 1).setValue(payload.status);
      return respond({ success: true, updated: 'status', id: payload.id });
    }

    if (payload.action === 'updatePrice' && priceCol !== -1) {
      sheet.getRange(rowIndex, priceCol + 1).setValue(Number(payload.offerPrice));
      return respond({ success: true, updated: 'offer_price', id: payload.id });
    }

    return respond({ success: false, error: 'Unknown action or missing column' });

  } catch (err) {
    return respond({ success: false, error: err.message });
  }
}

// ── Also support GET for quick health check ─────────────────────
function doGet() {
  return respond({ status: 'ok', sheet: SHEET_NAME });
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
