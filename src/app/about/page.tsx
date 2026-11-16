import type { Metadata } from "next";
import Image from "next/image";

import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/primitives/Container";
import { StoryPlayer } from "@/components/sections/StoryPlayer";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "About me",
  description:
    "A decade across branding, UI/UX, motion and 3D, and it all started with comics drawn in the corner of a classroom.",
};

/**
 * About (§2.2).
 *
 * Solid brand blue, from the About frame. The player and the teleprompter
 * share the dark glass bar. The headline uses the homepage h1. Cream is for
 * type on the blue field and on that dark glass.
 *
 * The prompter is the spoken transcript, and Play is that same recording.
 */
export default async function AboutPage() {
  const site = await getSite();

  return (
    <>
      <main className="min-h-dvh bg-brand-500 text-cream [&_:focus-visible]:outline-(--color-cream)">
        <Container className="pt-(--spacing-24) pb-(--space-section)">
          <div id="main">
            <div className="flex flex-col items-start gap-(--spacing-6) sm:flex-row sm:items-center sm:justify-between sm:gap-(--spacing-8)">
              <h1 className="type-h1 text-cream">
                It all started with
                <br />
                a comic book.
              </h1>
              <div className="shrink-0 rotate-2 self-end bg-cream p-3 pb-10 shadow-[0_14px_28px_rgb(0_0_0/0.22)] sm:self-center">
                <Image
                  src="/images/about/duminda.png"
                  alt="Portrait of Duminda M"
                  width={256}
                  height={256}
                  priority
                  className="size-40 object-cover sm:size-48"
                />
              </div>
            </div>

            <div className="mt-(--spacing-8)">
              <StoryPlayer
                src="/audio/about.mp3"
                paragraphs={[
                  "So my first real memory of creating anything is sitting by a wall with my grandpa sketching birds from folktales. By the time I went to school, it turned into a full-blown obsession, actually. Like I ignored all my textbooks, sat in a corner in the classroom, and just drew weekly mini comic series. Everyone was expecting the next episode, so I had something to be happy about.",
                  "I didn't realize it then, but that's where everything started. Not with software or design theory or anything, just pure storytelling.",
                  "Eventually, those sketches evolved into compulsions to improve things, to customize things, to make things unique. Because I remember like I was trying all the tools back in the days to customize my desktop, creating custom wallpapers for my phone, and even painting over my old t-shirts to create unique prints. I actually proudly wore those also.",
                  "So yeah, from that point, I started my bachelors, and after that, I ended up with this award-winning product design agency in Texas. With my decade-old experience in the whole production cycle, it never felt like I'm working, always like I'm making things better.",
                  "Right now I'm learning tons of new things. I started a streetwear label, so now I'm into video editing, social media marketing, hooks and holds, pacing, and all the marketing shenanigans. Switching the perspective from the designer to the client, that's a whole new game.",
                  "Now with AI and all, I feel like it completed me because I was really bad at coding. Now I can exactly communicate whatever I had in my mind — be it a 3D design or some app concept — and in a few days I can create a proper prototype.",
                  "So yeah, at the end of the day, tech is just an amplifier. Whether I'm building a product or rigging a character, the root is still the same as it was in my childhood classroom. It's just a human telling a good story.",
                ]}
              />
            </div>

            {site.skills.length > 0 ? (
              <section
                className="mt-(--spacing-16)"
                aria-labelledby="skills-heading"
              >
                <h2 id="skills-heading" className="type-title text-cream">
                  My skills so far.
                </h2>
                <ul className="mt-(--spacing-4) grid grid-cols-1 gap-x-(--spacing-8) gap-y-(--spacing-2) sm:grid-cols-2 lg:grid-cols-3">
                  {site.skills.map((skill) => (
                    <li key={skill} className="type-h4 text-cream">
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
