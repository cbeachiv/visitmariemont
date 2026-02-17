"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Try again.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b2618] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-body text-[#78ddaa] text-xs tracking-widest uppercase mb-3">
            Admin Access
          </p>
          <h1 className="font-heading text-white text-3xl font-bold">
            Bureau Control Room
          </h1>
          <p className="font-body text-white/40 text-sm mt-2">
            Authorized personnel only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 font-body focus:outline-none focus:border-[#78ddaa]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 font-body focus:outline-none focus:border-[#78ddaa]"
          />
          {error && (
            <p className="font-body text-red-400 text-sm text-center">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#78ddaa] text-[#0b2618] rounded-xl font-body font-bold hover:bg-[#5ec996] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Enter the Control Room →"}
          </button>
        </form>
      </div>
    </div>
  );
}
