"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

import { AnimatedLogo } from "./AnimatedLogo";
import { MobileMenu } from "./MobileMenu";
import { Nav } from "./Nav";

/**
 * Fixed site header (§9.2).
 *
 * The bar stays on screen. It does not hide on scroll. No fill — it sits on
 * whatever is behind it. About is the blue field (white type). Everywhere
 * else the type is ink. Only color animates; never height.
 */
export function Header({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  /** About is a solid blue field, so the links are white. */
  const onBlue = pathname === "/about";
  /** Case studies open with a cover that runs to the top of the viewport. */
  const onCover = pathname.startsWith("/work/") && pathname !== "/work/";

  return (
    <>
      {/* No background. The page shows through the bar. */}
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-(--z-header)",
          "bg-transparent transition-colors duration-(--duration-base)",
          onBlue
            ? "text-paper [&_:focus-visible]:outline-(--color-paper)"
            : "text-ink",
          onCover && "text-on-media",
        )}
      >
        <div
          /* Header height tightened to ~48px by decision (2026-08-06):
           * py-(--spacing-1) (4px) top+bottom around the 44px-tall logo
           * link/nav items gives ~52px — as close to 48px as this gets
           * without shrinking below the WCAG 44px touch-target minimum (§7)
           * those elements rely on. */
          className="mx-auto flex max-w-(--container-max) items-center justify-between px-(--container-pad) py-(--spacing-1)"
        >
          {/* No data-cursor — navigation elements keep the native cursor;
           * the colour change already makes them clickable. */}
          <Link
            href="/"
            aria-label="Duminda Madushan — home"
            className="inline-flex min-h-[44px] items-center"
          >
            {/*
              The supplied mark (public/logo-mark.svg): blue line art, white
              face and border, transparent ground. Same art on every field —
              it does not recolor with the page. It follows the cursor and
              glances around when idle (see AnimatedLogo). The link's
              aria-label carries the name.
            */}
            <AnimatedLogo className="h-(--spacing-12) w-(--spacing-12)" />
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <Nav items={items} />
          </nav>

          <MobileMenu items={items} />
        </div>
      </header>
    </>
  );
}
