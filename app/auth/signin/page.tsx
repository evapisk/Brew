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
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new Error(authError.message);
      const { data: profile } = await supabase
        .from("users").select("onboarded").eq("auth_id", data.user.id).single();
      router.push(profile?.onboarded ? "/discover" : "/onboarding");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* Header */}
      <div className="bg-brew-walnut px-6 pt-14 pb-8">
        <Link href="/" className="text-white/60 text-sm mb-3 block">← Back</Link>
        <h1 className="text-2xl font-bold text-white">brew</h1>
        <p className="mt-1 text-sm text-white/60">find your next coffee chat</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-8 pb-10">
        <h2 className="text-2xl font-bold text-brew-walnut">Welcome back.</h2>
        <p className="mt-1 text-sm text-brew-midbrown">Sign in to find your next match.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <p className="section-label">EMAIL</p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@university.edu"
              className="brew-input"
            />
          </div>

          <div>
            <p className="section-label">PASSWORD</p>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="brew-input"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <div className="pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-brew-khaki">
          No account?{" "}
          <Link href="/auth/signup" className="font-semibold text-brew-walnut underline-offset-2 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
