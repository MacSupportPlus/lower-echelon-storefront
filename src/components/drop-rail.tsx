"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Desktop: section pins and the row scrolls sideways as you scroll down.
// Mobile / reduced motion: plain horizontal swipe with scroll-snap.
export function DropRail({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth + 64;
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative flex min-h-[100svh] flex-col justify-center py-16">
      <div className="mb-8 flex items-end justify-between px-5 md:px-8">
        <h2 className="display text-6xl md:text-8xl">The drop</h2>
        <p className="label hidden text-concrete-500 md:block">Keep scrolling →</p>
      </div>
      <div className="overflow-x-auto px-5 [scrollbar-width:none] md:overflow-hidden md:px-8">
        <div ref={track} className="flex w-max snap-x gap-5 will-change-transform md:gap-8">
          {children}
        </div>
      </div>
    </section>
  );
}
