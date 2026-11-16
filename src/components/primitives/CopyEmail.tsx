"use client";

import { useState } from "react";

import { buttonClasses } from "@/components/primitives/ButtonLink";

/**
 * "Copy email" as a pill, the same material as the buttons beside it, so
 * all the contact actions sit at one level. The label flips to "Copied"
 * for two seconds, and a live region announces it.
 */
export function CopyEmail({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions, insecure origin): the email button
      // beside this one still opens a mail client, so nothing to recover.
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy email address ${email}`}
        className={buttonClasses("glass", className)}
      >
        <span>{copied ? "Copied" : "Copy email"}</span>
        <span aria-hidden="true" className="text-ink-muted">
          {email}
        </span>
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </>
  );
}
