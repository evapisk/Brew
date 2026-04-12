import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brew — Find Your Coffee Chat Match",
  description: "Skill-swap matching for college students. Find your accountability partner.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brew-cream antialiased">{children}</body>
    </html>
  );
}
