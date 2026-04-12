"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign in client-side so Supabase sets the session cookie in the browser
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new Error(authError.message);

      // Check onboarding status
      const { data: profile } = await supabase
        .from("users")
        .select("onboarded")
        .eq("auth_id", data.user.id)
        .single();

      router.push(profile?.onboarded ? "/discover" : "/onboarding");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <span className="text-xl font-bold text-brew-brown">brew</span>
        </Link>

        <h2 className="mb-1 text-2xl font-bold text-brew-brown">Welcome back</h2>
        <p className="mb-8 text-sm text-brew-brown/60">Sign in to find your next match</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brew-brown/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@university.edu"
              className="w-full rounded-xl border border-brew-brown/20 bg-white px-4 py-3 text-brew-brown placeholder-brew-brown/30 outline-none focus:border-brew-latte focus:ring-2 focus:ring-brew-latte/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-brew-brown/80">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-brew-brown/20 bg-white px-4 py-3 text-brew-brown placeholder-brew-brown/30 outline-none focus:border-brew-latte focus:ring-2 focus:ring-brew-latte/20"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-2xl bg-brew-brown py-4 font-semibold text-brew-cream shadow-md transition hover:bg-brew-brown/90 disabled:opacity-50 active:scale-95"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brew-brown/60">
          No account?{" "}
          <Link href="/auth/signup" className="font-medium text-brew-brown underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
