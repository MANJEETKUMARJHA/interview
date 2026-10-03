const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");
const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");
const scrollProgress = document.querySelector(".scroll-progress span");

const showHeroImage = () => {
  hero.classList.remove("is-loading", "is-failed");
  hero.classList.add("is-ready");
};

const showHeroFallback = () => {
  hero.classList.remove("is-loading", "is-ready");
  hero.classList.add("is-failed");
};

heroImage.addEventListener("load", showHeroImage, { once: true });
heroImage.addEventListener("error", showHeroFallback, { once: true });

if (heroImage.complete) {
  if (heroImage.naturalWidth > 0) {
    showHeroImage();
  } else {
    showHeroFallback();
  }
} else {
  hero.classList.add("is-loading");
}

let progressFrame = 0;
const updateScrollProgress = () => {
  if (progressFrame) return;

  progressFrame = window.requestAnimationFrame(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    progressFrame = 0;
  });
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  document.documentElement.classList.add("has-reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -32px 0px" });

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    revealObserver.observe(element);
  });
}

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    });
  });
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  siteNavigation.classList.toggle("is-open", !isExpanded);
});

siteNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNavigation.classList.remove("is-open");
  }
});

document.querySelector("#proposal-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = formData.get("name").toString().trim();
  const company = formData.get("company").toString().trim();
  const project = formData.get("project").toString().trim();
  const message = [
    "Hello KSA Engineering, I'd like to discuss a project.",
    `Name: ${name}`,
    company ? `Company: ${company}` : "",
    `Project: ${project}`,
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/966570483020?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

document.querySelector("#year").textContent = new Date().getFullYear().toString();
