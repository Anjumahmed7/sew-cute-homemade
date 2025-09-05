// src/components/ContactModal.jsx
import { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaFacebook, FaInstagram } from "react-icons/fa";
import CONTACT from "../config/contact";

export default function ContactModal({ open, onClose, productName }) {
  // handle mount/animate
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    if (!open) return;
    // animate in on mount
    const t = requestAnimationFrame(() => setEnter(true));

    // close on ESC
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(t);
      window.removeEventListener("keydown", onKey);
      setEnter(false);
    };
  }, [open, onClose]);

  if (!open) return null;

  const subject = encodeURIComponent(
    `Towel inquiry: ${productName || CONTACT.shopName}`
  );
  const body = encodeURIComponent(
    `Hi! I'm interested in "${productName || ""}".\n\nThanks!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          enter ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative z-10 w-full max-w-md rounded-xl bg-white shadow-lg transition-all duration-200
        ${
          enter
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-1"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold">Contact to Order</h3>
          <p className="text-sm text-gray-600 mt-1">{CONTACT.locationNote}</p>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-sm">
            <div className="text-gray-500">Product</div>
            <div className="font-medium">
              {productName || "General inquiry"}
            </div>
          </div>

          {/* Email */}
          <a
            href={`mailto:${CONTACT.email}?subject=${subject}&body=${body}`}
            className="flex items-center gap-2 rounded bg-pink-600 text-white px-4 py-2 hover:opacity-90"
          >
            <FaEnvelope /> {CONTACT.email}
          </a>

          {/* Phone */}
          <a
            href={`tel:${CONTACT.phoneHref}`}
            className="flex items-center gap-2 rounded border border-pink-600 text-pink-600 px-4 py-2 hover:bg-pink-50"
          >
            <FaPhone /> {CONTACT.phone}
          </a>

          {/* Socials */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded border px-4 py-2 hover:bg-gray-50"
            >
              <FaFacebook className="text-blue-600" /> Facebook
            </a>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded border px-4 py-2 hover:bg-gray-50"
            >
              <FaInstagram className="text-pink-500" /> Instagram
            </a>
          </div>
        </div>

        <div className="border-t p-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
