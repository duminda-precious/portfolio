import type { MetadataRoute } from "next";

/** ⚠️ Placeholder domain — replace before launch (matches layout.tsx). */
const BASE_URL = "https://example.com";

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
