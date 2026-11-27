
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let animationContext;
let contactModalCleanup;

function initializeContactModal() {
  contactModalCleanup?.();

  const trigger = document.querySelector("[data-contact-open]");
  const modal = document.querySelector("[data-contact-modal]");
  const dialog = modal?.querySelector(".contact-dialog");
  const form = modal?.querySelector("[data-contact-form]");
  const status = modal?.querySelector("[data-contact-status]");

  if (!trigger || !modal || !dialog || !form || !status) return;

  const modalContent = dialog.querySelectorAll(
    ".section-label, h2, .contact-modal-intro, .contact-field, .contact-submit"
  );
  const closeButtons = modal.querySelectorAll("[data-contact-close]");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  let modalTimeline;
  let isClosing = false;
  let previouslyFocusedElement;

  function openModal() {
    if (!modal.hidden || isClosing) return;

    previouslyFocusedElement = document.activeElement;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("contact-modal-open");

    modalTimeline?.kill();
    modalTimeline = gsap.timeline();
    modalTimeline
      .fromTo(
        modal,
        { opacity: 0 },
        {
          opacity: 1,
          duration: reducedMotion ? 0.01 : 0.3,
          ease: "power2.out"
        }
      )
      .fromTo(
        dialog,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: reducedMotion ? 0.01 : 0.38,
          ease: "power3.out"
        },
        0
      )
      .fromTo(
        modalContent,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0.01 : 0.24,
          stagger: reducedMotion ? 0 : 0.045,
          ease: "power2.out"
        },
        0.08
      );

    form.querySelector("input")?.focus({ preventScroll: true });
  }

  function closeModal() {
    if (modal.hidden || isClosing) return;

    isClosing = true;
    modalTimeline?.kill();
    modalTimeline = gsap.timeline({
      onComplete: () => {
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("contact-modal-open");
        isClosing = false;
        previouslyFocusedElement?.focus({ preventScroll: true });
      }
    });
    modalTimeline
      .to(dialog, {
        opacity: 0,
        scale: 0.96,
        duration: reducedMotion ? 0.01 : 0.24,
        ease: "power2.in"
      })
      .to(
        modalContent,
        {
          opacity: 0,
          y: -4,
          duration: reducedMotion ? 0.01 : 0.12,
          stagger: reducedMotion ? 0 : 0.015,
          ease: "power1.in"
        },
        0
      )
      .to(
        modal,
        {
          opacity: 0,
          duration: reducedMotion ? 0.01 : 0.18,
          ease: "power2.in"
        },
        0
      );
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && !modal.hidden) {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab" || modal.hidden) return;

    const focusableElements = dialog.querySelectorAll(
      "button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement) {
      event.preventDefault();
    } else if (
      event.shiftKey &&
      (document.activeElement === firstElement ||
        !dialog.contains(document.activeElement))
    ) {
      event.preventDefault();
      lastElement.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === lastElement ||
        !dialog.contains(document.activeElement))
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.textContent =
      "Thanks! Message delivery is not connected yet, so your message was not sent.";
    status.hidden = false;
  }

  function clearStatus() {
    status.hidden = true;
    status.textContent = "";
  }

  trigger.addEventListener("click", openModal);
  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", handleKeydown);
  form.addEventListener("submit", handleSubmit);
  form.addEventListener("input", clearStatus);

  contactModalCleanup = () => {
    trigger.removeEventListener("click", openModal);
    closeButtons.forEach((button) => {
      button.removeEventListener("click", closeModal);
    });
    document.removeEventListener("keydown", handleKeydown);
    form.removeEventListener("submit", handleSubmit);
    form.removeEventListener("input", clearStatus);
    modalTimeline?.kill();
    gsap.killTweensOf([modal, dialog]);
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("contact-modal-open");
  };
}

function initializeAnimations() {
  animationContext?.revert();
  initializeContactModal();

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

    const sectionLabels = gsap.utils.toArray(
      ".section-label:not(.contact-modal-label)"
    );

    sectionLabels.forEach((element) => {
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
    // TECHNICAL SKILLS - STAGGERED REVEAL
    // =====================================

    gsap.utils.toArray(".skill-list").forEach((list) => {
      const skills = list.querySelectorAll(".technical-skill");

      if (!skills.length) return;

      gsap.fromTo(
        skills,
        {
          opacity: 0,
          y: 24,
          scale: 0.96
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: list,
            start: "top 88%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // =====================================
    // PROJECTS - CINEMATIC REVEAL
    // =====================================

    gsap.utils.toArray(".skill-image").forEach((card, index) => {
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
  contactModalCleanup?.();
  contactModalCleanup = undefined;
});
