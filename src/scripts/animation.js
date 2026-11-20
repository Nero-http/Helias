
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let animationContext;

function initializeAnimations() {
  animationContext?.revert();

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  animationContext = gsap.context(() => {
    if (reducedMotion) return;

    // =====================================
    // SCROLL PROGRESS
    // =====================================

    const progressBar = document.querySelector("#progressBar");

    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3
        }
      });
    }

    // =====================================
    // HERO - CINEMATIC ENTRANCE
    // =====================================

    const heroContent = document.querySelector(".hero-content");

    if (heroContent) {
      const heroItems = heroContent.children;

      gsap.fromTo(
        heroItems,
        {
          opacity: 0,
          y: 55,
          filter: "blur(10px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.16,
          ease: "power4.out",
          clearProps: "filter"
        }
      );
    }

    // =====================================
    // SECTION LABELS - SLIDE FROM LEFT
    // =====================================

    gsap.utils.toArray(".section-label").forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          x: -35
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // =====================================
    // SERVICES - ALTERNATING REVEAL
    // =====================================

    gsap.utils.toArray(".service-item").forEach((element, index) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          x: index % 2 === 0 ? -55 : 55,
          y: 20
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // =====================================
    // PROCESS - STAGGERED REVEAL
    // =====================================

    gsap.utils.toArray(".process-item").forEach((element, index) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 65,
          scale: 0.94
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay: (index % 4) * 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // =====================================
    // ABOUT - IMAGE REVEAL
    // =====================================

    const aboutImage = document.querySelector(".about-image");

    if (aboutImage) {
      gsap.fromTo(
        aboutImage,
        {
          opacity: 0,
          scale: 0.88,
          y: 45
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutImage,
            start: "top 85%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    }

    // =====================================
    // ABOUT - TEXT REVEAL
    // =====================================

    gsap.utils.toArray(".about-content").forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          x: 45,
          filter: "blur(8px)"
        },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // =====================================
    // PROJECTS - CINEMATIC REVEAL
    // =====================================

    gsap.utils.toArray(".project-card").forEach((card, index) => {
      const image = card.querySelector("img");

      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 60,
          clipPath: "inset(12% 0% 12% 0%)"
        },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          delay: (index % 3) * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play reverse play reverse"
          }
        }
      );

      if (image) {
        gsap.fromTo(
          image,
          {
            scale: 1.15
          },
          {
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      }

      // Project hover interaction
      if (image) {
        const hover = gsap.to(image, {
          scale: 1.06,
          duration: 0.5,
          ease: "power2.out",
          paused: true
        });

        card.addEventListener("mouseenter", () => hover.play());
        card.addEventListener("mouseleave", () => hover.reverse());
      }
    });

    // =====================================
    // CONTACT - BLUR AND FADE
    // =====================================

    gsap.utils.toArray(".contact-content").forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
          filter: "blur(12px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // =====================================
    // REFRESH SCROLL TRIGGERS
    // =====================================

    ScrollTrigger.refresh();
  });
}

// =====================================
// INITIALIZATION
// =====================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAnimations, {
    once: true
  });
} else {
  initializeAnimations();
}

// Astro navigation
document.addEventListener("astro:page-load", initializeAnimations);

document.addEventListener("astro:before-swap", () => {
  animationContext?.revert();
  animationContext = undefined;
});
