import type { Metadata } from "next";
import "./globals.css";
import { PhoneShell } from "@/components/PhoneShell";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brew — Find Your Coffee Chat Match",
  description: "Skill-swap matching for college students. Find your accountability partner.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased ${playfair.variable}`}>
        <PhoneShell>{children}</PhoneShell>
      </body>
    </html>
  );
}
