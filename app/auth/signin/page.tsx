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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setLoading(true);
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
    } finally { setLoading(false); }
  }

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      <div className="brew-header px-6 pt-10 pb-6">
        <Link href="/" className="text-white/40 text-xs mb-4 block font-medium tracking-wide hover:text-white/70 transition-colors">
          ← Back
        </Link>
        <h1 className="text-3xl font-rova text-white animate-fade-in" style={{ letterSpacing: "-0.01em" }}>brew</h1>
        <p className="mt-1 text-xs font-lora text-white/50 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          find your next coffee chat
        </p>
      </div>

      <div className="flex-1 px-6 pt-8 pb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-2xl font-bold text-brew-walnut" style={{ letterSpacing: "-0.02em" }}>Welcome back.</h2>
        <p className="mt-1 text-sm font-lora text-brew-midbrown">Sign in to find your next match.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <p className="section-label">EMAIL</p>
            <input type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@university.edu" className="brew-input" />
          </div>
          <div>
            <p className="section-label">PASSWORD</p>
            <input type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="brew-input" />
          </div>

          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm text-red-600 animate-scale-in"
              style={{ background: "rgba(220,60,60,0.06)", border: "1px solid rgba(220,60,60,0.15)" }}
            >
              {error}
            </div>
          )}

          <div className="pt-1">
            <button type="submit" disabled={loading} className="btn-pill">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-brew-khaki">
          No account?{" "}
          <Link href="/auth/signup" className="font-bold text-brew-walnut hover:underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
