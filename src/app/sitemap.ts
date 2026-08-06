import type { MetadataRoute } from "next";

import { getProjects } from "@/lib/content";

/** ⚠️ Placeholder domain — replace before launch (matches layout.tsx). */
const BASE_URL = "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  /* Only routes that actually exist. /about and /ai-workflow are in the
   * sitemap plan (§2.2) but are not built yet — listing them would advertise
   * 404s to crawlers. */
  const staticRoutes = ["", "/work", "/work-with-me"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
