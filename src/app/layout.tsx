import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";

import "./globals.css";

/**
 * Rethink Sans — the brand face, used across every level (§3.3).
 *
 * Served through next/font/google, which self-hosts the files at build time,
 * subsets them, and emits the preload links. No network request to Google at
 * runtime and no layout shift, so this beats hand-rolling @font-face.
 *
 * Variable axis 400–800 covers every weight the type spec calls for:
 * Regular 400 · SemiBold 600 · Bold 700.
 */
const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  variable: "--font-rethink-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Duminda M — Crafting Experiences That Move. Literally.",
    template: "%s — Duminda M",
  },
  description:
    "Senior Creative Director working across design systems, motion, and 3D. Currently making interfaces that move — literally.",
  metadataBase: new URL("https://example.com"), // TODO: real domain before launch
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Duminda M",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${rethinkSans.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/*
          Skip link — must be the first focusable element (§11).
          Visually hidden until focused, then pinned top-left.
        */}
        <a
          href="#main"
          className="sr-only-focusable absolute top-(--spacing-4) left-(--spacing-4) z-(--z-lightbox) bg-ink px-(--spacing-4) py-(--spacing-3) text-(length:--text-body) text-paper"
        >
          Skip to content
        </a>

        {/*
          Header / Footer / CursorProvider / Lenis land here in later phases.
          Order per §4: fonts → CursorProvider → Lenis → Header → children → Footer.
        */}
        {children}
      </body>
    </html>
  );
}
