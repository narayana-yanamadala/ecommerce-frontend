import { useState, useEffect, useCallback } from "react";

const API = "http://127.0.0.1:8000/api/checkout";

export const useAddress = (token) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/addresses/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setAddresses(Array.isArray(data) ? data : []);
    } catch { setAddresses([]); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  const addAddress = async (formData) => {
    const res = await fetch(`${API}/addresses/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    await fetchAddresses();
    return data;
  };

  const updateAddress = async (id, formData) => {
    const res = await fetch(`${API}/addresses/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    await fetchAddresses();
    return data;
  };

  const deleteAddress = async (id) => {
    await fetch(`${API}/addresses/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    await fetchAddresses();
  };

  const setDefault = async (id) => {
    await fetch(`${API}/addresses/${id}/default/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
    });
    await fetchAddresses();
  };

  return { addresses, loading, addAddress, updateAddress, deleteAddress, setDefault, refetch: fetchAddresses };
};
