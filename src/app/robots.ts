import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/content";

/** ⚠️ Placeholder domain — replace before launch (matches layout.tsx). */
const BASE_URL = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* /tokens is a dev-only design reference and 404s in production
       * anyway, but excluding it costs nothing and documents the intent. */
      disallow: ["/tokens"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
