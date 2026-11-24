"use client";

import { useEffect, useId, useRef } from "react";

import { GLASSES, LOGO_VIEWBOX, OUTER, OUTLINE } from "./logoHeadPaths";

/**
 * The header logo, alive.
 *
 * The head turns toward the cursor in perspective, with a slight tilt. The
 * glasses sit a little in front of the head and the ears a little behind it,
 * so a turn reads as a head and not as a flat card. The outline, beard and
 * mouth are one piece with no depth of their own. When the cursor stops (or
 * leaves the window) it glances around instead. No expressions.
 *
 * - Mouse/trackpad: follows the cursor, glances when idle.
 * - Touch (no hover): glances only.
 * - Reduced motion: static. The markup at rest is the original mark.
 *
 * Values were tuned in demos/logo-head-tilt.html.
 */

// Tuned in the demo.
const TURN = 12; // deg, left/right
const NOD = 8; // deg, up/down
const TILT = 4; // deg, roll toward the look direction
const RESPONSE = 0.4; // s, roughly the time to settle
const IDLE_AFTER = 3000; // ms without cursor movement

// Fixed geometry.
const GLASSES_DEPTH = 60; // SVG units in front of the head
const EAR_DEPTH = -20; // SVG units behind the head
const PERSPECTIVE = 3.2; // × rendered size
const REACH = 320; // px from the logo where the turn is ~70% of max

const BLUE = "#2E57EF";

type Vel = { v: number };

