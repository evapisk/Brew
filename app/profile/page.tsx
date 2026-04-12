"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* Header */}
      <div className="bg-brew-walnut px-6 pt-14 pb-6">
        <h1 className="text-xl font-bold text-white">brew</h1>
        <p className="text-xs text-white/50 mt-0.5">find your next coffee chat</p>
        <p className="mt-3 text-sm font-semibold text-white/80">Profile</p>
      </div>

      <div className="flex-1 px-6 pt-6 pb-24 space-y-4">
        {/* Account card */}
        <div className="rounded-xl bg-white card-shadow px-5 py-4">
          <p className="section-label">ACCOUNT</p>
          <p className="text-sm font-semibold text-brew-walnut">{email ?? "Loading…"}</p>
          <p className="text-xs text-brew-khaki mt-0.5">Brew member</p>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </main>
  );
}
