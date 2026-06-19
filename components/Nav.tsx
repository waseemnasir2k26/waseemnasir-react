"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type KeyboardEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { BOOKING } from "./site";
import { SPRING_SNAP, EASE_SILK } from "./motion";

// ─── Nav links ────────────────────────────────────────────────────────────────
const LINKS = [
  { label: "What I solve", href: "#solve" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
] as const;

// ─── Stagger variants for the mobile sheet ────────────────────────────────────
const sheetVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.18,
      ease: EASE_SILK as [number, number, number, number],
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.14,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: SPRING_SNAP,
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.12,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
};

// ─── Active-section hook ───────────────────────────────────────────────────────
function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

// ─── Hamburger bars component ──────────────────────────────────────────────────
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span
      className="relative flex h-5 w-6 flex-col items-center justify-center gap-[5px]"
      aria-hidden
    >
      <motion.span
        className="block h-px w-6 origin-center bg-chalk"
        animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={SPRING_SNAP}
      />
      <motion.span
        className="block h-px w-6 origin-center bg-chalk"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={SPRING_SNAP}
      />
      <motion.span
        className="block h-px w-6 origin-center bg-chalk"
        animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={SPRING_SNAP}
      />
    </span>
  );
}

// ─── Main Nav component ────────────────────────────────────────────────────────
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const active = useActiveSection(["solve", "work", "about"]);

  // useScroll-based blur toggle (composes with scroll-linked effects)
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24);
  });

  // ─── Scroll lock helpers ──────────────────────────────────────────────────────
  // iOS-safe: `overflow:hidden` alone does NOT stop background touch-scroll on
  // iOS Safari, so we pin the body with position:fixed and restore scroll on close.
  // Works whether or not Lenis is running (it early-returns under reduced-motion).
  const scrollYRef = useRef(0);
  const lockScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    window.scrollTo(0, scrollYRef.current);
    window.__lenis?.start();
  }, []);

  // ─── Open / close ────────────────────────────────────────────────────────────
  const openSheet = useCallback(() => {
    setOpen(true);
    lockScroll();
  }, [lockScroll]);

  const closeSheet = useCallback(() => {
    setOpen(false);
    unlockScroll();
    // Return focus to hamburger
    hamburgerRef.current?.focus();
  }, [unlockScroll]);

  const toggleSheet = useCallback(() => {
    open ? closeSheet() : openSheet();
  }, [open, openSheet, closeSheet]);

  // Focus first link when sheet opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstLinkRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape key + cleanup on unmount
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeSheet]);

  // Cleanup scroll lock on unmount — full reset so the body never stays pinned
  useEffect(() => {
    return () => {
      unlockScroll();
    };
  }, [unlockScroll]);

  // ─── Focus trap ──────────────────────────────────────────────────────────────
  const handleSheetKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !sheetRef.current) return;
    const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  return (
    <>
      {/* ── Sticky header bar ─────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[padding,background-color,border-color,backdrop-filter] duration-500 ease-out ${
          scrolled
            ? "py-3 backdrop-blur-xl bg-ink/75 border-b border-line"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="shell flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="group flex items-center gap-2.5 z-10">
            <motion.span
              className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent font-mono text-sm font-bold ring-1 ring-accent/30"
              whileHover={{
                scale: 1.08,
                backgroundColor: "rgba(123,108,255,0.22)",
              }}
              transition={SPRING_SNAP}
            >
              WN
            </motion.span>
            <span className="text-sm font-medium tracking-tight text-chalk">
              Waseem Nasir
            </span>
          </a>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 text-sm text-mute md:flex"
            aria-label="Main navigation"
          >
            {LINKS.map(({ label, href }) => {
              const id = href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={href}
                  href={href}
                  className={`link-underline relative transition-colors duration-200 hover:text-chalk ${
                    isActive ? "text-chalk" : ""
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold"
                      transition={SPRING_SNAP}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA + mobile hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={BOOKING}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm hidden md:inline-flex"
            >
              Book a call
            </a>

            {/* Hamburger — mobile only */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={toggleSheet}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-sheet"
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-chalk md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <HamburgerIcon open={open} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen sheet ───────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — tap to close */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[54] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: EASE_SILK as [number, number, number, number],
              }}
              onClick={closeSheet}
              aria-hidden
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              id="mobile-nav-sheet"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-0 z-[55] flex flex-col px-8 pt-28 pb-12 md:hidden"
              style={{
                background:
                  "linear-gradient(160deg, rgba(10,10,11,0.97) 0%, rgba(16,14,32,0.97) 100%)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              }}
              variants={sheetVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onKeyDown={handleSheetKeyDown}
            >
              {/* Nav links — oversized serif */}
              <nav aria-label="Mobile navigation">
                <motion.ul className="flex flex-col gap-2" role="list">
                  {LINKS.map(({ label, href }, i) => {
                    const id = href.slice(1);
                    const isActive = active === id;
                    return (
                      <motion.li key={href} variants={linkVariants}>
                        <a
                          ref={i === 0 ? firstLinkRef : undefined}
                          href={href}
                          onClick={closeSheet}
                          className={`group flex items-baseline gap-4 py-3 text-4xl font-serif tracking-tight transition-colors duration-150 ${
                            isActive
                              ? "text-chalk"
                              : "text-mute hover:text-chalk"
                          }`}
                        >
                          <span
                            className="font-mono text-xs text-accent/50 tabular-nums"
                            aria-hidden
                          >
                            0{i + 1}
                          </span>
                          {label}
                          {isActive && (
                            <span
                              className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                              aria-hidden
                            />
                          )}
                        </a>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>

              {/* Divider */}
              <motion.div
                className="my-8 h-px bg-line"
                variants={linkVariants}
                aria-hidden
              />

              {/* Full-width CTA */}
              <motion.div variants={linkVariants}>
                <a
                  href={BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeSheet}
                  className="btn-primary block w-full py-4 text-center text-lg"
                >
                  Book a 30-min call
                  <span aria-hidden className="ml-2">
                    →
                  </span>
                </a>
              </motion.div>

              {/* Footnote */}
              <motion.p
                className="mt-auto text-xs text-mute/50"
                variants={linkVariants}
              >
                SkynetLabs · Independent AI Engineer
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