/** Critically damped spring step (frame-rate independent). */
function damp(cur: number, target: number, vel: Vel, smoothTime: number, dt: number) {
  const omega = 2 / Math.max(0.0001, smoothTime);
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = cur - target;
  const temp = (vel.v + omega * change) * dt;
  vel.v = (vel.v - omega * temp) * exp;
  return target + (change + temp) * exp;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rad = (d: number) => (d * Math.PI) / 180;

export function AnimatedLogo({ className }: { className?: string }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const rigRef = useRef<HTMLSpanElement>(null);
  const glassesRef = useRef<SVGGElement>(null);
  const earsRef = useRef<SVGGElement>(null);
  const uid = useId().replace(/:/g, "");
  const headClip = `logo-head-${uid}`;
  const earClip = `logo-ears-${uid}`;

  useEffect(() => {
    const box = boxRef.current;
    const rig = rigRef.current;
    const glasses = glassesRef.current;
    const ears = earsRef.current;
    if (!box || !rig || !glasses || !ears) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canFollow = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const pointer = { x: 0, y: 0, inside: false, lastMove: -Infinity };
    const idle = { x: 0, y: 0, rollJ: 0, nextAt: 0, sinceCentre: 0 };
    const head = { yaw: 0, pitch: 0, roll: 0 };
    const vel = { yaw: { v: 0 }, pitch: { v: 0 }, roll: { v: 0 } };

    let raf = 0;
    let wake = 0;
    let last = 0;
    let wasIdle: boolean | null = null;

    const nextGlance = (now: number) => {
      const backToCentre =
        (idle.sinceCentre >= 2 && Math.random() < 0.4) || Math.random() < 0.15;
      if (backToCentre && (idle.x || idle.y)) {
        Object.assign(idle, { x: 0, y: 0, rollJ: 0, sinceCentre: 0 });
        idle.nextAt = now + rand(1800, 3500);
        return;
      }
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < 10; i++) {
        const a = rand(0, Math.PI * 2);
        const r = rand(0.45, 1);
        cx = Math.cos(a) * r;
        cy = Math.sin(a) * r * 0.75; // sideways more than up/down
        if (Math.hypot(cx - idle.x, cy - idle.y) > 0.5) break;
      }
      idle.x = cx;
      idle.y = cy;
      idle.rollJ = rand(-0.35, 0.35);
      idle.sinceCentre++;
      idle.nextAt = now + rand(1000, 2800);
    };

    const start = () => {
      if (wake) {
        clearTimeout(wake);
        wake = 0;
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    function frame(now: number) {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const isIdle = !pointer.inside || now - pointer.lastMove > IDLE_AFTER;

      if (isIdle !== wasIdle) {
        if (isIdle) idle.nextAt = now + 400; // a beat, then the first glance
        wasIdle = isIdle;
      }
      if (isIdle && now >= idle.nextAt) nextGlance(now);

      let nx: number;
      let ny: number;
      let rollN: number;
      if (isIdle) {
        nx = idle.x;
        ny = idle.y;
        rollN = clamp(idle.x + idle.rollJ, -1, 1);
      } else {
        // Aim straight at the cursor from the logo's own centre.
        const r = box!.getBoundingClientRect();
        const dx = pointer.x - (r.left + r.width / 2);
        const dy = pointer.y - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        const u = d / REACH;
        const mag = u / Math.sqrt(1 + u * u);
        nx = d ? (dx / d) * mag : 0;
        ny = d ? (dy / d) * mag : 0;
        rollN = nx;
      }

      const st = RESPONSE / 2.37;
      const tYaw = nx * TURN;
      const tPitch = -ny * NOD; // rotateX < 0 looks down
      const tRoll = rollN * TILT;
      head.yaw = damp(head.yaw, tYaw, vel.yaw, st, dt);
      head.pitch = damp(head.pitch, tPitch, vel.pitch, st * 1.15, dt); // curved path
      head.roll = damp(head.roll, tRoll, vel.roll, st * 1.4, dt); // tilt settles after

      const size = box!.offsetWidth;
      rig!.style.transform =
        `perspective(${(size * PERSPECTIVE).toFixed(1)}px) rotateZ(${head.roll.toFixed(3)}deg) ` +
        `rotateX(${head.pitch.toFixed(3)}deg) rotateY(${head.yaw.toFixed(3)}deg)`;

      const sx = Math.sin(rad(head.yaw));
      const sy = -Math.sin(rad(head.pitch));
      const shift = (depth: number) =>
        `translate(${(depth * sx).toFixed(2)} ${(depth * sy).toFixed(2)})`;
      glasses!.setAttribute("transform", shift(GLASSES_DEPTH));
      ears!.setAttribute("transform", shift(EAR_DEPTH));

      // Settled during an idle hold: sleep until the next glance.
      const settled =
        Math.abs(head.yaw - tYaw) < 0.01 &&
        Math.abs(head.pitch - tPitch) < 0.01 &&
        Math.abs(head.roll - tRoll) < 0.01 &&
        Math.abs(vel.yaw.v) + Math.abs(vel.pitch.v) + Math.abs(vel.roll.v) < 0.01;
      if (isIdle && settled) {
        wake = window.setTimeout(start, Math.max(0, idle.nextAt - performance.now()));
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // hybrid laptops: a tap is not a cursor
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      pointer.lastMove = performance.now();
      start();
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    if (canFollow) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);
    }
    start();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (wake) clearTimeout(wake);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <span ref={boxRef} className={className} style={{ display: "inline-block" }}>
      <span
        ref={rigRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          transformOrigin: "50% 60%", // a little below centre, like a neck
        }}
      >
        <svg
          viewBox={LOGO_VIEWBOX}
          aria-hidden="true"
          focusable="false"
          style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            {/* Head = everything except the two ear bands. */}
            <clipPath id={headClip}>
              <path
                clipRule="evenodd"
                d="M-60 -60H560V570H-60Z M-60 178H101V320H-60Z M399 178H560V320H399Z"
              />
            </clipPath>
            {/* Ears = the two bands, reaching 8 units under the head's solid
                outline so a small shift never opens a gap. */}
            <clipPath id={earClip}>
              <path d="M-60 178H109V320H-60Z M391 178H560V320H391Z" />
            </clipPath>
          </defs>
          {/* Ears: behind the head, with their own white ground + border. */}
          <g ref={earsRef} clipPath={`url(#${earClip})`}>
            <path d={OUTER} fill="#fff" stroke="#fff" strokeWidth={20} />
            <path d={OUTLINE} fill={BLUE} fillRule="evenodd" clipRule="evenodd" />
          </g>
          {/* Head white ground + 10-unit white border. */}
          <g clipPath={`url(#${headClip})`}>
            <path d={OUTER} fill="#fff" stroke="#fff" strokeWidth={20} />
          </g>
          {/* Glasses under the outline, so they tuck behind the head on a turn. */}
          <g ref={glassesRef}>
            <path d={GLASSES} fill={BLUE} fillRule="evenodd" clipRule="evenodd" />
          </g>
          {/* Outline, beard and mouth: one piece, no depth. */}
          <g clipPath={`url(#${headClip})`}>
            <path d={OUTLINE} fill={BLUE} fillRule="evenodd" clipRule="evenodd" />
          </g>
        </svg>
      </span>
    </span>
  );
}
