import React, { useEffect, useRef, useState } from 'react';

export interface MotionState {
  rawY: number;
  smoothY: number;
  velocity: number;
  direction: 1 | -1;
  maxScroll: number;
  vh: number;
  vw: number;
  cursorX: number;
  cursorY: number;
  lerpCursorX: number;
  lerpCursorY: number;
  cursorDeltaX: number;
  cursorDeltaY: number;
  normX: number;
  normY: number;
  reducedMotion: boolean;
  webdriver: boolean;
  now: number;
}

type MotionSubscriber = (state: MotionState) => void;

const subscribers = new Set<MotionSubscriber>();
let rafHandle = 0;
let initialized = false;

const state: MotionState = {
  rawY: 0,
  smoothY: 0,
  velocity: 0,
  direction: 1,
  maxScroll: 1,
  vh: typeof window !== 'undefined' ? window.innerHeight : 900,
  vw: typeof window !== 'undefined' ? window.innerWidth : 1440,
  cursorX: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 720,
  cursorY: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 450,
  lerpCursorX: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 720,
  lerpCursorY: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 450,
  cursorDeltaX: 0,
  cursorDeltaY: 0,
  normX: 0,
  normY: 0,
  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  webdriver:
    typeof navigator !== 'undefined'
      ? Boolean((navigator as Navigator & { webdriver?: boolean }).webdriver)
      : false,
  now: 0,
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function ensureMotionEngine() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  state.rawY = window.scrollY || 0;
  state.smoothY = state.rawY;
  state.vw = Math.max(1, window.innerWidth);
  state.vh = Math.max(1, window.innerHeight);
  state.maxScroll = Math.max(1, document.documentElement.scrollHeight - state.vh);

  const onScroll = () => {
    const nextY = window.scrollY || 0;
    if (nextY !== state.rawY) {
      state.direction = nextY >= state.rawY ? 1 : -1;
      state.rawY = nextY;
    }
  };

  const onResize = () => {
    state.vw = Math.max(1, window.innerWidth);
    state.vh = Math.max(1, window.innerHeight);
    state.maxScroll = Math.max(1, document.documentElement.scrollHeight - state.vh);
  };

  const onPointerMove = (e: PointerEvent | MouseEvent) => {
    state.cursorX = e.clientX;
    state.cursorY = e.clientY;
    state.normX = (e.clientX / state.vw) * 2 - 1;
    state.normY = -((e.clientY / state.vh) * 2 - 1);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const tick = (now: number) => {
    state.now = now;
    state.rawY = window.scrollY || 0;
    state.maxScroll = Math.max(1, document.documentElement.scrollHeight - state.vh);

    if (state.reducedMotion) {
      state.smoothY = state.rawY;
      state.velocity = 0;
      state.lerpCursorX = state.cursorX;
      state.lerpCursorY = state.cursorY;
      state.cursorDeltaX = 0;
      state.cursorDeltaY = 0;
    } else {
      const nextSmooth = lerp(state.smoothY, state.rawY, 0.105);
      state.velocity = state.rawY - nextSmooth;
      if (Math.abs(state.velocity) < 0.04) {
        state.smoothY = state.rawY;
        state.velocity = 0;
      } else {
        state.smoothY = nextSmooth;
      }

      const prevLX = state.lerpCursorX;
      const prevLY = state.lerpCursorY;
      state.lerpCursorX = lerp(state.lerpCursorX, state.cursorX, 0.095);
      state.lerpCursorY = lerp(state.lerpCursorY, state.cursorY, 0.095);
      state.cursorDeltaX = state.lerpCursorX - prevLX;
      state.cursorDeltaY = state.lerpCursorY - prevLY;
    }

    subscribers.forEach((fn) => fn(state));
    rafHandle = window.requestAnimationFrame(tick);
  };

  rafHandle = window.requestAnimationFrame(tick);
}

export function subscribeMotion(fn: MotionSubscriber): () => void {
  ensureMotionEngine();
  subscribers.add(fn);
  fn(state);
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && rafHandle && typeof window !== 'undefined') {
      // Keep engine warm while app stays mounted; lightweight single RAF
    }
  };
}

