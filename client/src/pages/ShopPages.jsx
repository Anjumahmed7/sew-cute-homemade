import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import ContactModal from "../components/ContactModel"; // ✅ correct file name

export const ShopPages = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [contactProduct, setContactProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getProducts();
        setProducts(res?.data?.products || []);
      } catch (e) {
        setErr(e.message || "Failed to load products");
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function openContact(p) {
    setContactProduct(p);
    setContactOpen(true);
  }

  function handleOrder(product) {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/product/${product.slug || product._id}`);
  }

  if (loading) return <p>Loading collections...</p>;
  if (err) return <p className="text-red-600">{err}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Towel Collection</h1>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onContact={() => openContact(p)} // ✅ open modal
            />
          ))}
        </div>
      )}

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        productName={contactProduct?.name}
      />
    </div>
  );
};
