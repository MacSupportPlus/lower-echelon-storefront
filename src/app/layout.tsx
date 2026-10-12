import type { Metadata } from "next";
import { Anton, Geist, Space_Mono } from "next/font/google";
import "./globals.css";

// True root layout: fonts, html/body shell, metadata only. The storefront's fixed header,
// cart drawer and grain overlay live in (site)/layout.tsx instead — they must NOT wrap
// /admin, whose fixed-position header would otherwise sit on top of and intercept clicks
// meant for the admin UI (found by testing the actual admin flow, not by inspection).
const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const spaceMono = Space_Mono({ variable: "--font-space-mono", weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Lower Echelon Worldwide", template: "%s — Lower Echelon Worldwide" },
  description: "We hope you enjoy your stay. NYC streetwear, est. 2020.",
  // Preview build: keep it out of search results so it never competes with the live site.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${anton.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
