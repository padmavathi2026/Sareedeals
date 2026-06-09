import { useState, useRef } from 'react';
import { RefreshCw, LogOut, ExternalLink, Check, X, Edit2, Save } from 'lucide-react';
import { CONFIG } from '../config';
import { useDeals } from '../hooks/useDeals';
import { updateStatusViaScript, updatePriceViaScript } from '../utils/sheetsApi';

/* ─── Auth Gate ──────────────────────────────────────────────── */
function LoginGate({ onLogin }) {
  const [pw, setPw]   = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (pw === CONFIG.ADMIN_PASSWORD) {
      sessionStorage.setItem('sd_admin', '1');
      onLogin();
    } else {
      setErr('Incorrect password. Try again.');
    }
  };

  return (
    <div className="min-h-screen hero-pattern flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl text-maroon-700 mb-1">Admin Panel</h1>
        <p className="text-gray-500 text-sm mb-6">Padmavathi Sarees – Deals Manager</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(''); }}
              placeholder="Enter admin password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-maroon-500 text-sm"
              autoFocus
            />
          </div>
          {err && <p className="text-red-500 text-xs">{err}</p>}
          <button type="submit" className="w-full btn-primary text-sm py-2.5 rounded-lg">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Price Edit Inline ──────────────────────────────────────── */
function PriceCell({ deal, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(deal.offer_price);
  const [saving, setSaving]   = useState(false);

  const save = async () => {
    setSaving(true);
    await updatePriceViaScript(deal.id, Number(val));
    onSave(deal.id, Number(val));
    setSaving(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-gray-500 text-xs">₹</span>
        <input
          type="number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-24 border border-maroon-400 rounded px-1.5 py-1
                     text-sm focus:outline-none focus:ring-1 focus:ring-maroon-500"
          autoFocus
        />
        <button onClick={save} disabled={saving}
          className="p-1 text-green-600 hover:bg-green-50 rounded">
          <Save className="w-4 h-4" />
        </button>
        <button onClick={() => setEditing(false)}
          className="p-1 text-red-500 hover:bg-red-50 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group">
      <span className="font-semibold">₹{Number(deal.offer_price).toLocaleString('en-IN')}</span>
      <button
        onClick={() => { setVal(deal.offer_price); setEditing(true); }}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400
                   hover:text-maroon-600 rounded transition-opacity"
      >
        <Edit2 className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ─── Main Admin Dashboard ───────────────────────────────────── */
export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('sd_admin') === '1'
  );
  const [toggling, setToggling] = useState(null);
  const [toast, setToast]       = useState('');
  const toastTimer              = useRef(null);

  const { deals, loading, error, reload, toggleStatus, updatePrice } =
    useDeals({ filterToday: false });

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  };

  const handleToggle = async (deal) => {
    const newStatus = deal.status === 'active' ? 'sold' : 'active';
    setToggling(deal.id);
    const ok = await updateStatusViaScript(deal.id, newStatus);
    toggleStatus(deal.id, newStatus); // optimistic update
    setToggling(null);
    showToast(
      ok
        ? `"${deal.name}" marked as ${newStatus}.`
        : `Updated locally. (Apps Script URL not set – update sheet manually.)`
    );
  };

  const logout = () => {
    sessionStorage.removeItem('sd_admin');
    setAuthed(false);
  };

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />;

  const sheetUrl = CONFIG.SHEET_ID
    ? `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}`
    : null;

  return (
    <div className="min-h-screen bg-cream-100">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                        bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg
                        transition-all">
          {toast}
        </div>
      )}

      {/* Top bar */}
      <header className="hero-pattern px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-white text-lg">Admin Dashboard</h1>
          <p className="text-gold-400 text-xs">{CONFIG.SITE_NAME}</p>
        </div>
        <div className="flex items-center gap-2">
          {sheetUrl && (
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gold-300 hover:text-white
                         text-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Sheet
            </a>
          )}
          <button
            onClick={reload}
            className="flex items-center gap-1 text-gold-300 hover:text-white
                       text-xs transition-colors ml-3"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1 bg-maroon-800 hover:bg-maroon-900
                       text-white text-xs px-3 py-1.5 rounded-full ml-3 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Stats strip */}
      <div className="bg-white border-b px-4 py-3 flex gap-6 overflow-x-auto text-sm">
        <Stat label="Total"     value={deals.length}                              color="text-gray-900" />
        <Stat label="Active"    value={deals.filter(d => d.status === 'active').length} color="text-green-600" />
        <Stat label="Sold Out"  value={deals.filter(d => d.status === 'sold').length}   color="text-red-500"   />
      </div>

      {/* Table */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <p className="text-center text-gray-500 py-12">Loading deals…</p>
        )}
        {error && !deals.length && (
          <p className="text-center text-red-500 py-12 text-sm">{error}</p>
        )}

        {!loading && deals.length > 0 && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-maroon-600 text-white text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 text-left w-12">#</th>
                  <th className="px-4 py-3 text-left min-w-[160px]">Name</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Image</th>
                  <th className="px-4 py-3 text-right">MRP</th>
                  <th className="px-4 py-3 text-right">Offer Price</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deals.map((deal, idx) => (
                  <tr
                    key={deal.id}
                    className={`hover:bg-cream-100 transition-colors
                                ${deal.status === 'sold' ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-3 text-gray-400">{idx + 1}</td>

                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                      {deal.name}
                    </td>

                    {/* Thumbnail */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <img
                        src={deal.image_url}
                        alt={deal.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                    </td>

                    <td className="px-4 py-3 text-right text-gray-500">
                      ₹{Number(deal.original_price).toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <PriceCell deal={deal} onSave={updatePrice} />
                    </td>

                    <td className="px-4 py-3 text-center text-gray-400 text-xs hidden sm:table-cell">
                      {deal.deal_date || '—'}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold
                                        px-2.5 py-1 rounded-full
                                        ${deal.status === 'active'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-red-100 text-red-600'}`}>
                        {deal.status === 'active'
                          ? <><Check className="w-3 h-3" /> Active</>
                          : <><X className="w-3 h-3" /> Sold</>}
                      </span>
                    </td>

                    {/* Toggle button */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(deal)}
                        disabled={toggling === deal.id}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg
                                    transition-colors
                                    ${deal.status === 'active'
                                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'}
                                    disabled:opacity-50`}
                      >
                        {toggling === deal.id
                          ? '…'
                          : deal.status === 'active'
                            ? 'Mark Sold'
                            : 'Mark Active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Help note */}
        {!CONFIG.APPS_SCRIPT_URL && (
          <p className="mt-6 text-xs text-gray-400 text-center max-w-xl mx-auto">
            <strong>Note:</strong> VITE_APPS_SCRIPT_URL is not set. Status changes are
            reflected locally but will NOT persist to Google Sheets until you deploy the
            Apps Script and set the URL. See{' '}
            <code className="bg-gray-100 px-1 rounded">scripts/apps-script.gs</code>.
          </p>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className={`font-bold text-lg ${color}`}>{value}</span>
      <span className="text-gray-500">{label}</span>
    </div>
  );
}
