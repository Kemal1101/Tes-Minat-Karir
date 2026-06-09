import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../../components/landing-page/Hero";
import About from "../../components/landing-page/About";
import HowItWorks from "../../components/landing-page/HowItWorks";
import SocialProof from "../../components/landing-page/SocialProof";
import CallToAction from "../../components/landing-page/CallToAction";
import Footer from "../../components/shared/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const container = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. INTRO TIMELINE (Dihapus agar tidak mengurangi kualitas HD pada kartu)
      
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
    <div id="landing-container" ref={container} className="w-full text-black font-sans selection:bg-appBlob selection:text-black">
      <Hero />
      <About />
      <HowItWorks />
      <SocialProof />
      <CallToAction />
      <Footer />
    </div>
  );
}