export function getMotionSnapshot(): MotionState {
  ensureMotionEngine();
  return state;
}

/* =========================================================================
   1. RIGHT-EDGE INERTIAL SCROLLBAR THUMB (.c-scrollbar from mod-954-core.js)
   ========================================================================= */
export function SmoothScrollbar() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let hideTimer = 0;
    let lastRawY = -1;

    return subscribeMotion((s) => {
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;

      const docH = Math.max(s.vh + 1, document.documentElement.scrollHeight);
      const ratio = Math.min(0.45, Math.max(0.06, s.vh / docH));
      const thumbH = Math.round(ratio * s.vh);
      const travel = Math.max(0, s.vh - thumbH - 8);
      const progress = Math.min(1, Math.max(0, s.smoothY / Math.max(1, docH - s.vh)));

      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translate3d(0, ${(4 + progress * travel).toFixed(1)}px, 0)`;

      if (Math.abs(s.rawY - lastRawY) > 0.5) {
        lastRawY = s.rawY;
        track.classList.add('is-scrolling');
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => {
          track.classList.remove('is-scrolling');
        }, 900);
      }
    });
  }, []);

  return (
    <div ref={trackRef} className="dc-scrollbar" aria-hidden="true">
      <div ref={thumbRef} className="dc-scrollbar-thumb" />
    </div>
  );
}

/* =========================================================================
   2. MAGNETIC CIRCULAR CTA (.e-cta — Exact module 4154 atan2 + inner inverse)
   ========================================================================= */
export function MagneticCta({
  label,
  onClick,
  type = 'button',
  disabled = false,
  offsetX = 0,
  offsetY = 0,
  fadeOpacity = 1,
}: {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  offsetX?: number;
  offsetY?: number;
  fadeOpacity?: number;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const extraOffsetRef = useRef({ x: offsetX, y: offsetY, opacity: fadeOpacity });

  useEffect(() => {
    extraOffsetRef.current = { x: offsetX, y: offsetY, opacity: fadeOpacity };
  }, [offsetX, offsetY, fadeOpacity]);

  useEffect(() => {
    const btn = btnRef.current;
    const fill = fillRef.current;
    const inner = innerRef.current;
    if (!btn || !fill || !inner) return;

    const physics = {
      hover: false,
      targetX: 0,
      targetY: 0,
      lerpX: 0,
      lerpY: 0,
      targetScale: 1,
      lerpScale: 1,
    };

    const getAngleOffset = (clientX: number, clientY: number) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(clientY - cy, clientX - cx);
      const dist = rect.width * 0.56 + 34;
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        cx,
        cy,
        rect,
      };
    };

    const onEnter = (e: MouseEvent) => {
      if (window.innerWidth < 900 || getMotionSnapshot().reducedMotion) return;
      physics.hover = true;
      physics.targetScale = 0.88;
      btn.classList.add('is-hovered');

      const { x, y } = getAngleOffset(e.clientX, e.clientY);
      fill.style.transition = 'none';
      fill.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(0.08)`;
      void fill.offsetWidth;
      fill.style.transition = 'transform 0.78s cubic-bezier(0.19, 1, 0.22, 1)';
      fill.style.transform = 'translate3d(0px, 0px, 0) scale(1.06)';
    };

    const onMove = (e: MouseEvent) => {
      if (window.innerWidth < 900 || getMotionSnapshot().reducedMotion) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      physics.targetX = (e.clientX - cx) * 0.44;
      physics.targetY = (e.clientY - cy) * 0.44;
    };

    const onLeave = (e: MouseEvent) => {
      physics.hover = false;
      physics.targetX = 0;
      physics.targetY = 0;
      physics.targetScale = 1;
      btn.classList.remove('is-hovered');

      if (window.innerWidth < 900 || getMotionSnapshot().reducedMotion) return;
      const { x, y } = getAngleOffset(e.clientX, e.clientY);
      fill.style.transition = 'transform 0.78s cubic-bezier(0.19, 1, 0.22, 1)';
      fill.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(0.05)`;
    };

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);

    const unsub = subscribeMotion((s) => {
      if (s.reducedMotion) {
        btn.style.transform = 'none';
        inner.style.transform = 'none';
        btn.style.opacity = '1';
        return;
      }
      physics.lerpX = lerp(physics.lerpX, physics.targetX, 0.11);
      physics.lerpY = lerp(physics.lerpY, physics.targetY, 0.11);
      physics.lerpScale = lerp(physics.lerpScale, physics.targetScale, 0.12);

      const ex = extraOffsetRef.current;
      const tx = physics.lerpX + ex.x;
      const ty = physics.lerpY + ex.y;
      btn.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${physics.lerpScale.toFixed(3)})`;
      btn.style.opacity = ex.opacity.toFixed(3);
      inner.style.transform = `translate3d(${(-physics.lerpX * 0.35).toFixed(2)}px, ${(-physics.lerpY * 0.35).toFixed(2)}px, 0)`;
    });

    return () => {
      unsub();
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="dc-cta"
    >
      <span ref={fillRef} className="dc-cta-fill" aria-hidden="true" />
      <span ref={innerRef} className="dc-cta-inner">
        <svg
          className="dc-cta-arrow"
          width="47"
          height="34"
          viewBox="0 0 47 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M40.9824 27.5159L45.2008 11.9169C45.9366 9.19629 44.3248 6.40455 41.6008 5.6814L25.9824 1.53516"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M44.8394 7.95507L1.49414 32.9805" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="dc-cta-text">{label}</span>
      </span>
    </button>
  );
}

