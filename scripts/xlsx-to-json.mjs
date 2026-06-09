/**
 * Converts src/data/deals_data.xlsx → src/data/deals.json
 * Run automatically via predev / prebuild npm scripts.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { read, utils } from 'xlsx';

const __dir   = dirname(fileURLToPath(import.meta.url));
const xlsxPath = resolve(__dir, '../deals_data.xlsx');
const jsonPath  = resolve(__dir, '../src/data/deals.json');

const buf  = readFileSync(xlsxPath);
const wb   = read(buf, { type: 'buffer' });
const ws   = wb.Sheets[wb.SheetNames[0]];
const rows = utils.sheet_to_json(ws, { defval: '' });

writeFileSync(jsonPath, JSON.stringify(rows, null, 2));
console.log(`[xlsx-to-json] Wrote ${rows.length} rows → src/data/deals.json`);
