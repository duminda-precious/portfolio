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
   * Sit the container directly beneath the full-bleed hero band, separated by
   * the measured --hero-content-gap (120px, constant at every viewport).
   *
   * ⚠️ Note for whoever revisits this: the original plan described the white
   * container OVERLAPPING the video by ~56px (negative margin). The redlined
   * artboard measures a 120px GAP instead, so the container no longer rises
   * into the band. If the overlap comes back, this is the one place to change.
   */
  belowHero?: boolean;
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
  belowHero = false,
  as: Component = "div",
  className,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full",
        !bleed && "mx-auto max-w-(--container-max) px-(--container-pad)",
        paper && "bg-paper",
        belowHero && "relative z-(--z-media) mt-(--hero-content-gap)",
        className,
      )}
    >
      {children}
    </Component>
  );
}
