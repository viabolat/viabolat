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
          <a href="/#fixes" class="block text-2xl font-medium text-gray-100 hover:text-primary-300">What viabolat Fixes</a>
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

  // Fire onEnter(el) once when each element first scrolls into view, then stop
  // observing it. When reduced-motion is requested or IntersectionObserver is
  // unavailable, apply onFallback(el) immediately (final state, no animation).
  const observeOnce = (els, options, onEnter, onFallback = onEnter) => {
    if (!els.length) return;
    if (REDUCED || !("IntersectionObserver" in window)) {
      els.forEach(onFallback);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onEnter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    els.forEach((el) => observer.observe(el));
  };

  // --- Scroll Reveal (.reveal elements fade/slide in on first view) ---
  const showReveal = (el) => el.classList.add("is-visible");
  observeOnce(
    document.querySelectorAll(".reveal"),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    showReveal
  );

  // --- Count-up Stats ---
  // Markup: <span class="stat-num" data-count-to="48" data-suffix="h">0</span>
  // Stats without data-count-to (e.g. ranges) render as static text.
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
  observeOnce(
    document.querySelectorAll("[data-count-to]"),
    { threshold: 0.5 },
    runCount,
    (el) => {
      el.textContent = el.dataset.countTo + (el.dataset.suffix || "");
    }
  );

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
      // Cache the resting rect on enter: mousemove then avoids forcing a layout
      // read every event, and the offset is measured from the untranslated
      // position rather than the live (already-translated) one.
      let rect = null;
      btn.addEventListener("mouseenter", () => {
        rect = btn.getBoundingClientRect();
      });
      btn.addEventListener("mousemove", (e) => {
        if (!rect) return;
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        btn.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        rect = null;
        btn.style.transform = "";
      });
    });
  }
});
