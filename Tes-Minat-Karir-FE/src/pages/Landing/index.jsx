import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import HowItWorksSection from "../components/HowItWorksSection";
import CTASection from "../components/CTASection";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const container = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. INTRO TIMELINE (Hero Section)
      const tl = gsap.timeline();
      tl.fromTo(".hero-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 })
        .fromTo(".hero-desc", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.6")
        .fromTo(".cta-group", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.8");

      // 2. STAGGER REVEAL (How It Works)
      gsap.utils.toArray(".reveal-section").forEach((section) => {
        gsap.fromTo(section.querySelectorAll(".reveal-item"), 
          { y: 50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
          }
        );
      });

      // 3. BENTO GRID ANIMATION (About Section)
      gsap.fromTo(".bento-card", 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: "#about",
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)",
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="text-black font-sans selection:bg-appBlob selection:text-black">
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}
