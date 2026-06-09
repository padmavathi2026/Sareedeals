import { useState, useEffect } from 'react';
import { getDeals } from '../utils/sheetsApi';

export function useDeals() {
  const [deals, setDeals]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDeals(getDeals());
    setLoading(false);
  }, []);

  const toggleStatus = (id, newStatus) =>
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)));

  const updatePrice = (id, offerPrice) =>
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, offer_price: offerPrice } : d)));

  return { deals, loading, error: null, usingFallback: false, reload: () => {}, toggleStatus, updatePrice };
}
