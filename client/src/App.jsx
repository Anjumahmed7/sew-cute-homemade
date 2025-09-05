import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthPage } from "./pages/AuthPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ShopPages } from "./pages/ShopPages.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import api from "./lib/api";
import logo from "./assets/logo.png";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Re-check session whenever the path changes (after login redirect)
  useEffect(() => {
    if (location.pathname.startsWith("/auth")) {
      setUser(null);
      return;
    }
    (async () => {
      try {
        const res = await api.me();
        setUser(res?.data?.user || null);
      } catch {
        setUser(null);
      }
    })();
  }, [location.pathname]); // ✅ this runs after navigating to "/"

  async function handleLogout() {
    try {
      await api.logout();
      setUser(null);
      // forcefully go to /auth so header resets immediately
      window.location.href = "/auth";
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  return (
    <div className="min-h-screen bg-pink-100 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between">
          <Link to="/shop" className="flex items-center gap-3 hover:opacity-90">
            <img
              src={logo}
              alt="Sew Cute Homemade Logo"
              className="h-16 w-16 md:h-20 md:w-20 object-contain"
            />
            <span
              className="text-3xl md:text-4xl font-bold tracking-wide text-pink-900"
              style={{ fontFamily: '"Great Vibes", cursive' }}
            >
              Sew Cute Homemade
            </span>
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="hover:underline text-red-600 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link to="/auth" className="hover:underline">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<ShopPages user={user} />} />
          <Route path="/shop" element={<ShopPages user={user} />} />
          <Route path="/product/:slug" element={<ProductDetailsPage />} />
          <Route path="/auth" element={<AuthPage onAuthed={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
