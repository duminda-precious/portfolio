import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: ReactNode;
  /** Opt out of the max-width + gutter. For the full-bleed video band. */
  bleed?: boolean;
  /**
   * Render the white paper surface. The homepage content container is white
   * and sits on the grey page; the video band is not.
   */
  paper?: boolean;
  /**
   * Pull the container up into the preceding full-bleed band by
   * --hero-overlap. This is the mockup's signature structural move.
   *
   * Done with negative margin rather than absolute positioning so the element
   * stays in document flow — the page below it moves up too, which is what we
   * want, and nothing needs a manually maintained height.
   */
  overlap?: boolean;
  as?: ElementType;
  className?: string;
};

/**
 * The 1280px content container. See plan.md §7, §9.1.
 */
export function Container({
  children,
  bleed = false,
  paper = false,
  overlap = false,
  as: Component = "div",
  className,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full",
        !bleed && "mx-auto max-w-(--container-max) px-(--container-pad)",
        paper && "bg-paper",
        overlap && "relative z-(--z-media) -mt-(--hero-overlap)",
        className,
      )}
    >
      {children}
    </Component>
  );
}
