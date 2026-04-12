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
    /* fixed on mobile so it stays visible when page content scrolls;
       absolute on desktop so it clips inside the phone frame */
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D4CFC6] md:absolute md:left-0 md:right-0 md:bottom-0">
      <div className="flex">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 pt-3 pb-4 transition-colors ${
                active ? "text-brew-walnut" : "text-[#AAA49A] hover:text-brew-khaki"
              }`}
            >
              <Icon size={21} strokeWidth={active ? 2.2 : 1.7} />
              <span className={`text-[10px] font-semibold tracking-wide ${active ? "text-brew-walnut" : "text-[#AAA49A]"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
