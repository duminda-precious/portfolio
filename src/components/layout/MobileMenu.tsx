"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { NavItem } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

import { Nav } from "./Nav";

/**
 * Mobile navigation overlay (§9.2).
 *
 * Below `md` four nav items won't fit, so they collapse behind a TEXT button
 * (`Menu` / `Close`) — no hamburger, consistent with the site-wide no-icons
 * rule.
 *
 * The overlay is a modal surface and behaves like one: focus trapped inside,
 * Esc closes, body scroll locked, and focus returns to the trigger on close.
 */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const onBlue = pathname === "/about";
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // The sheet portals to the body so a transform on an ancestor can never
  // trap its position: fixed inside the header.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    /* Return focus to the trigger. Without this a keyboard user is dumped at
     * the top of the document with no idea where they are. */
    triggerRef.current?.focus();
  }, []);

  // Lock body scroll while open, and restore it precisely on close.
  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Esc to close, plus a focus trap over the panel.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // Wrap focus at both ends so Tab never escapes the overlay.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!isOpen) return;
    panelRef.current
      ?.querySelector<HTMLElement>("a[href], button:not([disabled])")
      ?.focus();
  }, [isOpen]);

  return (
    <>
      {/* No data-cursor — this trigger only renders below md, where the
       * custom cursor never mounts (touch has no fine pointer). */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "type-action min-h-[44px] rounded-(--radius-pill) px-(--spacing-4) transition-colors duration-(--duration-fast) md:hidden",
          /* On the blue bar the trigger is white, like the other items.
           * On the grey page it stays the tinted glass pill. */
          onBlue
            ? "text-paper/60 hover:text-paper focus-visible:text-paper"
            : "glass-tint text-ink/60 hover:text-brand-700 focus-visible:text-brand-700",
        )}
      >
        Menu
      </button>

      {isOpen && isMounted
        ? createPortal(
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          className="glass fixed inset-0 z-(--z-lightbox) flex flex-col px-(--container-pad) pt-(--spacing-6) pb-(--spacing-8) md:hidden"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              className="glass-tint type-action min-h-[44px] rounded-(--radius-pill) px-(--spacing-4) text-ink"
            >
              Close
            </button>
          </div>

          <nav aria-label="Main" className="mt-(--spacing-8)">
            <Nav
              items={items.filter((item) => item.href !== "/work-with-me")}
              variant="overlay"
              onNavigate={close}
            />
          </nav>

          {/* Pinned to the bottom of the sheet, the way the menu frame is. */}
          <Link
            href="/work-with-me"
            onClick={close}
            aria-current={pathname === "/work-with-me" ? "page" : undefined}
            className="type-h4 type-h4-fixed mt-auto flex items-center justify-between pt-(--spacing-8) text-ink/60 no-underline hover:text-brand-700 focus-visible:text-brand-700 active:text-brand-700 aria-[current=page]:text-brand-700"
          >
            Work with me
            <span aria-hidden="true">+</span>
          </Link>
        </div>,
            document.body,
          )
        : null}
    </>
  );
}