/* =========================================================================
   3. MAGNETIC ROUNDED-DIAMOND PRISM CTA (.e-prism-cta 160x160 — chunk-509)
   ========================================================================= */
export function MagneticPrismCta({
  label,
  ariaLabel,
  dashOffset,
  onClick,
}: {
  label: string;
  ariaLabel: string;
  dashOffset: number;
  onClick: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const fill = fillRef.current;
    const inner = innerRef.current;
    if (!btn || !fill || !inner) return;

    const physics = {
      targetX: 0,
      targetY: 0,
      lerpX: 0,
      lerpY: 0,
      targetScale: 1,
      lerpScale: 1,
    };

    const onEnter = (e: MouseEvent) => {
      if (window.innerWidth < 900 || getMotionSnapshot().reducedMotion) return;
      physics.targetScale = 0.91;
      btn.classList.add('is-hovered');
      const rect = btn.getBoundingClientRect();
      const angle = Math.atan2(
        e.clientY - (rect.top + rect.height / 2),
        e.clientX - (rect.left + rect.width / 2)
      );
      // Convert screen angle into -45deg rotated local frame of .dc-prism-cta-fill-wrap
      const localAngle = angle - Math.PI / 4;
      const sx = Math.cos(localAngle) * 115;
      const sy = Math.sin(localAngle) * 115;
      fill.style.transition = 'none';
      fill.style.transform = `translate3d(${sx.toFixed(1)}%, ${sy.toFixed(1)}%, 0) scale(0.2)`;
      void fill.offsetWidth;
      fill.style.transition = 'transform 0.76s cubic-bezier(0.19, 1, 0.22, 1)';
      fill.style.transform = 'translate3d(0%, 0%, 0) scale(1.04)';
    };

    const onMove = (e: MouseEvent) => {
      if (window.innerWidth < 900 || getMotionSnapshot().reducedMotion) return;
      const rect = btn.getBoundingClientRect();
      physics.targetX = (e.clientX - (rect.left + rect.width / 2)) * 0.36;
      physics.targetY = (e.clientY - (rect.top + rect.height / 2)) * 0.36;
    };

    const onLeave = (e: MouseEvent) => {
      physics.targetX = 0;
      physics.targetY = 0;
      physics.targetScale = 1;
      btn.classList.remove('is-hovered');
      if (window.innerWidth < 900 || getMotionSnapshot().reducedMotion) return;
      const rect = btn.getBoundingClientRect();
      const angle = Math.atan2(
        e.clientY - (rect.top + rect.height / 2),
        e.clientX - (rect.left + rect.width / 2)
      );
      const localAngle = angle - Math.PI / 4;
      const ex = Math.cos(localAngle) * 120;
      const ey = Math.sin(localAngle) * 120;
      fill.style.transition = 'transform 0.76s cubic-bezier(0.19, 1, 0.22, 1)';
      fill.style.transform = `translate3d(${ex.toFixed(1)}%, ${ey.toFixed(1)}%, 0) scale(0.1)`;
    };

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);

    const unsub = subscribeMotion((s) => {
      if (s.reducedMotion) return;
      physics.lerpX = lerp(physics.lerpX, physics.targetX, 0.11);
      physics.lerpY = lerp(physics.lerpY, physics.targetY, 0.11);
      physics.lerpScale = lerp(physics.lerpScale, physics.targetScale, 0.12);
      btn.style.transform = `translate3d(${physics.lerpX.toFixed(2)}px, ${physics.lerpY.toFixed(2)}px, 0) scale(${physics.lerpScale.toFixed(3)})`;
      inner.style.transform = `translate3d(${(-physics.lerpX * 0.32).toFixed(2)}px, ${(-physics.lerpY * 0.32).toFixed(2)}px, 0)`;
    });

    return () => {
      unsub();
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      className="dc-prism-cta"
      aria-label={ariaLabel}
    >
      <div className="dc-prism-cta-fill-wrap" aria-hidden="true">
        <span ref={fillRef} className="dc-prism-cta-fill" />
      </div>

      <svg
        className="dc-prism-cta-svg dc-prism-cta-bg-stroke"
        viewBox="0 0 165 165"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          d="M82.5,0.9c6.4,0,12.8,2.4,17.7,7.3l56.6,56.6c9.8,9.8,9.8,25.6,0,35.4l-56.6,56.6c-9.8,9.8-25.6,9.8-35.4,0L8.3,100.2c-9.8-9.8-9.8-25.6,0-35.4L64.8,8.3C69.7,3.4,76.1,0.9,82.5,0.9"
        />
      </svg>

      <svg
        className="dc-prism-cta-svg dc-prism-cta-prog-stroke"
        viewBox="0 0 165 165"
        xmlns="http://www.w3.org/2000/svg"
        style={{ strokeDashoffset: dashOffset }}
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          d="M82.5,0.9c6.4,0,12.8,2.4,17.7,7.3l56.6,56.6c9.8,9.8,9.8,25.6,0,35.4l-56.6,56.6c-9.8,9.8-25.6,9.8-35.4,0L8.3,100.2c-9.8-9.8-9.8-25.6,0-35.4L64.8,8.3C69.7,3.4,76.1,0.9,82.5,0.9"
        />
      </svg>

      <div ref={innerRef} className="dc-prism-cta-inner">
        <svg
          className="dc-prism-cta-quad"
          width="32"
          height="32"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            className="q-east"
            d="M25.8912 12.2407C26.5397 11.5921 27.5912 11.5921 28.2397 12.2407L31.958 15.959C32.6066 16.6075 32.6066 17.659 31.958 18.3075L28.2397 22.0259C27.5912 22.6744 26.5397 22.6744 25.8912 22.0259L22.1728 18.3075C21.5243 17.659 21.5243 16.6075 22.1728 15.959L25.8912 12.2407Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="q-west"
            d="M5.89215 12.2407C6.54068 11.5921 7.59214 11.5921 8.24066 12.2407L11.959 15.959C12.6075 16.6075 12.6075 17.659 11.959 18.3075L8.24066 22.0259C7.59214 22.6744 6.54068 22.6744 5.89215 22.0259L2.1738 18.3075C1.52528 17.659 1.52528 16.6075 2.1738 15.959L5.89215 12.2407Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="q-south"
            d="M15.8248 22.1743C16.4733 21.5257 17.5248 21.5257 18.1733 22.1743L21.8916 25.8926C22.5402 26.5411 22.5402 27.5926 21.8916 28.2411L18.1733 31.9595C17.5248 32.608 16.4733 32.608 15.8248 31.9595L12.1064 28.2411C11.4579 27.5926 11.4579 26.5411 12.1064 25.8926L15.8248 22.1743Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="q-north"
            d="M15.8248 2.17425C16.4733 1.52573 17.5248 1.52573 18.1733 2.17425L21.8916 5.89261C22.5402 6.54113 22.5402 7.59259 21.8916 8.24111L18.1733 11.9595C17.5248 12.608 16.4733 12.608 15.8248 11.9595L12.1064 8.24111C11.4579 7.59259 11.4579 6.54113 12.1064 5.89261L15.8248 2.17425Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <span className="text-[13.5px] leading-tight">{label}</span>
      </div>
    </button>
  );
}

