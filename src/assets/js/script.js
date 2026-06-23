// Smooth scroll and auto-close mobile menu
document.addEventListener("DOMContentLoaded", function () {
  // Single motion guard — short-circuits JS-driven animation for users who
  // request reduced motion (CSS has its own master switch as a backstop).
  const REDUCED = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // --- Mobile Menu Logic ---
  const mobileMenuButton = document.querySelector("button.md\\:hidden");
  if (mobileMenuButton) {
    const mobileMenu = document.createElement("div");
    mobileMenu.id = "mobile-menu";
    mobileMenu.className =
      "hidden fixed inset-0 bg-ink-950/95 backdrop-blur z-50 flex flex-col items-center justify-center";
    // reason: link list mirrors the header nav anchors exactly so mobile nav
    // never points at dead anchors (was previously stale Features/Testimonials).
    mobileMenu.innerHTML = `
        <button id="close-mobile-menu" class="absolute top-5 right-5 text-gray-300 hover:text-white" aria-label="Close navigation menu">
          <i class="fas fa-times text-2xl"></i>
        </button>
        <div id="mobile-links" class="space-y-7 text-center">
          <a href="/#how" class="block text-2xl font-medium text-gray-100 hover:text-primary-300">How It Works</a>
          <a href="/#fixes" class="block text-2xl font-medium text-gray-100 hover:text-primary-300">What We Fix</a>
          <a href="/#pricing" class="block text-2xl font-medium text-gray-100 hover:text-primary-300">Pricing</a>
          <a href="/#testimonials" class="block text-2xl font-medium text-gray-100 hover:text-primary-300">Results</a>
          <a href="/#faq" class="block text-2xl font-medium text-gray-100 hover:text-primary-300">FAQ</a>
          <a href="/#contact" class="block text-2xl font-medium text-gray-100 hover:text-primary-300">Contact</a>
        </div>
      `;
    document.body.appendChild(mobileMenu);

    const closeMobileMenuButton = document.getElementById("close-mobile-menu");
    const mobileLinks = document.getElementById("mobile-links");

    const closeMenu = () => {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "auto";
    };

    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });

    closeMobileMenuButton.addEventListener("click", closeMenu);

    mobileLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        closeMenu();
      }
    });

    // Esc key + click on the backdrop (outside the link list) close the menu.
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
        closeMenu();
      }
    });
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });
  }

  // --- Animate on Scroll Logic ---
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".animate-fade-in-up:not(.animated)"
    );
    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      if (elementPosition < screenPosition) {
        element.classList.add("animated");
      }
    });
  };
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Trigger on initial load

  // --- Contact Email Obfuscation ---
  // This prevents basic spam bots from scraping the email address
  // by building it with JavaScript after the page loads.
  const emailUser = "contact";
  const emailDomain = "viabolat.com";
  const fullEmail = emailUser + "@" + emailDomain;

  const contactLink = document.getElementById("contact-link");
  const contactEmailDisplay = document.getElementById("contact-email");

  if (contactLink) {
    contactLink.href = "mailto:" + fullEmail;
  }
  if (contactEmailDisplay) {
    contactEmailDisplay.textContent = fullEmail;
  }

  // --- Scroll Reveal (new .reveal system, IntersectionObserver) ---
  const revealEls = document.querySelectorAll(".reveal");
  if (REDUCED || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // --- Count-up Stats ---
  // Markup: <span class="stat-num" data-count-to="48" data-suffix="h">0</span>
  // Stats without data-count-to (e.g. ranges) render as static text.
  const counters = document.querySelectorAll("[data-count-to]");
  const runCount = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if (REDUCED || !("IntersectionObserver" in window)) {
      counters.forEach((el) => {
        el.textContent = el.dataset.countTo + (el.dataset.suffix || "");
      });
    } else {
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCount(entry.target);
              countObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => countObserver.observe(el));
    }
  }

  // --- FAQ Accordion (accessible, multi-open) ---
  document.querySelectorAll(".faq-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const panel = item.querySelector(".faq-panel");
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      item.classList.toggle("is-open", !expanded);
      panel.classList.toggle("is-open", !expanded);
    });
  });

  // --- Magnetic Buttons (fine pointers only, skip reduced motion) ---
  if (!REDUCED && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".btn-magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }
});
