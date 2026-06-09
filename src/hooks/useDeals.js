import { useState, useEffect, useCallback } from 'react';
import { fetchDealsFromSheet } from '../utils/sheetsApi';
import { SAMPLE_DEALS } from '../data/sampleDeals';
import { CONFIG } from '../config';

function todayDDMMYYYY() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function useDeals({ filterToday = true } = {}) {
  const [deals, setDeals]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (!CONFIG.SHEET_ID) {
        data = SAMPLE_DEALS;
      } else {
        data = await fetchDealsFromSheet();
      }

      if (filterToday) {
        const today = todayDDMMYYYY();
        data = data.filter((d) => !d.deal_date || d.deal_date === today);
      }

      data = data.map((d) => ({
        ...d,
        id:             Number(d.id),
        original_price: Number(d.original_price),
        offer_price:    Number(d.offer_price),
      }));

      setDeals(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setDeals(SAMPLE_DEALS);
    } finally {
      setLoading(false);
    }
  }, [filterToday]);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = (id, newStatus) =>
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)));

  const updatePrice = (id, offerPrice) =>
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, offer_price: offerPrice } : d)));

  return { deals, loading, error, reload: load, toggleStatus, updatePrice };
}
