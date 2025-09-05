import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await api.signup({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        await api.login({
          email: form.email.trim(),
          password: form.password,
        });
      }

      // warm up session info
      await api.me();

      //  go home
      navigate("/", { replace: true });
    } catch (error) {
      setErr(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {mode === "signup" ? "Create account" : "Welcome back"}
        </h1>
        <button
          type="button"
          className="text-sm text-pink-700 hover:underline cursor-pointer"
          onClick={() => {
            setMode((m) => (m === "signup" ? "login" : "signup"));
            setErr("");
          }}
        >
          {mode === "signup" ? "Have an account? Log in" : "New here? Sign up"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        {mode === "signup" && (
          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              required
              autoComplete="name"
              className="w-full rounded border px-3 py-2"
              placeholder="Your Name"
            />
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            autoComplete="email"
            className="w-full rounded border px-3 py-2"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"} // 👈 toggle type
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              className="w-full rounded border px-3 py-2 pr-10"
              placeholder="password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
              tabIndex={-1} // not focusable in tab order
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-pink-600 py-2 text-white transition-opacity hover:opacity-80 disabled:opacity-60 cursor-pointer"
        >
          {loading
            ? "Please wait..."
            : mode === "signup"
            ? "Sign up"
            : "Log in"}
        </button>
      </form>
    </div>
  );
};
