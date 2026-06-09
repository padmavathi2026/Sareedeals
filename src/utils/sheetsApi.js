import rawRows from '../data/deals.json';

export function getDeals() {
  return rawRows
    .filter((r) => r['ID'] !== '' && r['ID'] !== undefined && r['ID'] !== null)
    .map(normalise);
}

function normalise(row) {
  return {
    id:             Number(row['ID']             ?? 0),
    fabric:         String(row['Fabric']          ?? '').trim(),
    name:           String(row['Name']            ?? '').trim(),
    original_price: Number(row['Original Price']  ?? 0),
    offer_price:    Number(row['Offer Price']     ?? 0),
    status:         statusNorm(row['Status']      ?? ''),
    deal_date:      String(row['Date']            ?? '').trim(),
    image_url:      String(row['Photo_Url']       ?? '').trim(),
    photo_url1:     String(row['Photo_Url1']      ?? '').trim(),
    description:    String(row['Description']     ?? '').trim(),
    whatsapp_message: '',
  };
}

function statusNorm(raw) {
  const s = String(raw).toLowerCase().trim();
  return (s === 'sold out' || s === 'sold') ? 'sold' : 'active';
}

export async function updateStatusViaScript(id, status) {
  const url = import.meta.env.VITE_APPS_SCRIPT_URL;
  if (!url || url.includes('YOUR_DEPLOYMENT')) return false;
  await fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action: 'updateStatus', id, status }) });
  return true;
}

export async function updatePriceViaScript(id, offerPrice) {
  const url = import.meta.env.VITE_APPS_SCRIPT_URL;
  if (!url || url.includes('YOUR_DEPLOYMENT')) return false;
  await fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action: 'updatePrice', id, offerPrice }) });
  return true;
}
