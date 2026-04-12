import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Green header band ── */}
      <div className="bg-brew-walnut px-6 pt-10 pb-5">
        <h1 className="text-4xl font-rova text-white tracking-tight">brew</h1>
        <p className="mt-1 text-xs font-lora text-white/50">find your next coffee chat</p>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col px-6 pt-8 pb-10">
        <h2 className="text-3xl font-bold text-brew-walnut leading-tight">
          Your next great<br />connection is a<br />coffee away.
        </h2>
        <p className="mt-3 text-sm font-lora text-brew-midbrown leading-relaxed">
          Skill-swap matching for college students. Connect with someone who has what you need — and needs what you have.
        </p>

        {/* Feature list */}
        <div className="mt-8 space-y-3">
          {[
            ["AI-powered matching", "Paired on skills + goals"],
            ["Skill swap", "Teach what you know, learn what you don't"],
            ["Coffee agenda", "3 convo starters generated for you"],
            ["Cafe finder", "Suggested meetup spots near campus"],
          ].map(([title, sub]) => (
            <div key={title} className="flex items-start gap-3 rounded-lg bg-white px-4 py-3 card-shadow">
              <div className="mt-0.5 w-2 h-2 rounded-full bg-brew-walnut shrink-0" />
              <div>
                <p className="text-sm font-semibold text-brew-walnut">{title}</p>
                <p className="text-xs text-brew-khaki">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 space-y-3">
          <Link href="/auth/signup" className="btn-primary block text-center">
            Get started
          </Link>
          <Link href="/auth/signin" className="btn-secondary block text-center">
            Sign in
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-brew-khaki">
          .edu email required · Real students only
        </p>
      </div>
    </main>
  );
}
