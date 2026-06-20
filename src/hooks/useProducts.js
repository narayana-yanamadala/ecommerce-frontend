import { useState, useEffect } from "react";

const API = "https://ecommerce-backend-y36c.onrender.com/api/store";

export const useProducts = (category = "") => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    setLoading(true);
    const url = category
      ? `${API}/products/?category=${category}`
      : `${API}/products/`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => { setError("Failed to load products."); setLoading(false); });
  }, [category]);

  return { products, loading, error };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/products/${id}/`)
      .then((r) => r.json())
      .then((data) => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  return { product, loading };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`${API}/categories/`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);
  return categories;
};