/* =========================================================================
   4. SPLIT CHARACTERS WITH KINETIC DOUBLE-ROLL HOVER ([data-char])
   ========================================================================= */
export function SplitChars({
  word,
  baseDelay = 0,
  stagger = 0.04,
  rollOnHover = false,
  revealed = true,
}: {
  word: string;
  baseDelay?: number;
  stagger?: number;
  rollOnHover?: boolean;
  revealed?: boolean;
}) {
  const chars = word.split('');
  const total = chars.length;

  return (
    <span
      aria-label={word}
      className={`dc-split-word ${rollOnHover ? 'dc-split-word--roll' : ''} ${revealed ? 'is-revealed' : ''}`}
    >
      {chars.map((ch, idx) => (
        <span key={`${word}-${idx}`} className="dc-char-mask" aria-hidden="true">
          <span
            className="dc-char"
            data-char={ch}
            style={
              {
                transitionDelay: `${(baseDelay + idx * stagger).toFixed(3)}s`,
                '--char-delay': `${(idx * 0.028).toFixed(3)}s`,
                '--char-rev-delay': `${((total - 1 - idx) * 0.024).toFixed(3)}s`,
              } as React.CSSProperties
            }
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

/* =========================================================================
   5. MASKED LINE-BY-LINE REVEAL & SUPTITLE DIAMOND REVEAL (module 912)
   ========================================================================= */
export function useInViewOnce(threshold = 0.12) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (inView) return;
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin: '0px 0px -4% 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}

export function SuptitleTag({ label }: { label: string }) {
  const { ref, inView } = useInViewOnce(0.08);
  return (
    <div ref={ref} className={`dc-diamond-tag ${inView ? 'is-inview' : ''}`}>
      <span className="dc-diamond-tag-dot" aria-hidden="true" />
      <span className="dc-line-mask">
        <span className="dc-line-inner">{label}</span>
      </span>
    </div>
  );
}

export function SplitLines({
  lines,
  as = 'p',
  className = '',
  stagger = 0.09,
}: {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  className?: string;
  stagger?: number;
}) {
  const { ref, inView } = useInViewOnce(0.1);
  const Tag = as;

  return (
    <div ref={ref}>
      <Tag className={`${className} ${inView ? 'is-inview' : ''}`} aria-label={lines.join(' ')}>
        {lines.map((line, i) => (
          <span key={line} className="dc-line-mask block" aria-hidden="true">
            <span
              className="dc-line-inner block"
              style={{ transitionDelay: `${(i * stagger).toFixed(3)}s` }}
            >
              {line}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/* =========================================================================
   6. CURVED DOUBLE-BEZIER SVG CURTAIN TRANSITION (Ee.prototype mod-954)
   ========================================================================= */
export function CurvedCurtainTransition({
  transitionId,
  onMidpoint,
}: {
  transitionId: number;
  onMidpoint?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lightPathRef = useRef<SVGPathElement | null>(null);
  const darkPathRef = useRef<SVGPathElement | null>(null);
  const midRef = useRef(onMidpoint);

  useEffect(() => {
    midRef.current = onMidpoint;
  }, [onMidpoint]);

  useEffect(() => {
    if (transitionId === 0) return;

    const snap = getMotionSnapshot();
    if (snap.reducedMotion || snap.webdriver) {
      midRef.current?.();
      return;
    }

    const wrap = wrapRef.current;
    const pLight = lightPathRef.current;
    const pDark = darkPathRef.current;
    if (!wrap || !pLight || !pDark) return;

    let frame = 0;
    let calledMid = false;
    const start = performance.now();
    const totalMs = 920;

    wrap.style.pointerEvents = 'auto';
    wrap.style.visibility = 'visible';

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const buildCoverPath = (prog: number) => {
      // Bottom-up curved arch: M 0 100 V sideY Q 50 peakY 100 sideY V 100 z
      const e = easeInOutCubic(Math.min(1, Math.max(0, prog)));
      const arch = Math.sin(e * Math.PI) * 24;
      const sideY = (1 - e) * 100;
      const peakY = Math.max(0, sideY - arch);
      return `M 0 100 V ${sideY.toFixed(2)} Q 50 ${peakY.toFixed(2)} 100 ${sideY.toFixed(2)} V 100 z`;
    };

    const buildRevealPath = (prog: number) => {
      // Retract upward toward top edge: M 0 0 V sideY Q 50 peakY 100 sideY V 0 z
      const e = easeInOutCubic(Math.min(1, Math.max(0, prog)));
      const arch = Math.sin(e * Math.PI) * 22;
      const sideY = (1 - e) * 100;
      const peakY = Math.min(100, sideY + arch);
      return `M 0 0 V ${sideY.toFixed(2)} Q 50 ${peakY.toFixed(2)} 100 ${sideY.toFixed(2)} V 0 z`;
    };

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / totalMs);

      if (t <= 0.48) {
        const pL = Math.min(1, t / 0.40);
        const pD = Math.min(1, Math.max(0, (t - 0.06) / 0.42));
        pLight.setAttribute('d', buildCoverPath(pL));
        pDark.setAttribute('d', buildCoverPath(pD));
      } else {
        if (!calledMid) {
          calledMid = true;
          midRef.current?.();
        }
        const outT = (t - 0.48) / 0.52;
        const pD = Math.min(1, outT / 0.88);
        const pL = Math.min(1, Math.max(0, (outT - 0.08) / 0.92));
        pDark.setAttribute('d', buildRevealPath(pD));
        pLight.setAttribute('d', buildRevealPath(pL));
      }

      if (t < 1) {
        frame = window.requestAnimationFrame(step);
      } else {
        pLight.setAttribute('d', 'M 0 100 V 100 Q 50 100 100 100 V 100 z');
        pDark.setAttribute('d', 'M 0 100 V 100 Q 50 100 100 100 V 100 z');
        wrap.style.pointerEvents = 'none';
        wrap.style.visibility = 'hidden';
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [transitionId]);

  return (
    <div ref={wrapRef} className="dc-curtain-overlay" aria-hidden="true">
      <svg
        className="dc-curtain-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={lightPathRef}
          fill="#1D9878"
          d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
        />
        <path
          ref={darkPathRef}
          fill="#FFFFFF"
          d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
        />
      </svg>
    </div>
  );
}
