
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let animationContext;

function initializeAnimations() {
  animationContext?.revert();

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const progressBar = document.querySelector("#progressBar");

  if (progressBar && !reducedMotion) {
    gsap.to(progressBar, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2
      }
    });
  }

  if (reducedMotion) {
    return;
  }

  animationContext = gsap.context(() => {
    const heroContent = document.querySelector(".hero-content");

    if (heroContent) {
      gsap.from(heroContent.children, {
        opacity: 0,
        y: 15,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out"
      });
    }

    const revealElements = document.querySelectorAll(
      ".service-item, .process-item, .about-content, .project-card, .contact-content"
    );

    revealElements.forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 18,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      });
    });
  });
}

document.addEventListener("astro:page-load", initializeAnimations);

if (document.readyState !== "loading") {
  initializeAnimations();
} else {
  document.addEventListener("DOMContentLoaded", initializeAnimations, {
    once: true
  });
}
