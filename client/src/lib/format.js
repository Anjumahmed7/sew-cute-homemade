export const formatCAD = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2, // always show 2 decimals
    maximumFractionDigits: 2,
  }).format(n ?? 0);
