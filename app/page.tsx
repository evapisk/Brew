import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowLeftRight, MessageSquare, MapPin } from "lucide-react";

const playfair = { fontFamily: "var(--font-playfair)", fontStyle: "normal" as const };

const FEATURES = [
  { Icon: Sparkles,       title: "AI-powered matching", sub: "Paired on skills + goals" },
  { Icon: ArrowLeftRight, title: "Skill swap",          sub: "Teach what you know, learn what you don't" },
  { Icon: MessageSquare,  title: "Coffee agenda",       sub: "3 convo starters generated for you" },
  { Icon: MapPin,         title: "Cafe finder",         sub: "Suggested meetup spots near campus" },
];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">

      {/* ── Brown header ── */}
      <div className="relative brew-header px-6 pt-14 pb-10 shrink-0 overflow-hidden">
        {/* Text — wider, ~60% of page */}
        <h1
          className="font-rova animate-fade-in leading-none"
          style={{ fontSize: "clamp(2.2rem, 13vw, 5rem)", letterSpacing: "-0.02em", animationDelay: "0.05s", width: "60%" }}
        >
          <span className="text-white">brew</span><span style={{ fontFamily: "var(--font-playfair)", color: "#C8A882", fontSize: "0.9em" }}></span>
          <br />
          <span style={{ color: "#C8A882", ...playfair, fontWeight: 500, fontSize: "0.3em", lineHeight: 1.0, display: "block", marginTop: "-0.05em", whiteSpace: "nowrap" }}>helping each other on campus</span>
        </h1>

        {/* Coffee icon — right side */}
        <div className="absolute right-0 bottom-0 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <Image
            src="/coffee-landing.png"
            alt="Coffee cup"
            width={180}
            height={180}
            style={{ imageRendering: "pixelated", mixBlendMode: "screen" }}
            priority
          />
        </div>
      </div>

      {/* ── Body — white background ── */}
      <div className="flex flex-1 flex-col bg-white px-6 pt-8 pb-10">

        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2
            className="text-3xl font-bold leading-tight"
            style={{ ...playfair, letterSpacing: "-0.01em",  fontSize: "01.5em", color: "#3D1F0D" }}
          >
            coffee chats are broken, <br/>we <span style={{ color: "#C8A882" }}>brew</span> something better<br />
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ ...playfair, color: "#7A5C3A" }}>
            Intentional matching for college students with similar goals. Meet someone who has what you need and needs what you have.
          </p>
        </div>

        {/* Feature list */}
        <div className="mt-8 space-y-2.5 stagger">
          {FEATURES.map(({ Icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
              style={{
                background: "#FAF8F4",
                border: "1px solid #EAE6DF",
                boxShadow: "0 1px 4px rgba(61,31,13,0.07)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #5C2E0E, #3D1F0D)",
                  boxShadow: "0 2px 8px rgba(61,31,13,0.25)",
                }}
              >
                <Icon size={17} color="#fff" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ ...playfair, color: "#3D1F0D" }}>{title}</p>
                <p className="text-xs mt-0.5" style={{ ...playfair, color: "#9A7A5A" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 space-y-3 animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          <Link href="/auth/signup" className="btn-pill block text-center" style={playfair}>
            join brew
          </Link>
          <Link
            href="/auth/signin"
            className="block w-full text-center rounded-full py-4 font-semibold transition-all active:scale-[0.98]"
            style={{
              ...playfair,
              background: "#F2EDE6",
              border: "1.5px solid #D4CFC6",
              color: "#5C2E0E",
            }}
          >
            i'm back
          </Link>
        </div>

        <p className="mt-6 text-center text-xs animate-fade-in" style={{ ...playfair, color: "#B8A090", animationDelay: "0.55s" }}>
          .edu email required · Real students only
        </p>
      </div>
    </main>
  );
}
