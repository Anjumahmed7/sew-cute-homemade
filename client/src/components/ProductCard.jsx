// import { formatCAD } from "../lib/format";
// import { Link } from "react-router-dom";

// export default function ProductCard({ product, onOrder }) {
//   const { _id, slug, name, price, salePrice, images = [] } = product;
//   const img = images?.[0] || "https://via.placeholder.com/400x300?text=Towel";
//   const href = `/product/${slug || _id}`;

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden transform transition-transform duration-200 hover:scale-110 hover:shadow-1g hover:cursor-pointer">
//       <Link to={href} aria-label={`View ${name}`} className="block">
//         <img src={img} alt={name} className="w-full h-48 object-cover" />
//       </Link>
//       <div className="p-4">
//         <h3 className="font-medium">{name}</h3>
//         <div className="mt-2">
//           {salePrice ? (
//             <div className="flex items-center gap-2">
//               <span className="text-pink600 font-semibold">
//                 ${formatCAD(salePrice)}
//               </span>
//               <span className="text-gray-500 line-through text-sm">
//                 ${price}
//               </span>
//             </div>
//           ) : (
//             <span className="font-semibold">CA{formatCAD(price)}</span>
//           )}
//         </div>
//         <button
//           onClick={onOrder}
//           className="mt-4 w-full rounded bg-pink-600 py-2 text-white transition-opacity hover:opacity-60 hover:cursor-pointer"
//         >
//           Order
//         </button>
//       </div>
//     </div>
//   );
// }
import { Link } from "react-router-dom";
import { formatCAD } from "../lib/format";

export default function ProductCard({ product, onContact }) {
  const { _id, slug, name, price, images = [] } = product;
  const img = images[0] || "/images/placeholder-600x400.png";
  const href = `/product/${slug || _id}`;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <Link to={href} className="block" aria-label={`View ${name}`}>
        <img src={img} alt={name} className="w-full h-48 object-cover" />
      </Link>

      <div className="p-4">
        <Link to={href} className="font-medium hover:underline block">
          {name}
        </Link>
        <p className="mt-1 text-pink-700 font-semibold">CA{formatCAD(price)}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={href}
            className="rounded border border-pink-600 text-pink-600 py-2 text-center hover:bg-pink-50"
          >
            Details
          </Link>
          <button
            onClick={onContact}
            className="rounded bg-pink-600 text-white py-2 hover:opacity-80 hover:cursor-pointer"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}
