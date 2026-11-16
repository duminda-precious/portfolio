"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Reading pace for the teleprompter when there is no narration file. */
const WORDS_PER_MINUTE = 140;
const PIXELS_PER_SECOND = 28;

function formatRemaining(seconds: number) {
  const total = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(total / 60);
  const remain = total % 60;
  return `-${minutes}:${remain.toString().padStart(2, "0")}`;
}

function wordCount(node: ReactNode): number {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim().split(/\s+/).filter(Boolean).length;
  }
  if (Array.isArray(node)) {
    return node.reduce((sum, child) => sum + wordCount(child), 0);
  }
  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return wordCount(props.children);
  }
  return 0;
}

/**
 * Audio control plus the story it scrolls.
 *
 * Both surfaces use .glass-dark, the same field as the play bar, with cream
 * type. The shared .glass is too opaque on a flat blue field.
 *
 * Pass `src` once a narration file exists (for example `/audio/about.mp3`).
 * Without one, Play scrolls the text at a reading pace. Reduced motion skips
 * the scroll and leaves the story as a normal reading panel.
 */
export function StoryPlayer({
  paragraphs,
  src,
}: {
  paragraphs: ReactNode[];
  src?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const labelId = useId();

  const readSeconds = useMemo(() => {
    const words = wordCount(paragraphs);
    return Math.max(20, (words / WORDS_PER_MINUTE) * 60);
  }, [paragraphs]);

  const useAudio = Boolean(src) && audioReady;

  /* A cached file can finish loading before React attaches onLoadedMetadata,
   * which would leave Play on the silent scroll timer. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || audio.readyState < 1) return;
    setAudioReady(true);
    if (timeRef.current && Number.isFinite(audio.duration)) {
      timeRef.current.textContent = formatRemaining(audio.duration);
    }
  }, [src]);

  function paint(fraction: number, secondsLeft: number) {
    progressRef.current = fraction;
    if (barRef.current) barRef.current.style.width = `${fraction * 100}%`;
    if (timeRef.current) timeRef.current.textContent = formatRemaining(secondsLeft);
    if (trackRef.current) {
      trackRef.current.setAttribute(
        "aria-valuenow",
        String(Math.round(fraction * 100)),
      );
    }
  }

  useEffect(() => {
    if (!playing || reduced || useAudio) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const el = scrollerRef.current;
      if (!el) return;

      const max = el.scrollHeight - el.clientHeight;
      const delta = now - last;
      last = now;

      if (max <= 0) {
        paint(1, 0);
        setPlaying(false);
        return;
      }

      el.scrollTop += (delta / 1000) * PIXELS_PER_SECOND;
      const fraction = Math.min(1, el.scrollTop / max);
      paint(fraction, readSeconds * (1 - fraction));

      if (fraction >= 1) {
        setPlaying(false);
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced, useAudio, readSeconds]);

  function toggle() {
    if (useAudio) {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        if (audio.ended) audio.currentTime = 0;
        void audio.play();
      } else {
        audio.pause();
      }
      return;
    }

    const el = scrollerRef.current;
    if (playing) {
      setPlaying(false);
      return;
    }
    if (el && progressRef.current >= 0.99) {
      el.scrollTop = 0;
      paint(0, readSeconds);
    }
    setPlaying(true);
  }

  const showControls = !reduced || useAudio;

  return (
    <div className="space-y-(--spacing-4)">
      {src ? (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onLoadedMetadata={() => {
            setAudioReady(true);
            const audio = audioRef.current;
            if (audio && timeRef.current && Number.isFinite(audio.duration)) {
              timeRef.current.textContent = formatRemaining(audio.duration);
            }
          }}
          onError={() => setAudioReady(false)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={() => {
            const audio = audioRef.current;
            const el = scrollerRef.current;
            if (!audio || !audio.duration) return;
            const fraction = audio.currentTime / audio.duration;
            if (el && !reduced) {
              const max = el.scrollHeight - el.clientHeight;
              el.scrollTop = fraction * max;
            }
            paint(fraction, audio.duration - audio.currentTime);
          }}
        />
      ) : null}

      {showControls ? (
        <div className="glass-dark flex items-center gap-(--spacing-4) rounded-(--radius-sm) px-(--spacing-2) py-(--spacing-2)">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={playing}
            aria-label={playing ? "Pause story" : "Play story"}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream text-brand-700"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div
            ref={trackRef}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            aria-labelledby={labelId}
            className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-cream/35"
          >
            <span
              ref={barRef}
              className="absolute inset-y-0 left-0 rounded-full bg-cream"
            />
          </div>
          <span
            ref={timeRef}
            id={labelId}
            className="type-caption pr-(--spacing-3) text-cream tabular-nums"
          >
            {formatRemaining(readSeconds)}
          </span>
        </div>
      ) : null}

      <div
        className={
          reduced
            ? "glass-dark max-h-[22rem] overflow-y-auto rounded-(--radius-sm) px-(--spacing-6) py-(--spacing-6)"
            : "glass-dark h-[22rem] overflow-hidden rounded-(--radius-sm)"
        }
      >
        <div
          ref={scrollerRef}
          data-cursor="text"
          tabIndex={0}
          aria-label="My story"
          className={
            reduced
              ? "space-y-(--spacing-6)"
              : "h-full space-y-(--spacing-6) overflow-y-auto px-(--spacing-6) py-(--spacing-6) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          }
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="type-body mx-auto max-w-[40rem] text-cream">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
      <path d="M1 1.2v13.6L13 8 1 1.2Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
      <path d="M1 1h4v14H1V1Zm8 0h4v14H9V1Z" fill="currentColor" />
    </svg>
  );
}
