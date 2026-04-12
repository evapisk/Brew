import Link from "next/link";
import { Sparkles, ArrowLeftRight, MessageSquare, MapPin } from "lucide-react";

const FEATURES = [
  { Icon: Sparkles,       title: "AI-powered matching", sub: "Paired on skills + goals" },
  { Icon: ArrowLeftRight, title: "Skill swap",          sub: "Teach what you know, learn what you don't" },
  { Icon: MessageSquare,  title: "Coffee agenda",       sub: "3 convo starters generated for you" },
  { Icon: MapPin,         title: "Cafe finder",         sub: "Suggested meetup spots near campus" },
];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden">

      {/* ── Full-page background image ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/iced_coffee.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "30% center",
          filter: "brightness(0.55) saturate(0.9)",
        }}
      />
      {/* Beige overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, rgba(232,228,220,0.18) 0%, rgba(196,168,130,0.32) 50%, rgba(155,115,80,0.55) 100%)",
        }}
      />

      {/* ── Brown header ── */}
      <div className="relative z-10 brew-header px-6 pt-10 pb-5 shrink-0">
        <h1
          className="text-4xl font-rova text-white animate-fade-in"
          style={{ letterSpacing: "-0.01em", animationDelay: "0.05s" }}
        >
          brew
        </h1>
        <p
          className="mt-1 text-xs font-lora text-white/55 animate-fade-in"
          style={{ animationDelay: "0.15s" }}
        >
          find your next coffee chat
        </p>
      </div>

      {/* ── Body ── */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pt-8 pb-10">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2
            className="text-3xl font-raleway font-bold text-white leading-tight"
            style={{ letterSpacing: "-0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
          >
            Your next great<br />connection is a<br />coffee away.
          </h2>
          <p className="mt-3 text-sm font-lora text-white/65 leading-relaxed">
            Skill-swap matching for college students. Connect with someone who has what you need — and needs what you have.
          </p>
        </div>

        {/* Feature list */}
        <div className="mt-8 space-y-2.5 stagger">
          {FEATURES.map(({ Icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
              style={{
                background: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(92,46,14,0.9), rgba(61,31,13,0.9))",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}
              >
                <Icon size={17} color="#fff" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-raleway font-bold text-white" style={{ letterSpacing: "-0.01em" }}>{title}</p>
                <p className="text-xs font-raleway text-white/55 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 space-y-3 animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          <Link href="/auth/signup" className="btn-pill block text-center font-raleway">
            Get started
          </Link>
          <Link
            href="/auth/signin"
            className="block w-full text-center rounded-full py-4 font-raleway font-semibold text-white/80 transition-all active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255,255,255,0.20)",
            }}
          >
            Sign in
          </Link>
        </div>

        <p className="mt-6 text-center text-xs font-raleway text-white/35 animate-fade-in" style={{ animationDelay: "0.55s" }}>
          .edu email required · Real students only
        </p>
      </div>
    </main>
  );
}
