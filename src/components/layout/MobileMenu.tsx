"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { NavItem } from "@/lib/content";

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
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        data-cursor="cta"
        data-cursor-label="Open menu"
        className="type-action min-h-[44px] px-(--spacing-2) text-ink md:hidden"
      >
        Menu
      </button>

      {isOpen ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          className="fixed inset-0 z-(--z-lightbox) flex flex-col bg-paper px-(--container-pad) py-(--spacing-6) md:hidden"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              data-cursor="cta"
              data-cursor-label="Close menu"
              className="type-action min-h-[44px] px-(--spacing-2) text-ink"
            >
              Close
            </button>
          </div>

          <nav aria-label="Main" className="mt-(--spacing-12)">
            <Nav items={items} variant="overlay" onNavigate={close} />
          </nav>
        </div>
      ) : null}
    </>
  );
}
