import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { formatCAD } from "../lib/format";
import ContactModal from "../components/ContactModel";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getProduct(slug);
        setProduct(res?.data?.product || null);
      } catch (e) {
        setErr(e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <p>Loading product…</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!product) return <p>Product not found.</p>;

  const {
    name,
    price,
    images = [],
    description,
    size,
    material,
    care,
    availability,
  } = product;

  const main = images[0] || "/images/placeholder-600x400.png";

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image(s) */}
      <div>
        <img src={main} alt={name} className="w-full rounded-lg shadow" />
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.slice(1).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${name} ${i + 2}`}
                className="h-20 w-full object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">{name}</h1>
        <p className="mt-2 text-pink-700 text-xl font-bold">
          CA{formatCAD(price)}
        </p>

        {description && <p className="mt-4 text-gray-700">{description}</p>}

        <div className="mt-4 space-y-2 text-sm">
          {size && (
            <div>
              <span className="font-semibold">Size:</span> {size}
            </div>
          )}
          {material && (
            <div>
              <span className="font-semibold">Material:</span> {material}
            </div>
          )}
          {care && (
            <div>
              <span className="font-semibold">Care:</span> {care}
            </div>
          )}
          {availability && (
            <span className="inline-block rounded-full bg-green-100 text-green-800 px-3 py-1">
              {availability}
            </span>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setContactOpen(true)}
            className="rounded bg-pink-600 text-white px-5 py-2 hover:opacity-90"
          >
            Contact to Order
          </button>
          <Link
            to="/shop"
            className="rounded border border-gray-300 px-5 py-2 hover:bg-gray-50"
          >
            Back to Shop
          </Link>
        </div>
      </div>

      {/* Contact modal */}
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        productName={name}
      />
    </div>
  );
}
