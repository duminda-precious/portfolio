"use client";

import { useState } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * The big contact email: a mailto link, plus a copy-to-clipboard button that
 * appears on hover.
 *
 * The button is hidden with opacity, not display, so it stays in the tab
 * order — keyboard focus reveals it, and touch devices (no hover) always show
 * it. Otherwise the copy action would exist for mouse users only.
 */
export function CopyEmail({
  email,
  onBrand = false,
  className,
}: {
  email: string;
  /** Sits on the solid blue band: cream type, glass made for blue. */
  onBrand?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions, insecure origin): the mailto link
      // beside the button still works, so there is nothing to recover.
    }
  };

  return (
    <div
      className={cn(
        "group mt-(--spacing-8) flex flex-wrap items-center gap-(--spacing-4)",
        className,
      )}
    >
      {/* No data-cursor — a large underlined link is its own CTA. */}
      <a
        href={`mailto:${email}`}
        className={cn(
          "type-h4 inline-flex min-h-[44px] items-center underline underline-offset-8 [overflow-wrap:anywhere]",
          onBrand ? "text-cream" : "text-brand-700",
        )}
      >
        {email}
      </a>

      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied" : "Copy email address"}
        className={cn(
          "flex h-[44px] w-[44px] items-center justify-center rounded-(--radius-pill) opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100",
          onBrand ? "glass-on-brand text-ink" : "glass-tint text-ink",
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {copied ? (
            <path d="M5 13l4 4L19 7" />
          ) : (
            <>
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V6a2 2 0 0 1 2-2h9" />
            </>
          )}
        </svg>
      </button>

      {/* Announces the result — the icon swap alone is silent. */}
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
