"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";

const MAIN_ROUTES = ["/discover", "/matches", "/messages", "/profile"];
const CHAT_DETAIL_RE = /^\/messages\/[^/]+$/;

export function PhoneShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const showNav = MAIN_ROUTES.some((r) => path.startsWith(r));
  const isChatDetail = CHAT_DETAIL_RE.test(path);

  return (
    /* Dark outer background on desktop; full-screen on mobile */
    <div className="min-h-screen bg-brew-offwhite md:bg-[#1A0A04] md:flex md:items-center md:justify-center md:min-h-screen">
      {/* Phone chrome — full screen on mobile, phone-shaped on desktop */}
      <div className="relative w-full bg-brew-offwhite md:w-[390px] md:h-[844px] md:rounded-[48px] md:overflow-hidden md:border-[8px] md:border-[#1A0A04] md:shadow-phone">

        {/* Dynamic Island — desktop only, absolute so headers extend behind it */}
        <div className="hidden md:flex absolute top-0 left-0 right-0 z-20 justify-center pt-3 pointer-events-none">
          <div className="w-28 h-7 bg-[#1A0A04] rounded-full" />
        </div>

        {/* Scrollable content */}
        {isChatDetail ? (
          <div className="md:h-full flex flex-col overflow-hidden">
            {children}
          </div>
        ) : (
          <div className={`md:h-full md:overflow-y-auto${showNav ? " pb-20 md:pb-20" : ""}`}>
            {children}
          </div>
        )}

        {/* Bottom nav — inside phone on desktop, fixed bottom on mobile */}
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
