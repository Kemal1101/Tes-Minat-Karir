import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../../components/landing-page/Hero";
import About from "../../components/landing-page/About";
import HowItWorks from "../../components/landing-page/HowItWorks";
import SocialProofSubscribe from "../../components/landing-page/SocialProofSubscribe";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const container = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. INTRO TIMELINE (Hero Section)
      const tl = gsap.timeline();
      tl.fromTo(".hero-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 })
        .fromTo(".hero-desc", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.6")


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
      <Hero />
      <About />
      <HowItWorks />
      <SocialProofSubscribe />
    </div>
  );
}
