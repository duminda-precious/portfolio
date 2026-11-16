import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/primitives/Container";
import { WorkFilter } from "@/components/sections/WorkFilter";
import { getAllTags, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "My work",
  description:
    "Design systems, motion, 3D and video. Case studies and the stuff in between.",
};

/**
 * Work index (§2.2).
 *
 * Data is fetched on the server; only the filter interaction is client-side.
 * That keeps the full project list in the initial HTML, so it is crawlable
 * and renders without JS.
 */
export default async function WorkPage() {
  const [projects, allTags] = await Promise.all([getProjects(), getAllTags()]);

  return (
    <>
      <Container as="main" paper className="pb-(--space-section)">
        <div id="main">
          <PageHeader
            title="Things I made on purpose."
            standfirst="Case studies, videos and the odd proof of concept. Filter by what you're into, or just scroll."
          />

          <WorkFilter projects={projects} allTags={allTags} />
        </div>
      </Container>

      <Footer />
    </>
  );
}
