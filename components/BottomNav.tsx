"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MessageSquare, BookHeart, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/discover",  label: "Discover",  Icon: Compass },
  { href: "/messages",  label: "Messages",  Icon: MessageSquare },
  { href: "/matches",   label: "Matches",   Icon: BookHeart },
  { href: "/profile",   label: "Profile",   Icon: User },
];

export function BottomNav() {
  const path = usePathname();

  return (
    // Always absolute — lives inside the PhoneShell's relative container,
    // which is the phone frame on desktop AND fills the screen on mobile.
    // Never fixed — that would escape the phone frame onto the desktop.
    <nav
      className="absolute bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.90)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderTop: "1px solid rgba(212,207,198,0.5)",
        boxShadow: "0 -4px 24px rgba(61,31,13,0.07)",
      }}
    >
      <div className="flex">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 pt-3 pb-4 relative"
              style={{
                color: active ? "var(--brew-walnut)" : "#B0A99F",
                transition: "color 0.2s ease",
              }}
            >
              {active && (
                <span
                  className="absolute top-1.5 w-1 h-1 rounded-full animate-pop-in"
                  style={{ background: "var(--brew-walnut)" }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.6}
                style={{ transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)" }}
              />
              <span
                className="text-[10px] tracking-wide"
                style={{ fontWeight: active ? 700 : 500 }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
