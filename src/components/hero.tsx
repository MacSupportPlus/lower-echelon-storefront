"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const LINES = ["We hope", "you enjoy", "your stay."];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".hero-word, .hero-fade", { yPercent: 0, opacity: 1 });
        gsap.set(".hero-img", { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(".hero-word", { yPercent: 115 }, { yPercent: 0, duration: 1.4, stagger: 0.12 }, 0.2)
        .fromTo(
          ".hero-img",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, stagger: 0.18 },
          0.35,
        )
        .fromTo(".hero-img img", { scale: 1.35 }, { scale: 1, duration: 1.8, stagger: 0.18 }, 0.35)
        .fromTo(".hero-fade", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.9);

      // Headline drifts and fades as you scroll away; photos move at different speeds for depth.
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-title", { yPercent: -18, opacity: 0.15, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-photo-main", { yPercent: -8, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-photo-side", { yPercent: -28, ease: "none", scrollTrigger: scrub });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-10 pt-28 md:px-8">
      {/* Photos: full-bleed and dimmed behind the type on mobile, framed on the right on desktop. */}
      <div className="hero-photo-main absolute inset-0 md:inset-y-24 md:left-auto md:right-8 md:w-[36vw]">
        <div className="hero-img relative h-full w-full">
          <Image
            src="/products/run-it-up-tracksuit/1.jpg"
            alt="Model in a green Run It Up tracksuit in front of NYC housing towers"
            fill
            priority
            sizes="(min-width: 768px) 36vw, 100vw"
            className="object-cover object-top opacity-45 md:opacity-100"
          />
        </div>
      </div>
      <div className="hero-photo-side absolute bottom-24 right-[30vw] hidden w-[15vw] md:block">
        <div className="hero-img relative aspect-[4/5] w-full border-4 border-ink">
          <Image
            src="/products/day-n-night-sweatsuit/1.jpg"
            alt="Model in a Day n Night sweatsuit leaning against a brick building"
            fill
            priority
            sizes="15vw"
            className="object-cover"
          />
        </div>
      </div>

      <p className="hero-fade label absolute left-5 top-24 z-10 text-concrete-300 opacity-0 md:left-8">
        Lower Echelon Worldwide — Est. 2020 — NYC
      </p>
      <h1 className="hero-title display relative z-10 text-[19vw] md:text-[12.5vw]">
        {LINES.map((line) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <span className="hero-word block will-change-transform">{line}</span>
          </span>
        ))}
      </h1>
      <div className="hero-fade relative z-10 mt-8 flex items-end justify-between opacity-0">
        <p className="label max-w-56 text-concrete-300">Streetwear from the building. Scroll to check in.</p>
        <Link
          href="/product/run-it-up-tracksuit"
          transitionTypes={["nav-forward"]}
          className="label hidden text-paper hover:text-accent md:block"
        >
          Run It Up Tracksuit — $185 →
        </Link>
        <span className="label animate-bounce text-accent md:hidden">↓</span>
      </div>
    </section>
  );
}
