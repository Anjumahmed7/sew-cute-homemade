// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../lib/api";

// export const HomePage = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     let mounted = true;

//     async () => {
//       try {
//         const res = await api.me();

//         if (!mounted) return;
//         setUser(res?.data?.user ?? null);
//       } catch (e) {
//         navigate("/auth", { replace: true });
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//   }, [navigate]);

//   if (loading) return <p>Loading...</p>;
//   if (err) return <p className="text-red-600">{err}</p>;
//   if (!user) return null;

//   return (
//     <div className="space-y-3">
//       <h1 className="text-2xl font-semibold">Welcome, {user.fullName}</h1>
//       <p className="text-gray-700">You're logged in via the backend session.</p>
//     </div>
//   );
// };

// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.me(); // { status, data: { user } }
        if (!mounted) return;
        setUser(res?.data?.user ?? null);
      } catch (e) {
        if (!mounted) return;
        navigate("/auth", { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!user) return null; // we'll have navigated already

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Welcome, {user.fullName}</h1>
      <p className="text-gray-700">You're logged in via the backend session.</p>
    </div>
  );
};
