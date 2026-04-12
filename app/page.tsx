import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <span className="text-5xl">☕</span>
        <h1 className="text-5xl font-bold tracking-tight text-brew-brown">brew</h1>
      </div>

      {/* Tagline */}
      <p className="mb-3 text-xl font-medium text-brew-brown/80">
        Corporate Hinge for college students.
      </p>
      <p className="mb-10 max-w-sm text-brew-brown/60">
        Skill-swap matching that connects you with someone who has what you need —
        and needs what you have.
      </p>

      {/* CTA buttons */}
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/auth/signup"
          className="rounded-2xl bg-brew-brown px-6 py-4 text-center font-semibold text-brew-cream shadow-md transition hover:bg-brew-brown/90 active:scale-95"
        >
          Get Started
        </Link>
        <Link
          href="/auth/signin"
          className="rounded-2xl border-2 border-brew-brown/20 bg-white/60 px-6 py-4 text-center font-semibold text-brew-brown transition hover:bg-white/90 active:scale-95"
        >
          Sign In
        </Link>
      </div>

      {/* Fine print */}
      <p className="mt-10 text-xs text-brew-brown/40">
        .edu email required · Only your campus, only real students
      </p>
    </main>
  );
}
